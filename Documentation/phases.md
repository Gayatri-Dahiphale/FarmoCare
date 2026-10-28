# Farm Problem Reporting & Expert Response System
## Implementation Phases and Delivery Plan

**Version:** 1.0  
**Target duration:** 20 days  
**Related documents:** `PRD.md`, `design.md`, `architecture.md`, `database.md`, `api.md`

## 1. Objective

Deliver a working academic prototype in which a farmer submits an agricultural report, an administrator assigns an expert, the expert responds, the farmer follows up, and the expert resolves the case. Similar Solved Problems and database-backed dashboard statistics are the main differentiating features.

## 2. Delivery rules

1. Build in vertical slices that can be run and tested end-to-end.
2. Finish P0 requirements before optional polish.
3. Do not mark a feature complete unless it works against the backend and database.
4. Use real persisted data for dashboards and case lists.
5. Run the existing tests after each meaningful change.
6. Keep the application runnable throughout development.
7. Do not replace working code wholesale without inspecting it first.
8. Do not introduce libraries or external services without a clear need.
9. Keep secrets out of source control.
10. Maintain a list of completed, incomplete, and blocked tasks.

## 3. Day-by-day plan

### Phase 1 — Foundation (Days 1–3)

**Day 1: Repository and requirements**
- Inspect the current repository, if one exists, before changing files.
- Confirm page list, roles, canonical enums, and status transitions.
- Create or organize `client/`, `server/`, and `docs/`.
- Initialize Git and add `.gitignore`.
- Add README setup instructions and `.env.example`.

**Exit criteria:** Repository structure is clear; client and server start or their setup errors are documented.

**Day 2: Database and API foundation**
- Configure MongoDB connection.
- Create Mongoose models for users, crops, categories, problems, responses, status history, and assignments.
- Add required indexes and validation.
- Implement central error handling and response conventions.
- Seed development-only crop/category data.

**Exit criteria:** Server connects to the database; model and health checks pass.

**Day 3: Authentication and permissions**
- Implement farmer registration and login.
- Hash passwords.
- Implement the selected JWT/session strategy.
- Add authentication and role middleware.
- Add resource-level authorization helpers.
- Implement logout and current-user endpoint.

**Exit criteria:** Farmer can register/login; invalid credentials fail; protected endpoints reject unauthorized access.

### Phase 2 — Farmer reporting (Days 4–7)

**Day 4: Public pages and farmer shell**
- Build landing page and auth pages using `design.md`.
- Add role-aware navigation and route guards.
- Build responsive farmer layout.

**Day 5: Report form**
- Build report creation form.
- Load active crop/category options from API.
- Validate title, description, crop, category, and location according to the PRD.
- Display inline validation errors.

**Day 6: Report persistence and images**
- Implement server-side report creation and unique report number generation.
- Configure image storage and validate uploads.
- Handle upload failures and orphaned files.
- Save report and initial status/history consistently.

**Day 7: My Reports and details**
- Implement farmer-owned report list with pagination/status filters.
- Build report detail page and timeline.
- Show image previews and status explanations.
- Test farmer ownership boundaries.

**Exit criteria:** A farmer can submit a report with an image and later view the persisted report.

### Phase 3 — Administration and assignment (Days 8–10)

**Day 8: Admin dashboard and report queue**
- Build admin layout.
- Display unassigned and all-report queues.
- Implement paginated search/filter APIs.
- Calculate initial dashboard counts from MongoDB.

**Day 9: User, crop, and category management**
- Build user list/search and account status controls.
- Implement admin-created expert accounts.
- Implement crop/category add, edit, and deactivate operations.
- Preserve historical references.

**Day 10: Assignment**
- Build report assignment detail view and expert selector.
- Validate expert role and active status.
- Implement assignment and reassignment services.
- Preserve assignment history and audit significant changes.

**Exit criteria:** Admin can assign a report and the assignment persists; the assigned expert can retrieve the case.

### Phase 4 — Expert response workflow (Days 11–14)

**Day 11: Expert dashboard**
- Build expert layout and assigned-case list.
- Add status, crop, category, date, and report-ID filters.
- Enforce assignment restrictions on the backend.

**Day 12: Case review**
- Build detailed report view with farmer description, images, location, history, and prior responses.
- Add information-request form.
- Verify unauthorized experts cannot access unrelated cases.

**Day 13: Recommendations and statuses**
- Implement append-only expert responses.
- Implement status transition service and status history.
- Distinguish response provided from resolved.
- Add server-side validation for every transition.

**Day 14: Farmer follow-up**
- Implement farmer follow-up submission and optional attachment handling.
- Display chronological conversation/history.
- Return cases awaiting information to review according to the workflow rules.
- Test the complete farmer/admin/expert lifecycle.

**Exit criteria:** A report can be assigned, reviewed, responded to, followed up, and resolved without database editing by hand.

### Phase 5 — Similar Solved Problems (Days 15–16)

