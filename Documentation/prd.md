# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Farm Problem Reporting & Expert Response System

**Document Version:** 1.0  
**Project Type:** Academic Minor Project — Full-Stack Web Development  
**Domain:** Agriculture, AgriTech and Farmer Support Services  
**Target Development Duration:** 20 Days  
**Frontend:** React.js  
**Backend:** Node.js and Express.js  
**Database:** MongoDB  
**Authentication:** JWT and Role-Based Access Control  
**Primary Users:** Farmers, Agriculture Experts and Administrators

---

# 1. Executive Summary

The Farm Problem Reporting & Expert Response System is a web-based application designed to connect farmers with agricultural experts through a structured digital reporting and response process.

Farmers frequently experience crop diseases, pest attacks, irrigation issues, soil problems, fertilizer-related concerns, weather damage and other agricultural challenges. Obtaining expert guidance may require visiting agricultural offices or contacting experts through informal communication channels. Such methods may lack centralized records, transparent progress tracking and organized follow-up.

The proposed application allows farmers to register, submit agricultural problem reports with photographs, select crops and problem categories, provide location details, and monitor the status of their reports.

Agricultural experts can review assigned reports, examine photographs and descriptions, request additional information, provide recommendations, and update case statuses. Administrators manage user accounts, assign reports to appropriate experts, maintain agricultural categories, and monitor system performance.

The system's distinguishing feature is **Similar Solved Problems**, which retrieves relevant previously resolved cases based on crop, category and problem description. These cases provide useful reference material for experts while preparing responses to new reports.

The project aims to improve the organization, accessibility and traceability of agricultural support without claiming to replace professional agricultural judgment.

# 2. Product Vision and Goals

## 2.1 Vision

To develop a simple, secure and accessible digital service that helps farmers report agricultural problems and receive structured guidance from agricultural experts.

## 2.2 Primary goals

1. Provide a centralized platform for agricultural problem reporting.
2. Allow farmers to submit detailed reports with photographic evidence.
3. Connect each report with an appropriate agricultural expert.
4. Enable experts to communicate recommendations and request additional details.
5. Allow farmers to track report progress and view response history.
6. Help experts reference similar previously resolved cases.
7. Provide administrators with operational statistics and reports.
8. Maintain secure access to information according to user roles.

## 2.3 Success criteria

The first release will be considered successful when:

- A farmer can register, log in and submit a valid problem report.
- Uploaded photographs and problem details are stored and displayed correctly.
- An administrator can assign a report to an expert.
- An expert can review the report and submit a response.
- The farmer can view the response and current status.
- Follow-up information can be submitted and reviewed.
- Similar resolved cases can be retrieved using matching criteria.
- Dashboard statistics reflect stored records.
- Unauthorized users cannot access restricted operations.
- The application can be demonstrated end-to-end without manual database intervention.

# 3. Scope of the Product

## 3.1 In scope — Version 1.0

- Public landing page.
- Farmer registration and login.
- Expert login and administrator login.
- Role-based dashboards.
- Farmer profile management.
- Agricultural problem submission.
- Crop and problem-category selection.
- Photo upload.
- Location and problem-description fields.
- Farmer problem history and tracking.
- Admin review and expert assignment.
- Expert case management.
- Expert recommendations.
- Requests for additional information.
- Follow-up communication.
- Problem status history.
- Similar solved problems.
- Crop and category management.
- User and expert management.
- Dashboard statistics and basic reports.
- Input validation, access control and error handling.
- Responsive desktop and mobile layouts.

## 3.2 Out of scope for the first release

The following are optional future enhancements and should not delay the core project:

- Automatic crop disease diagnosis using machine learning.
- AI-generated pesticide or fertilizer prescriptions.
- Real-time video consultations.
- Direct integration with government agricultural databases.
- Payment processing.
- Online purchase of agricultural products.
- IoT sensor integration.
- Native Android or iOS applications.
- Automatic weather alerts from external APIs.
- SMS or WhatsApp notifications requiring paid services.
- Advanced geospatial analysis.
- Multilingual voice assistants.

The first release should focus on a reliable reporting and expert-response workflow.

# 4. Target Users and User Roles

## 4.1 Farmer

A farmer is the person experiencing an agricultural problem and requesting assistance.

**Responsibilities:**
- Maintain a basic user profile.
- Submit accurate problem information.
- Upload relevant photographs.
- Provide location and crop details.
- Review expert recommendations.
- Respond to requests for additional information.
- Track progress and submit follow-ups.

**Permissions:**
- View and edit permitted profile fields.
- Create new problem reports.
- View their own reports and related responses.
- Submit follow-up information on their own cases.
- View their own report history.

A farmer must not access other farmers' private reports or modify expert assignments.

## 4.2 Agriculture Expert

An agriculture expert reviews reports and provides professional guidance.

