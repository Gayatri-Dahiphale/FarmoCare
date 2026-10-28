# Farm Problem Reporting & Expert Response System
## REST API Contract

**Version:** 1.0  
**API prefix:** `/api/v1`  
**Status:** Proposed contract for implementation  
**Related documents:** `PRD.md`, `architecture.md`, `database.md`

## 1. API conventions

- Base URL in local development: `http://localhost:5000/api/v1`.
- Use JSON for ordinary request/response bodies.
- Use `multipart/form-data` for file uploads.
- Protected endpoints require a valid authenticated session according to the chosen token strategy.
- The server must authorize every resource access, not merely check that the user is logged in.
- Use ISO 8601 timestamps in responses.
- Use a consistent response envelope.
- Do not return `passwordHash`, JWT secrets, storage credentials, or unnecessary personal data.

## 2. Response formats

### Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed."
}
```

### Paginated list

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "details": [
      { "field": "title", "message": "Title is required." }
    ]
  }
}
```

Recommended HTTP status codes:
- `200 OK`: successful read/update.
- `201 Created`: successful creation.
- `204 No Content`: successful operation with no response body, if consistently adopted.
- `400 Bad Request`: malformed request or invalid transition.
- `401 Unauthorized`: missing/invalid authentication.
- `403 Forbidden`: authenticated user lacks permission.
- `404 Not Found`: resource missing or deliberately concealed to prevent enumeration.
- `409 Conflict`: duplicate identifier or conflicting assignment.
- `413 Payload Too Large`: upload too large.
- `415 Unsupported Media Type`: unsupported file type.
- `422 Unprocessable Entity`: well-formed request that fails business validation, if used consistently.
- `429 Too Many Requests`: rate limit.
- `500 Internal Server Error`: unexpected failure.

## 3. Canonical enums

### Roles
`farmer`, `expert`, `admin`

### Account status
`active`, `inactive`, `pending`

### Problem status
`SUBMITTED`, `ASSIGNED`, `UNDER_REVIEW`, `AWAITING_FARMER_INFORMATION`, `RESPONSE_PROVIDED`, `RESOLVED`, `REOPENED`

### Response type
`EXPERT_RECOMMENDATION`, `INFORMATION_REQUEST`, `FARMER_FOLLOW_UP`, `ADMIN_NOTE`

The frontend should map enum values to readable labels. The backend must validate all enum values and transitions.

## 4. Authentication endpoints

### `POST /auth/register`
**Access:** Public; creates farmer accounts only.

Example request:
```json
{
  "fullName": "Sample Farmer",
  "email": "farmer@example.com",
  "phone": "9000000000",
  "password": "use-a-strong-local-demo-password",
  "location": {
    "village": "Sample Village",
    "district": "Sample District",
    "state": "Maharashtra"
  },
  "preferredLanguage": "mr"
}
```

Rules:
- Require at least one unique identifier: email or phone.
- Validate and normalize identifiers.
- Hash the password.
- Ignore/reject any client-supplied `role`, `accountStatus`, or `passwordHash`.
- Never allow public registration as expert/admin.

Response: `201 Created`, sanitized user data and either a session or an instruction to log in, according to the chosen auth design.

### `POST /auth/login`
**Access:** Public, rate-limited.

Request:
```json
{ "identifier": "farmer@example.com", "password": "..." }
```

Response: authenticated user summary and session/token according to the selected strategy. Avoid distinguishing “unknown email” from “wrong password” in a way that enables account enumeration.

### `POST /auth/logout`
**Access:** Authenticated.
Clear the session cookie or revoke/invalidate the selected token/session according to the implementation.

### `GET /auth/me`
**Access:** Authenticated.
Returns the current user's safe profile and role.

## 5. Farmer endpoints

### `GET /problems/my`
**Access:** Farmer.
Query parameters: `page`, `limit`, `status`, `cropId`, `categoryId`, `from`, `to`, `search`.

Always derive `farmerId` from the authenticated user; do not accept a caller-selected farmer ID as authority.

### `POST /problems`
**Access:** Farmer.
Accept JSON if no file is included or multipart form data when uploading images.

Example fields:
- `title`
- `cropId`
- `categoryId`
- `description`
- `location[village]`
- `location[district]`
- `location[state]`
- optional `images`

The server sets `farmerId`, `reportNumber`, initial status, and timestamps. Validate active crop/category options and file content. Response: `201 Created` with report summary.

### `GET /problems/:id`
**Access:** Owner farmer, authorized assigned expert, or admin.
Return report details appropriate to the caller's role. Do not expose private fields unnecessarily.

### `GET /problems/:id/responses`
**Access:** Owner farmer, authorized assigned expert, or admin.
Return chronologically ordered responses after verifying access to the parent report.

### `POST /problems/:id/follow-ups`
**Access:** Owner farmer; assigned expert may add an authorized response using the expert response endpoint.
Request:
```json
{
  "message": "The symptoms are still present.",
  "issuePersists": true
}
```
Optional attachments may use multipart form data. Create a `FARMER_FOLLOW_UP` response record. Do not allow the farmer to set report status directly. If the case is awaiting information, a successful follow-up may transition it to `UNDER_REVIEW` according to the workflow service.