**Day 15: Retrieval logic**
- Query resolved reports with a usable response/resolution note.
- Filter by crop and category.
- Implement normalized keyword overlap if time permits.
- Add limits, sorting, and privacy-aware response fields.

**Day 16: Expert interface**
- Add similar-case panel to expert case details.
- Show report ID, crop/category, summary, previous recommendation, resolution note/date, and actual score/explanation when available.
- Add no-match and loading states.
- Test matching and access restrictions.

**Exit criteria:** Expert can retrieve stored resolved cases relevant to an assigned report without an external AI API.

### Phase 6 — Analytics, testing, and delivery (Days 17–20)

**Day 17: Statistics**
- Implement database-backed counts and grouped statistics.
- Add Chart.js charts for status, category, crop, trends, and expert workload.
- Validate chart totals against database queries.

**Day 18: UX and responsive refinement**
- Test desktop, tablet, and narrow mobile widths.
- Add consistent loading, empty, success, and error states.
- Review accessibility labels, focus states, contrast, and status text.
- Fix major layout defects.

**Day 19: Security and regression**
- Test authentication, roles, resource ownership, uploads, status transitions, assignment history, and similar cases.
- Test empty datasets, invalid IDs, duplicate identifiers, and failed network requests.
- Fix high-priority defects.
- Confirm no secrets are committed.

**Day 20: Deployment and demonstration**
- Deploy if hosting and credentials are available.
- Verify the deployed database and image storage.
- Create safe demo accounts and sample records.
- Complete README and API setup documentation.
- Capture genuine screenshots of key workflows.
- Prepare a concise demonstration script and record known limitations.

**Exit criteria:** A fresh setup can be followed from the README, and the end-to-end demo works.

## 4. Priority order

### P0 — Must work
- Authentication and role authorization.
- Farmer report creation and ownership.
- Image validation/storage.
- Admin assignment and reassignment.
- Expert case review and recommendations.
- Farmer follow-up.
- Controlled status transitions and history.
- Basic responsive pages.

### P1 — Should work
- Similar Solved Problems.
- Database-backed dashboards.
- Crop/category management.
- Search, filters, pagination.
- Expert workload statistics.

### P2 — Add only if time permits
- In-app notifications.
- CSV exports.
- Advanced semantic similarity.
- Multilingual interface beyond essential labels.
- External weather, SMS, email, or WhatsApp integrations.

## 5. Testing strategy

### Unit tests
Test status transition rules, report-number generation, similarity scoring, validation helpers, and authorization helpers.

### API integration tests
Test successful and forbidden requests for each role. Include attempts to access another farmer's report and an expert's unassigned report.

### End-to-end manual test
1. Register a farmer.
2. Log in as the farmer.
3. Submit a report with a valid image.
4. Confirm it appears in My Reports.
5. Log in as admin and assign an active expert.
6. Log in as that expert and open the case.
7. Review similar solved cases.
8. Request information or add a recommendation.
9. Log in as the farmer and submit a follow-up.
10. Log in as the expert, review the follow-up, respond, and resolve.
11. Verify the timeline and dashboard statistics.
12. Attempt forbidden actions with the wrong role and verify rejection.

## 6. AI coding agent instructions

Use the PRD and supporting documents as the source of truth. Before implementation:

- Inspect existing files and identify what is already implemented.
- Report any conflicts between documents before making broad changes.
- Confirm the chosen libraries and authentication strategy.
- Produce a task checklist with dependencies.
- Implement one phase at a time.
- Run available lint, build, and tests after each phase.
- Fix regressions before starting the next phase.
- Do not fabricate test results or claim unfinished features are complete.
- If an external service requires credentials, implement a documented configuration path and clearly report what remains unverified.
- Do not overwrite existing design or functionality without a reason.

## 7. Scope-control rules

If the schedule slips:
1. Keep P0 functionality.
2. Implement basic crop/category filters and keyword similarity instead of semantic AI.
3. Defer notifications and CSV export.
4. Use a small development-only seed dataset for the demo.
5. Simplify animation and decorative effects before simplifying security or data integrity.
6. Never replace database-backed features with hardcoded values while claiming the requirement is complete.

## 8. Final release checklist

- [ ] Client builds successfully.
- [ ] Server starts and connects to MongoDB.
- [ ] `.env.example` lists required variables without secrets.
- [ ] Farmer registration/login works.
- [ ] Expert/admin access is restricted to authorized accounts.
- [ ] Report creation and image upload work.
- [ ] Admin assignment and reassignment preserve history.
- [ ] Expert responses and farmer follow-ups persist.
- [ ] Invalid status transitions are rejected.
- [ ] Similar solved cases use stored resolved records.
- [ ] Dashboard charts use database-backed statistics.
- [ ] Resource access restrictions are tested.
- [ ] Main pages work on desktop and mobile.
- [ ] README includes installation, environment setup, seed, test, and run steps.
- [ ] Demo accounts/data are safe and clearly identified.
- [ ] Known limitations are documented honestly.