**Responsibilities:**
- Review assigned cases.
- Examine problem descriptions and photographs.
- Request missing information.
- Provide recommendations.
- Update permitted case statuses.
- Review relevant historical cases.
- Maintain a record of responses.

**Permissions:**
- View reports assigned to them.
- View information necessary to handle those reports.
- Submit recommendations and follow-up requests.
- Update permitted statuses.
- Access similar solved cases.
- Review cases they previously handled, according to system policy.

Experts must not manage administrator accounts or arbitrarily reassign cases outside their permissions.

## 4.3 Administrator

The administrator manages system operations.

**Responsibilities:**
- Manage farmer and expert accounts.
- Verify expert profiles where required.
- Review incoming reports.
- Assign suitable experts.
- Manage crops and problem categories.
- Monitor pending and resolved cases.
- Review operational statistics.
- Investigate assignment or workflow issues.

**Permissions:**
- Access the administrative dashboard.
- Manage permitted user records.
- Assign and reassign cases.
- Manage categories and crop lists.
- View system-wide reports.
- Review assignment and status history.

Administrative actions must be authorized on the backend, not merely hidden in the user interface.

# 5. Functional Requirements

Functional requirements define what the application must do.

## FR-01: Public Landing Page

The application must provide a public homepage introducing the service.

**Required elements:**
- Project logo and name.
- Short explanation of the service.
- Benefits for farmers and experts.
- Steps explaining how reporting works.
- Problem-category overview.
- Login and registration links.
- Contact or help information.

**Acceptance criteria:**
- Visitors can understand the purpose of the application.
- Registration and login links navigate to the correct pages.
- The page is responsive on mobile and desktop devices.

## FR-02: Registration and Authentication

The system must support secure authentication for farmers and authorized staff.

**Farmer registration fields:**
- Full name.
- Mobile number or email address.
- Password.
- Village or locality.
- District.
- State.
- Optional preferred language.

**Staff authentication:**
- Experts and administrators should use accounts created or approved through an authorized administrative process.
- Public registration must not allow a visitor to become an administrator by selecting a role.

**Requirements:**
- Validate required fields.
- Prevent duplicate accounts using the selected unique identifier.
- Hash passwords before storing them.
- Authenticate users using a secure login flow.
- Use JWT with appropriate expiry and secure handling.
- Support logout and expired-session handling.
- Restrict access according to user role.

**Acceptance criteria:**
- Valid users can log in successfully.
- Invalid credentials produce a clear error.
- Unauthorized users cannot access protected routes or API endpoints.
- Passwords are never stored in plaintext.

## FR-03: Farmer Dashboard

The farmer dashboard provides an overview of the farmer's agricultural reports.

**Dashboard components:**
- Welcome message.
- Total reports submitted.
- Reports awaiting assignment.
- Reports under review.
- Reports requiring additional information.
- Resolved reports.
- Recent report activity.
- Button to report a new problem.
- Recent expert responses.

The dashboard must display counts based on the authenticated farmer's records.

## FR-04: Agricultural Problem Reporting

Farmers must be able to submit an agricultural problem through a structured form.

**Required fields:**

| Field | Description |
|---|---|
| Report title | Short description of the issue |
| Crop | Crop affected by the problem |
| Problem category | Type of agricultural problem |
| Description | Detailed explanation of symptoms or issue |
| Location | Village or locality and relevant district |
| Photograph | Optional or required according to the final validation policy |
| Submission date | Generated automatically by the system |

**Optional fields:**
- Approximate date when the problem began.
- Affected field area.
- Crop growth stage.
- Additional observations.
- Multiple photographs, if supported by the upload implementation.

**Problem categories:**
- Crop Disease.
- Pest Attack.
- Irrigation Problem.
- Soil Problem.
- Fertilizer Issue.
- Weather/Crop Damage.
- Poor Crop Growth.
- Other Agricultural Problems.

**Requirements:**
- Provide a dropdown for crop selection.
- Provide a dropdown for problem category.
- Validate the report title and description.
- Validate uploaded files.
- Generate a unique report identifier.
- Save the report with its initial status.
- Confirm successful submission to the farmer.

**Acceptance criteria:**
- A valid report is stored and receives a unique identifier.
- The report appears in the farmer's report list.
- Invalid submissions display understandable validation messages.
- The farmer can view the details of the submitted report.

## FR-05: Photograph Upload

The system must support photographic evidence for agricultural problems.

**Requirements:**
- Accept supported image formats such as JPEG, PNG and WebP.
- Enforce a configurable maximum file size.
- Validate actual file type rather than trusting only the filename.
- Generate safe storage names.
- Store the resulting file URL or storage reference with the report.
- Display uploaded images to authorized users.
- Handle failed uploads without creating incomplete reports.

For a production deployment, use a dedicated file-storage service rather than relying on temporary local storage.

Possible options include Cloudinary or an object-storage service.