### `GET /problems/:id/status-history`
**Access:** Owner farmer, authorized assigned expert, or admin.
Return status transitions in chronological order.

## 6. Expert endpoints

All expert endpoints must confirm the authenticated user has the `expert` role and that the case is currently assigned to them, unless policy explicitly grants historical access.

### `GET /expert/problems`
Query parameters: `page`, `limit`, `status`, `cropId`, `categoryId`, `from`, `to`, `search`.

Return only authorized cases for the current expert.

### `GET /expert/problems/:id`
Return the case detail view, attachment references, response history, status history, and similar-case summary as appropriate.

### `POST /expert/problems/:id/responses`
Request example:
```json
{
  "responseType": "EXPERT_RECOMMENDATION",
  "message": "Based on the information provided, please share a clearer image of the affected leaves.",
  "observations": "The current photograph is not sufficient for a reliable assessment.",
  "recommendations": [
    "Provide a close-up image of affected and healthy leaves."
  ]
}
```

Rules:
- `responseType` must be an allowed expert response type (`EXPERT_RECOMMENDATION` or `INFORMATION_REQUEST`).
- Validate required fields for the selected type.
- Store the author and timestamp server-side.
- Preserve prior responses.
- Update activity timestamps and create a notification if notifications are enabled.
- An expert must not claim certainty beyond the information available.

### `PATCH /expert/problems/:id/status`
Request:
```json
{
  "status": "RESOLVED",
  "reason": "Resolution confirmed after follow-up."
}
```

The service validates the current status, actor, and allowed transition. It writes status history. An expert cannot modify a report outside their permitted assignments.

### `GET /expert/problems/:id/similar-cases`
Access: authorized expert for this report.
Query parameters: `limit` (bounded).
Return only resolved cases with a usable response/resolution record matching the configured crop/category criteria. Include match explanation/score only if actually calculated. Do not expose unnecessary farmer contact information. A similarity score is not a diagnosis.

## 7. Admin endpoints

All admin routes require role `admin`, plus resource-specific validation.

### Dashboard and reports
- `GET /admin/dashboard`
- `GET /admin/reports/statistics?from=&to=`
- `GET /admin/problems?page=&limit=&status=&cropId=&categoryId=&expertId=&from=&to=&search=`

### Assignment
- `POST /admin/problems/:id/assign`

Request:
```json
{ "expertId": "VALID_MONGODB_OBJECT_ID" }
```

Validate that the target report is assignable and the expert account is active. Record the assignment, update the current expert, and set status to `ASSIGNED` where appropriate.

- `PATCH /admin/problems/:id/reassign`

Request:
```json
{
  "expertId": "VALID_MONGODB_OBJECT_ID",
  "reason": "Workload balancing"
}
```

End the previous assignment and preserve it in history before creating the new active assignment.

### User management
- `GET /admin/users?page=&limit=&role=&accountStatus=&search=`
- `GET /admin/users/:id`
- `POST /admin/experts` — create expert account through an authorized process.
- `PATCH /admin/users/:id/status` — activate/deactivate or set pending status as allowed.
- `PATCH /admin/users/:id` — update permitted profile fields.

Never permit an administrator to accidentally remove the last usable admin account without a deliberate policy and safeguard.

### Crops
- `GET /admin/crops`
- `POST /admin/crops`
- `PATCH /admin/crops/:id`

### Categories
- `GET /admin/categories`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`

Use soft deactivation for referenced crops/categories.

## 8. Notifications (P1)

- `GET /notifications?page=&limit=&unreadOnly=`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

A user may access or mark read only their own notifications.

## 9. Pagination, filtering and search

- Default `page=1`, `limit=20`.
- Enforce a maximum limit (for example, 100).
- Validate page and limit as positive integers.
- Use indexed fields where practical.
- Escape or safely handle search text; never concatenate untrusted input into database operators.
- Apply role and ownership filters before pagination/counts.
- Return pagination metadata consistently.

## 10. Security and authorization requirements

- Validate ObjectId path parameters.
- Verify ownership/assignment for each report, response, history, and attachment request.
- Do not trust IDs or roles supplied in request bodies.
- Use rate limiting on login and other sensitive operations.
- Configure CORS for approved frontend origins.
- Validate file size and actual content/type.
- Never return stack traces or internal secrets.
- Log administrative actions without logging credentials or tokens.
- Use HTTPS in deployment.

## 11. Minimum endpoint implementation order

1. Auth: register, login, logout, me.
2. Farmer: create report, list own reports, report detail.
3. Admin: list reports, assign/reassign, user/crop/category management.
4. Expert: list assigned reports, report detail, responses, status changes.
5. Farmer follow-ups and status history.
6. Similar cases.
7. Dashboard statistics, notifications, exports.

## 12. API completion checklist

- [ ] Every route has a documented access policy.
- [ ] Input and path parameters are validated.
- [ ] Resource ownership/assignment is verified.
- [ ] Error format is consistent.
- [ ] Lists are paginated.
- [ ] Responses never expose password hashes or secrets.
- [ ] Status and assignment changes preserve history.
- [ ] Similar-case responses are filtered and privacy-aware.
- [ ] API integration tests cover permitted and forbidden operations.