**Acceptance criteria:**
- Supported photographs upload successfully.
- Unsupported or oversized files are rejected.
- Broken or missing images do not crash the page.
- Only authorized users can access private case attachments where privacy is required.

## FR-06: Farmer Report Tracking

Farmers must be able to track the progress of each submitted report.

**Required report details:**
- Unique report ID.
- Submission date.
- Crop and problem category.
- Current status.
- Assigned expert information, where appropriate.
- Latest expert response.
- Follow-up history.
- Status-change timeline.

**Farmer-visible statuses:**
- Submitted.
- Under Review.
- Assigned.
- Awaiting Farmer Information.
- Response Provided.
- Resolved.
- Reopened.

The interface should explain what each status means in simple language.

**Acceptance criteria:**
- Farmers see the current stored status.
- Farmers can open a report to view its timeline.
- Farmers cannot change a report's status directly.
- Status changes made by authorized users appear when the page is refreshed or data is refetched.

## FR-07: Expert Dashboard

The expert dashboard must display the cases relevant to the authenticated expert.

**Dashboard elements:**
- Assigned cases.
- Newly assigned cases.
- Cases awaiting expert review.
- Cases awaiting farmer information.
- Cases with responses already provided.
- Resolved cases.
- Recently updated cases.

**Filters:**
- Status.
- Crop.
- Problem category.
- Submission date.
- Report ID.

**Acceptance criteria:**
- Experts see only cases they are permitted to access.
- Filters return matching records.
- Selecting a case opens its detailed view.

## FR-08: Expert Case Review

An expert must be able to examine a complete assigned report.

**Case details include:**
- Report identifier.
- Farmer-provided description.
- Crop and problem category.
- Location details.
- Photographs.
- Submission date.
- Previous responses and follow-ups.
- Status history.
- Similar solved problems.

The expert should be able to request additional information before providing a final recommendation.

**Acceptance criteria:**
- Relevant report information is displayed correctly.
- Experts can review the case history.
- Unauthorized experts cannot modify or respond to unrelated cases.

## FR-09: Expert Recommendations

Experts must be able to provide structured responses to farmers.

**Response fields:**
- Response message.
- Observations or preliminary assessment.
- Recommended next steps.
- Additional information requested, if applicable.
- Relevant precautionary notes.
- Response timestamp.

Recommendations must be entered by the expert in Version 1.0.

The application must not present automatically generated or unverified treatment instructions as confirmed expert advice.

**Acceptance criteria:**
- A response is saved and associated with the correct report.
- The farmer can view the response.
- The response author and timestamp are recorded.
- Response history is preserved rather than silently overwritten.

## FR-10: Follow-Up Communication

The farmer and expert must be able to continue communication about an existing report.

**Farmer capabilities:**
- Submit additional observations.
- Upload additional photographs, if supported.
- Answer an expert's information request.
- Indicate whether the issue persists.

**Expert capabilities:**
- Review the farmer's follow-up.
- Ask further questions.
- Add recommendations.
- Resolve or reopen the case according to workflow rules.

Every follow-up should include its author, content and timestamp.

**Acceptance criteria:**
- Follow-ups appear in chronological order.
- The other authorized participant can view the follow-up.
- Each follow-up remains associated with the original report.

## FR-11: Admin Dashboard

The administrator dashboard must provide a system-wide overview.

**Key metrics:**
- Total registered farmers.
- Total active experts.
- Total reports.
- Unassigned reports.
- Reports under review.
- Reports awaiting farmer information.
- Resolved reports.
- Reopened reports.

**Charts:**
- Reports by problem category.
- Reports by crop.
- Reports by status.
- Reports submitted over time.
- Expert workload distribution.

Use Chart.js for visualization.

**Acceptance criteria:**
- Statistics are calculated from database records.
- Filters or date ranges work where implemented.
- Empty datasets display a useful empty state.
- Dashboard counts do not rely on hardcoded demonstration values.

## FR-12: User Management

Administrators must be able to manage user accounts.

**Required capabilities:**
- View and search users.
- Filter by role and account status.
- View basic user details.
- Create or approve expert accounts.
- Activate or deactivate accounts.
- Update permitted profile fields.

Destructive actions should use confirmation dialogs.

User deactivation should not delete historical reports or responses.

**Acceptance criteria:**
- Only administrators can manage user accounts.
- Deactivated users cannot start new authenticated sessions.
- Existing historical records remain intact.

## FR-13: Expert Assignment

Administrators must be able to assign an unassigned report to an appropriate expert.

**Assignment criteria may include:**
- Expert's area of specialization.
- Crop or problem-category expertise.
- District or service area.
- Current workload.
- Expert availability, if maintained.

For the first version, assignment can be performed manually using an expert-selection dropdown.

**Workflow:**
1. Admin opens an unassigned report.
2. Admin reviews its crop, category and location.
3. Admin selects an appropriate expert.
4. The system validates the assignment.
5. The assigned expert can view the case.
6. The system records the assignment and timestamp.

The system should support reassignment when necessary and retain assignment history.

**Acceptance criteria:**
- An authorized administrator can assign or reassign a report.
- The selected expert can see the assigned report.
- Assignment information is stored persistently.
- Unassigned reports remain visible in the admin queue.

## FR-14: Crop and Category Management

Administrators must be able to manage the available crop and problem-category lists.

**Capabilities:**
- Add a crop.
- Edit a crop's display name.
- Activate or deactivate a crop.
- Add a problem category.
- Edit category descriptions.
- Activate or deactivate a category.

Previously submitted reports must retain their original crop and category references even if an option is later deactivated.

## FR-15: Similar Solved Problems

This is the primary differentiating feature of the application.

### Objective

Help experts find previously resolved agricultural cases that may be relevant to a newly assigned report.

### Input

- Current crop.
- Current problem category.
- Problem title.
- Problem description.
- Optional keywords.

### Initial matching logic

The backend should retrieve resolved cases matching the new report's crop and problem category. It may then rank candidates using simple keyword overlap.

A possible first-release scoring model is:

- Crop match: 40%.
- Problem-category match: 35%.
- Description keyword similarity: 25%.

These weights are configurable design choices, not scientifically validated measures of diagnostic accuracy. The implementation must define how each component is normalized.

If crop and category are mandatory for the initial query, candidates should first satisfy those filters. The remaining score can rank the matching cases.

### Displayed information

Each result should show:
- Historical report ID.
- Crop.
- Problem category.
- Original problem summary.
- Previous expert response.
- Resolution notes, if recorded.
- Resolution date.
- Similarity score or match explanation, if calculated.

### Example

A new report concerns cotton crop disease. The expert dashboard retrieves earlier resolved cotton crop-disease reports and displays their recorded recommendations.

The expert can compare the historical cases with the new report before preparing a response.

### Rules and limitations

- Only appropriately authorized experts can access private historical cases.
- Historical recommendations must retain their original context.
- Similarity must not be described as proof of the same disease.
- A resolved case must have a usable response or resolution record to be helpful.
- If no suitable cases exist, show a clear message.
- The expert remains responsible for the final recommendation.

### Acceptance criteria

- Similar resolved cases can be retrieved from stored records.
- Matching respects the configured crop and category filters.
- Irrelevant or unrelated users' private data is not exposed.
- The feature works without requiring an external AI API.
- A newly created case becomes eligible for future retrieval after it is resolved and has sufficient historical information.

## FR-16: Search, Filters and Pagination

The system should support efficient retrieval of reports and users.

**Search options:**
- Report ID.
- Report title.
- Crop.
- Problem category.
- Status.
- Assigned expert.
- Submission date range.

Pagination must be applied to large lists.

Search and filter operations must enforce the current user's permissions before returning results.

## FR-17: Notifications and Feedback

The first release should display in-app notifications or activity indicators for important events.

Possible events:
- Report submitted.
- Expert assigned.
- Expert response added.
- Additional information requested.
- Status changed.
- Report resolved or reopened.

A notification should include a short message, timestamp, read status and a link to the relevant report.

Email, SMS and WhatsApp delivery are optional enhancements and may require external services.

## FR-18: Reporting and Export

Administrators should be able to view operational summaries.

**Required report types:**
- Total reports by status.
- Reports by category.
- Reports by crop.
- Reports by date range.
- Expert workload.
- Resolved versus unresolved reports.

CSV export is a suitable optional enhancement for the first release.

Exports must respect administrative permissions and avoid unnecessary disclosure of private farmer information.

# 6. Detailed User Workflows

## 6.1 Farmer workflow

1. Open the website.
2. Register or log in.
3. Access the farmer dashboard.
4. Select "Report a Problem."
5. Enter the crop, category, description and location.
6. Upload a photograph if available.
7. Submit the report.
8. Receive a unique report ID.
9. View the report in "My Reports."
10. Wait for assignment and expert review.
11. Read the expert's response.
12. Submit additional information if requested.
13. Track the case until resolution.
14. Reopen or follow up according to the system's rules if the problem persists.

## 6.2 Expert workflow

1. Log in to the expert portal.
2. Open the assigned-cases list.
3. Select a report.
4. Review the description, images and location.
5. Examine similar solved problems.
6. Request additional information if required.
7. Record recommendations.
8. Update the case status.
9. Review farmer follow-ups.
10. Resolve the case when appropriate.
11. Reopen it if further work becomes necessary.

## 6.3 Administrator workflow

1. Log in to the admin portal.
2. Review new and unassigned reports.
3. Inspect the crop, category and location.
4. Select a suitable expert.
5. Confirm the assignment.
6. Monitor the case's progress.
7. Reassign cases if required.
8. Manage users, categories and crops.
9. Review dashboard statistics.
10. Generate operational reports.

# 7. Problem Status and Workflow Rules

The application must implement a controlled status-transition process.

| Current status | Permitted next status | Typical actor |
|---|---|---|
| Submitted | Assigned | Admin |
| Submitted | Under Review | Admin or authorized expert |
| Assigned | Under Review | Assigned expert |
| Under Review | Awaiting Farmer Information | Assigned expert |
| Awaiting Farmer Information | Under Review | Farmer response triggers review |
| Under Review | Response Provided | Assigned expert |
| Response Provided | Resolved | Authorized expert |
| Resolved | Reopened | Authorized expert or permitted admin action |
| Reopened | Under Review | Assigned expert |

The exact transition rules should be enforced in the backend.

The interface should not permit arbitrary status changes simply because a user can modify a request.

When a status changes, the system must record the previous status, new status, actor and timestamp.

The application should distinguish between a response being sent and a case being resolved. Providing advice does not necessarily mean the farmer's problem has been solved.

# 8. UI/UX Requirements

## 8.1 Design principles

- Clean, modern agricultural-service interface.
- Responsive layout for mobile, tablet and desktop.
- Simple navigation suitable for users with different levels of technical experience.
- Clear labels and readable typography.
- Accessible color contrast.
- Consistent buttons, forms, cards and status indicators.
- Friendly validation and error messages.
- Confirmation before destructive actions.
- Loading, empty and error states for all major data views.

## 8.2 Suggested visual direction

**Theme:** Agriculture-inspired green, white and neutral backgrounds.

**Typography:** Readable sans-serif font with support for the chosen languages.

**Visual elements:** Crop photographs, simple agricultural icons, report cards, status badges, and clean dashboard charts.

Color should not be the only indicator of status; include status text or icons.

## 8.3 Required pages

### Public pages
- Home.
- About the service.
- Login.
- Farmer registration.
- Help or contact.

### Farmer pages
- Farmer dashboard.
- New problem report.
- My reports.
- Report details and timeline.
- Expert response and follow-up.
- Profile and settings.

### Expert pages
- Expert dashboard.
- Assigned cases.
- Case details.
- Similar solved problems.
- Add response.
- Request information.
- Case history.
- Profile.

### Admin pages
- Admin dashboard.
- Farmer management.
- Expert management.
- All problem reports.
- Unassigned reports.
- Assignment interface.
- Crop management.
- Category management.
- Statistics and reports.
- System activity and settings.

The navigation should change according to the authenticated user's role.

# 9. Database Requirements

Use MongoDB with Mongoose for schema definitions, validation and database access.

The following collections are recommended.

## 9.1 Users

Suggested fields:

- `_id`
- `fullName`
- `email` or `phone`
- `passwordHash`
- `role`: farmer, expert or admin
- `accountStatus`
- `preferredLanguage`
- `location`
- `expertise` (experts only)
- `createdAt`
- `updatedAt`

Authentication identifiers must be unique.

## 9.2 Problems

Suggested fields:

- `_id`
- `reportNumber`
- `farmerId`
- `title`
- `cropId` or crop reference
- `categoryId` or category reference
- `description`
- `location`
- `imageUrls`
- `status`
- `assignedExpertId`
- `submittedAt`
- `updatedAt`
- `resolvedAt`

Create indexes for commonly queried fields, including report number, farmer ID, assigned expert ID, status, crop and category.

## 9.3 Responses

Suggested fields:

- `_id`
- `problemId`
- `authorId`
- `responseType`
- `message`
- `recommendations`
- `requestedInformation`
- `attachments`
- `createdAt`

The `responseType` could distinguish an expert recommendation, information request and farmer follow-up.

## 9.4 Status History

Suggested fields:

- `_id`
- `problemId`
- `previousStatus`
- `newStatus`
- `changedBy`
- `reason`
- `createdAt`

This collection provides a reliable audit trail for workflow changes.

## 9.5 Assignments

Suggested fields:

- `_id`
- `problemId`
- `expertId`
- `assignedBy`
- `assignmentStatus`
- `assignedAt`
- `endedAt`
- `reassignmentReason`

This preserves assignment history when a report changes experts.

## 9.6 Crops

Suggested fields:

- `_id`
- `name`
- `localNames`
- `description`
- `isActive`
- `createdAt`

## 9.7 Problem Categories

Suggested fields:

- `_id`
- `name`
- `description`
- `isActive`
- `createdAt`

## 9.8 Notifications

Suggested fields:

- `_id`
- `recipientId`
- `problemId`
- `type`
- `message`
- `isRead`
- `createdAt`

## 9.9 Data integrity rules

- Each problem must reference an existing farmer.
- A report number must be unique.
- An assigned expert must be a valid, active expert.
- Every response must reference an existing report and author.
- Every status transition must be authorized.
- Deactivated users and categories must not invalidate historical reports.
- Use appropriate indexes and pagination to maintain performance.

For a 20-day project, implement only the collections needed for the selected features. Collections may be combined where doing so does not compromise history or permissions.

# 10. Technical Architecture

## 10.1 Architecture overview

The application follows a client-server architecture.

**Presentation layer:** React.js provides the user interface, forms, dashboards, charts and navigation.

**Application layer:** Node.js and Express.js handle requests, business logic, authentication, authorization, validation and workflow transitions.

**Data layer:** MongoDB stores users, reports, assignments, responses, notifications and historical records.

**File storage:** A file-storage service stores uploaded images and returns their references.

**Visualization:** Chart.js displays administrative statistics.

## 10.2 Request flow

1. A user performs an action in React.
2. React sends an HTTP request to the Express API.
3. Authentication middleware validates the user's session or token.
4. Authorization middleware checks the user's role and resource permissions.
5. Validation middleware checks the request data.
6. The business-logic layer performs the requested operation.
7. Mongoose queries or updates MongoDB.
8. The backend returns a structured response.
9. React updates the page and displays feedback.

## 10.3 Recommended technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | UI and interactive pages |
| Routing | React Router | Page navigation |
| Styling | Tailwind CSS or CSS modules | Responsive styling |
| HTTP client | Fetch or Axios | API communication |
| Backend | Node.js | JavaScript runtime |
| API framework | Express.js | REST API |
| Database | MongoDB | Persistent data storage |
| ODM | Mongoose | Schemas and database operations |
| Authentication | JWT | Authenticated requests |
| Password security | bcrypt or Argon2 | Password hashing |
| Charts | Chart.js | Dashboard visualization |
| Image storage | Cloudinary or object storage | Uploaded photographs |
| Validation | Zod, Joi or express-validator | Input validation |
| Version control | Git and GitHub | Source control |
| Deployment | Suitable frontend and backend hosting | Public demonstration |

Choose one implementation option for each layer instead of introducing unnecessary libraries.

# 11. REST API Requirements

Use a consistent API prefix such as `/api/v1`.

## 11.1 Authentication APIs

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Expert and admin account creation should be restricted to an authorized workflow.

## 11.2 Farmer problem APIs

- `POST /api/v1/problems`
- `GET /api/v1/problems/my`
- `GET /api/v1/problems/:id`
- `POST /api/v1/problems/:id/follow-ups`
- `GET /api/v1/problems/:id/responses`

## 11.3 Expert APIs

- `GET /api/v1/expert/problems`
- `GET /api/v1/expert/problems/:id`
- `POST /api/v1/expert/problems/:id/responses`
- `PATCH /api/v1/expert/problems/:id/status`
- `GET /api/v1/expert/problems/:id/similar-cases`

## 11.4 Admin APIs

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/problems`
- `POST /api/v1/admin/problems/:id/assign`
- `PATCH /api/v1/admin/problems/:id/reassign`
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/status`
- `GET /api/v1/admin/crops`
- `POST /api/v1/admin/crops`
- `PATCH /api/v1/admin/crops/:id`
- `GET /api/v1/admin/categories`
- `POST /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/:id`
- `GET /api/v1/admin/reports/statistics`

All endpoints must validate input, enforce authorization and return consistent error responses.

The list above is an API design proposal, not a claim that these endpoints already exist.

# 12. Non-Functional Requirements

## 12.1 Security

- Hash passwords using a suitable password-hashing algorithm.
- Validate authentication and permissions on every protected API.
- Prevent users from accessing records by changing an ID in the URL.
- Validate and sanitize all user inputs.
- Restrict image size and file type.
- Protect against common injection, cross-site scripting and request-forgery risks.
- Apply appropriate rate limits to login and other sensitive endpoints.
- Use HTTPS in deployment.
- Store secrets in environment variables.
- Never commit database credentials or JWT secrets to GitHub.
- Configure CORS for the intended frontend origin.
- Maintain appropriate logs for important administrative actions.

JWT storage and cookie configuration must be selected carefully. If using cookies, configure `HttpOnly`, `Secure` and appropriate `SameSite` attributes and apply CSRF protection where required.

## 12.2 Performance

For the academic prototype:

- Use pagination for reports and user lists.
- Add indexes to frequently queried fields.
- Avoid loading all reports at once.
- Optimize uploaded image sizes where practical.
- Use database aggregation for dashboard counts.
- Keep API responses limited to the fields needed by the interface.

A proposed initial target is for common API requests to complete within two seconds under a small demonstration workload, excluding slow network conditions and large uploads. This is a target to test, not a guaranteed measurement.

## 12.3 Reliability

- Show meaningful errors when a request fails.
- Prevent duplicate submissions where practical.
- Handle failed image uploads.
- Record status and assignment history.
- Avoid partial updates that leave inconsistent records.
- Use appropriate database transactions or compensating logic for multi-step operations when necessary.

## 12.4 Accessibility and usability

- Support keyboard navigation for major interactions.
- Provide labels for form fields.
- Show validation messages near relevant inputs.
- Use readable text and adequate contrast.
- Support narrow mobile screens.
- Use understandable status descriptions.

## 12.5 Maintainability

- Use separate frontend and backend modules.
- Keep controllers, routes, models and middleware organized.
- Centralize error handling.
- Reuse validation and authorization logic.
- Use consistent naming conventions.
- Document environment setup and API behavior.

# 13. Suggested Project Structure

```text
farm-problem-system/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── farmer/
│       │   ├── expert/
│       │   └── admin/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── validators/
│       ├── utils/
│       ├── app.js
│       └── server.js
├── docs/
│   ├── PRD.md
│   └── API.md
├── .gitignore
├── README.md
└── package.json
```

Keep configuration and secrets outside source code. A separate package configuration for the frontend and backend is also acceptable.

# 14. Permissions Matrix

| Operation | Farmer | Expert | Admin |
|---|---|---|---|
| Submit problem | Yes | No | Optional administrative creation |
| View own reports | Yes | No, unless assigned | Yes |
| View assigned reports | No | Yes | Yes |
| Assign an expert | No | No | Yes |
| Add expert response | No | Yes, for authorized cases | Optional administrative note |
| Submit follow-up | Yes, for own cases | Yes, for assigned cases | Administrative intervention |
| Change workflow status | No direct control | Within permitted transitions | Authorized administrative actions |
| Manage crops/categories | No | No | Yes |
| Manage user accounts | No | No | Yes |
| View system-wide statistics | No | Own workload only | Yes |
| View similar resolved cases | No | Yes, when authorized | Yes, for administration |

This matrix is the intended policy. Implement it in backend middleware and service logic rather than relying only on frontend route protection.

# 15. Acceptance Testing

The following scenarios must pass before the first release.

**Authentication**
- A farmer can register and log in.
- Invalid credentials are rejected.
- An expert cannot access admin-only APIs.
- A deactivated user cannot continue using an invalidated session.

**Problem reporting**
- A valid report is stored with a unique ID.
- Invalid required fields are rejected.
- A supported image uploads successfully.
- An unsupported image is rejected.
- The farmer sees the submitted report.

**Assignment**
- An admin can assign a report to an active expert.
- The report appears in that expert's assigned list.
- Assignment history is recorded.
- An unauthorized user cannot change an assignment.

**Expert response**
- An assigned expert can review a report.
- An authorized response is stored and timestamped.
- The farmer can read the response.
- Unauthorized experts cannot respond to unrelated reports.

**Follow-up and status**
- A farmer can submit follow-up information on their own report.
- Follow-ups appear in chronological order.
- An invalid status transition is rejected.
- A valid status change creates a history entry.
- Resolved cases can be reopened according to policy.

**Similar solved problems**
- Matching historical cases are retrieved.
- Crop and category filters work.
- Cases without relevant matches display a useful empty state.
- The feature does not expose unauthorized private information.

**Administration and reporting**
- User and category management work.
- Dashboard metrics match database records.
- Filters and pagination work.
- The application handles empty datasets and API errors gracefully.

# 16. Development Plan — 20 Days

## Phase 1: Foundation — Days 1–3

**Day 1**
- Finalize requirements and page list.
- Create the GitHub repository.
- Set up React and Express projects.
- Configure environment variables.

**Day 2**
- Connect MongoDB.
- Create user, problem, crop and category schemas.
- Define API conventions.
- Prepare the initial UI layout.

**Day 3**
- Implement registration and login.
- Add password hashing.
- Implement JWT authentication and role authorization.
- Test protected routes.

**Deliverable:** Running frontend, backend and secure basic authentication.

## Phase 2: Farmer Module — Days 4–7

**Day 4**
- Build farmer dashboard.
- Implement profile display.
- Add navigation and route protection.

**Day 5**
- Build the problem-report form.
- Add crop and category selection.
- Implement validation.

**Day 6**
- Implement photograph upload.
- Save report details and image references.
- Generate unique report identifiers.

**Day 7**
- Build My Reports and report details.
- Display status and submission history.
- Test the complete reporting flow.

**Deliverable:** A farmer can submit and track reports.

## Phase 3: Admin Module — Days 8–10

**Day 8**
- Build admin dashboard.
- Implement user listing and search.

**Day 9**
- Implement expert account management.
- Implement crop and category management.
- Add account activation controls.

**Day 10**
- Implement assignment and reassignment.
- Add assignment history.
- Display unassigned and assigned reports.

**Deliverable:** Administrators can manage accounts and assign reports.

## Phase 4: Expert Module — Days 11–14

**Day 11**
- Build expert dashboard.
- Display assigned cases and filters.

**Day 12**
- Build detailed case review.
- Display photographs and farmer descriptions.
- Implement information requests.

**Day 13**
- Implement expert recommendations.
- Add status transitions and status history.

**Day 14**
- Implement farmer follow-ups.
- Add response history.
- Test the full farmer-to-expert workflow.

**Deliverable:** Experts can review cases, respond and manage status.

## Phase 5: Differentiating Feature — Days 15–16

**Day 15**
- Implement resolved-case retrieval.
- Match crop and problem category.
- Add keyword-based similarity ranking if time permits.

**Day 16**
- Integrate similar cases into the expert dashboard.
- Display previous responses and resolution notes.
- Test matching and no-match scenarios.

**Deliverable:** The Similar Solved Problems feature works with stored historical data.

## Phase 6: Analytics and Finalization — Days 17–20

**Day 17**
- Build statistics endpoints.
- Add Chart.js visualizations.
- Validate dashboard calculations.

**Day 18**
- Improve responsive layouts.
- Add loading, empty and error states.
- Review form validation and accessibility.

**Day 19**
- Test authentication, authorization and complete workflows.
- Fix high-priority bugs.
- Test image storage and deployment configuration.

**Day 20**
- Deploy the application if hosting is available.
- Prepare sample demonstration accounts and records.
- Complete README and setup instructions.
- Capture screenshots and prepare the project demonstration.

**Deliverable:** A tested, documented and demonstrable academic project.

This schedule assumes the team can work consistently and keep the first release focused. Deployment, external service configuration and debugging may require adjustments.

# 17. Prioritization

## P0 — Essential

- Authentication and roles.
- Farmer problem reporting.
- Image upload.
- Farmer report tracking.
- Admin assignment.
- Expert case review.
- Expert recommendations.
- Status updates and history.
- Basic access control.

## P1 — Important

- Follow-up communication.
- Similar Solved Problems.
- Admin statistics and charts.
- Crop and category management.
- Search and filters.
- Responsive UI.

## P2 — Optional enhancements

- In-app notifications.
- CSV export.
- Advanced similarity matching.
- Multilingual interface.
- Email or SMS notifications.
- Automated assignment suggestions.

Complete P0 functionality before spending significant time on visual effects or advanced features.

# 18. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| Incorrect agricultural recommendations | Keep responses expert-authored and preserve context |
| Unauthorized access | Enforce backend authorization and resource ownership |
| Image upload failure | Validate uploads and handle errors safely |
| Duplicate or inconsistent records | Validate input and use appropriate constraints and update logic |
| No similar historical cases | Display a clear empty state and build a demonstration dataset |
| Slow dashboard queries | Use indexes, aggregation and pagination |
| Limited development time | Prioritize P0 requirements and defer optional integrations |
| Poor usability on phones | Test responsive layouts throughout development |
| Lost historical information | Preserve response, status and assignment history |

# 19. Future Enhancements

After the first release, the project could be extended with:

1. **Multilingual support:** Marathi, Hindi and English interfaces.
2. **Advanced case similarity:** Semantic text embeddings to identify related reports with different wording.
3. **Notification integration:** Email, SMS or WhatsApp alerts through suitable services.
4. **Weather integration:** Display relevant weather information using a reliable weather API.
5. **Location mapping:** Display report locations on a map with appropriate privacy controls.
6. **Expert workload recommendations:** Suggest experts based on specialization and current workload.
7. **Mobile application:** Develop an Android application using Flutter or React Native.
8. **AI-assisted case summarization:** Summarize long case histories for expert review.
9. **Image-based assistance:** Explore crop-image analysis as a separate, carefully validated feature.
10. **Government-service integration:** Investigate authorized integrations with agricultural departments.

These features require separate feasibility, privacy, reliability and implementation assessments.

# 20. Final Deliverables

The completed project should contain:

- Responsive React frontend.
- Node.js and Express REST API.
- MongoDB database with defined schemas.
- Farmer, expert and admin modules.
- Authentication and role-based authorization.
- Image-upload integration.
- Problem assignment and status-management workflow.
- Expert responses and farmer follow-ups.
- Similar Solved Problems functionality.
- Administrative statistics and charts.
- Input validation and error handling.
- README with installation and execution instructions.
- Environment-variable example file without real secrets.
- API documentation.
- Test scenarios and results.
- Screenshots of the main pages.
- Project report and demonstration material.

# 21. Definition of Done

Version 1.0 is complete when the following end-to-end scenario works:

A farmer registers and submits a report with a crop, category, description, location and photograph. The administrator assigns the report to an active agriculture expert. The expert reviews the case, examines similar resolved cases, and provides a recommendation or requests more information. The farmer views the response and submits a follow-up if necessary. The expert updates the status and eventually resolves the case. The administrator can monitor the report and see accurate statistics.

All core operations must persist to MongoDB, respect role permissions, provide understandable error messages and work on desktop and mobile layouts.

**Final product objective:** Deliver a practical, secure and traceable agricultural support application that demonstrates full-stack development, role-based workflow management, historical case retrieval and data visualization within a manageable 20-day academic project.