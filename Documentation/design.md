Farmora Care — UI/UX Design Specification
1. Product Overview
Farmora Care is a farmer-first agricultural support web application that connects farmers with agricultural experts, helps users report crop and farm problems, tracks advisory cases, and provides practical crop-care guidance. The interface should feel like a modern, trustworthy farming service: green, natural, photographic, clear, and easy to use on mobile devices as well as desktop screens.

This document defines the visual direction and interaction rules for restyling the existing Google Stitch screens. It is a design specification, not a request to rebuild the application's features or remove existing pages.
2. Core Design Direction
Visual keywords
- Green-first, agricultural, fresh, grounded, welcoming
- Real photography of Indian farmers, crops, fields, soil, and agronomists
- Modern, clean, premium, readable, practical
- Consistent across public, farmer, expert/agronomist, and admin experiences
Main design rule
Green must be the dominant visual identity. The current beige-heavy look should be corrected. Beige, cream, and sand may be used only as minor supporting accents; they must not dominate page backgrounds, large cards, hero sections, navigation, or dashboards.
Design references
Use the organic, premium agricultural feeling of the Farmora agriculture landing-page reference, while keeping the information architecture and functionality of the existing Farmora Care screens.
3. Color System
Use these tokens consistently across all pages. Adjust shades only when necessary to maintain contrast and accessibility.
Token	Hex	Usage
Forest Green	#174D32	Primary brand, important headings, dark navigation, footer
Farm Green	#237A43	Primary buttons, active navigation, links, selected states
Leaf Green	#3D9957	Secondary actions, icons, charts, highlights
Fresh Green	#E5F4E8	Light green panels, success surfaces, selected cards
Pale Green	#F2F8F1	Default page background for farmer-facing pages
White	#FFFFFF	Main cards, forms, readable content surfaces
Deep Text	#1D2A21	Main text and headings
Muted Text	#647269	Helper text, metadata, descriptions
Border Green-Gray	#D7E4D9	Dividers, card borders, input borders
Harvest Gold	#E8B94F	Small highlights, ratings, crop-stage accents only
Warning	#B86A12	Warnings requiring attention
Error	#B42318	Errors and destructive actions
Success	#237A43	Success states and completed actions


Color balance target
- 55–70% white and very light green surfaces
- 20–30% green brand elements, green panels, imagery, and navigation
- 5–10% neutral gray, soil, or warm accent colors
Do not use beige as the default background. Avoid large cream-colored sections. Use strong forest-green or farm-green areas to establish the agricultural identity.
4. Typography
- Font family: Manrope, with a system sans-serif fallback.
- Page title: 28–36 px desktop; 24–28 px mobile; semibold or bold.
- Section title: 20–24 px; semibold.
- Card title: 16–18 px; semibold.
- Body text: 14–16 px with comfortable line height.
- Labels and metadata: 12–14 px; keep readable and avoid very low contrast.
- Use sentence case for labels and buttons. Keep headings concise and action-oriented.
5. Photography and Image Direction
Photography is a key part of the brand, not decoration added as an afterthought.
Preferred subjects
- Indian farmers in real fields, including women farmers
- Farmers inspecting leaves, crops, soil, irrigation, and crop health
- Healthy crops, vegetable farms, orchards, seedlings, and green paddy fields
- Agronomists or field experts examining crops with farmers
- Realistic farm landscapes, crop close-ups, and harvest scenes
Image quality and treatment
- Prefer authentic, high-resolution, editorial-style photographs.
- Favor natural daylight, green vegetation, and believable rural settings.
- Use rounded corners consistently (12–20 px).
- Use subtle overlays only when text sits on top of a photo.
- Use object-fit: cover and intentional focal positioning; do not stretch images.
- Give every meaningful image useful alt text.
- Avoid generic office stock photography, unrelated technology imagery, cartoon farms, and repeated copies of the same farmer photo.
- If remote images fail to load, show a green-tinted fallback with a relevant crop or farmer icon.
Where photography should appear
- Public landing page: large farmer/crop hero image, supporting crop imagery, and a photo-led feature section.
- About / How it works: photos of farmers and agricultural experts, plus simple process illustrations where needed.
- Farmer dashboard: compact crop or field image in the welcome/season panel and relevant thumbnail images for advisories.
- New problem report: crop/leaf photo examples and a clear image-upload area.
- Expert dashboard and field inspection: field photos, crop close-ups, and inspection evidence thumbnails.
- Crop management: crop cards with different crop-specific photos.
- Farmer/expert profiles: optional profile photo and contextual field image, without making profile completion depend on photography.
- Empty states: simple green illustrations or relevant crop imagery, not large blank beige panels.
6. Layout and Components
Global layout
- Use a consistent centered content container, approximately 1200–1320 px maximum width on large screens.
- Desktop page gutters: 32–48 px; tablet: 24–32 px; mobile: 16–20 px.
- Use a spacing scale based on 4/8 px increments.
- Keep content sections clearly separated without excessive whitespace.
- Align page titles, breadcrumbs, filters, and primary actions consistently.
Navigation
- Use a white or deep forest-green navigation surface with a clearly visible Farmora Care identity.
- Active navigation should use farm green and a visible indicator, not only a subtle beige tint.
- Keep labels understandable and icons consistent.
- On mobile, collapse navigation into a compact menu or bottom navigation where appropriate.
- Preserve the existing role-specific navigation for farmers, experts/agronomists, and administrators.
Cards
- Default card: white background, 1 px pale green-gray border, 12–16 px radius, subtle shadow only when needed.
- Use pale-green cards for important status panels and highlighted guidance.
- Avoid making every card a different color.
- Use consistent card padding: 16–24 px.
- Keep card actions visible and aligned.
Buttons
- Primary: farm green background, white text.
- Hover: darker forest green.
- Secondary: white or pale-green background with green border and green text.
- Destructive: red treatment, used only for delete or irreversible actions.
- Disabled: muted neutral background and clear disabled state.
- Button height should generally be 40–48 px with a clear focus state.
- Use specific labels such as Submit report, View advisory, Assign case, and Save changes rather than vague labels such as “Submit” when context can be clearer.
Forms and inputs
- Use white inputs with visible light green-gray borders.
- Provide persistent labels; do not rely only on placeholder text.
- Show required fields, validation messages, upload progress, and success/error feedback.
- Use green for valid/successful states and red for errors.
- Make image upload areas prominent and easy to use on touch screens.
Tables and data views
- Use a white surface, readable row spacing, and light dividers.
- Use green-tinted table headers or selected rows sparingly.
- Status labels should use accessible text and color together.
- Keep filters, search, pagination, and primary actions in predictable locations.
- On small screens, allow horizontal scrolling or transform rows into compact cards; do not shrink text until it becomes unreadable.
Status badges
- Use semantic colors consistently: green for resolved/success, amber for pending/attention, red for urgent/error, gray for inactive.
- Every badge must include text, not color alone.
7. Screen-Specific Requirements
7.1 Public landing page
- Create a strong, green-first hero with a real farmer or crop photograph.
- Use a forest-green heading or dark text over a light-green surface; ensure readable contrast over images.
- Include a clear primary CTA for getting started or reporting a farm problem and a secondary CTA for learning how the service works.
- Add photo-led feature blocks for crop problem reporting, expert guidance, and case tracking.
- Use a green feature band or dark-green CTA section to strengthen the brand.
- Keep beige to small accent details only.
7.2 Login and session states
- Keep the login form simple and reassuring, with a green brand panel or agricultural photograph.
- Ensure the form remains the main focus and works on narrow mobile screens.
- Provide clear invalid-credentials, expired-session, access-denied, and recovery states.
- Do not rely on color alone to communicate errors.
7.3 Farmer dashboard
- Start with a friendly welcome, relevant crop/season imagery, and the most important next action.
- Prioritize report status, active advisories, upcoming actions, and recent case updates.
- Use green for progress and resolved states, amber for attention, and red only for urgent issues.
- Keep primary actions such as Report a crop problem easy to find.
7.4 New problem report and mobile report
- Use a clear step-by-step form where appropriate: crop details, symptoms, location/context, photos, and submission.
- Make photo upload a prominent bordered area with camera/gallery guidance.
- Include a short helper message encouraging clear, well-lit crop photographs.
- Keep form controls full-width on mobile and ensure the submit button is easy to reach.
7.5 Reports, archive, and case tracker
- Make case ID, crop, submitted date, current status, assigned expert, and latest update easy to scan.
- Use strong green for resolved cases and distinct amber/red indicators for cases needing action.
- Provide filters and search without overcrowding the header.
- Keep timeline events visually connected and chronological.
7.6 Expert dashboard and field inspection
- Prioritize assigned cases, unassigned reports, urgent reports, inspection schedules, and recent activity.
- Use real crop photographs and evidence thumbnails to make the field-work context clear.
- Make assignment, inspection, advisory creation, and status updates obvious actions.
- Keep analytical charts simple and use greens with restrained amber/red alerts.
7.7 Advisory and digital certificate views
- Present the diagnosis, recommended actions, application precautions, and follow-up instructions in a clear hierarchy.
- Separate urgent warnings from ordinary guidance.
- Use a readable print/PDF layout for advisory certificates, with consistent branding and no decorative background that reduces readability.
- Clearly distinguish expert-provided guidance from any automated suggestions.
7.8 Crop management and chemical database
- Use crop-specific imagery and clear crop names, growth stage, and relevant status.
- Keep chemical or treatment information structured and safety-focused, including dosage and precaution fields only when supported by verified content.
- Avoid presenting unsupported treatment recommendations as confirmed facts.
7.9 Admin dashboard, analytics, and management screens
- Maintain a professional, information-dense layout without losing the green identity.
- Use green for primary actions and positive metrics; reserve warning colors for exceptions.
- Make charts legible, with labels, legends, and clear time ranges.
- Use consistent filters, tables, pagination, confirmation dialogs, and audit/activity details.
7.10 Help, contact, and error screens
- Use a helpful tone and direct next steps.
- Use compact green illustrations or contextual farming imagery.
- Explain what happened and how the user can recover; do not show technical stack traces to ordinary users.
8. Responsive Behavior
Desktop (≥ 1024 px)
- Use full navigation and multi-column layouts where they improve scanning.
- Keep dashboard sidebars and tables within a comfortable reading width.
- Use large, editorial images in hero sections.
Tablet (768–1023 px)
- Reduce grid columns and spacing.
- Keep primary actions visible and avoid overly wide forms.
- Allow navigation to compact when needed.
Mobile (< 768 px)
- Use a single-column content layout.
- Keep side padding around 16 px.
- Stack buttons when side-by-side controls become cramped.
- Use full-width forms and touch targets of at least about 44 px.
- Keep key status and next actions near the top.
- Avoid horizontal overflow, tiny labels, and dense multi-column tables.
- Ensure photo upload, case tracking, and report submission work comfortably on a phone.
9. Accessibility and Usability
- Maintain WCAG-conscious contrast, especially white text on green and muted text on pale-green backgrounds.
- Use visible keyboard focus styles.
- Ensure every input has a label and every icon-only action has an accessible name.
- Provide text labels alongside status colors and icons.
- Use meaningful alt text for content images and empty alt text for purely decorative images.
- Support keyboard navigation and logical focus order.
- Keep language plain and action-oriented; avoid technical terms when writing for farmers.
- Do not communicate critical information through color or imagery alone.
10. Interaction and Feedback
- Provide clear hover, focus, active, disabled, loading, success, and error states.
- Confirm destructive actions such as deleting a report or user.
- Preserve form input when a recoverable submission error occurs.
- Show loading indicators for uploads, report submission, and long-running operations.
- Use toast messages for brief feedback and inline messages for field-specific validation.
- Keep navigation and status changes consistent across screens.
11. Design Consistency Rules
1. Green is the dominant brand color; beige is a minor accent only.
2. Use real farmer, crop, field, and agronomist photography throughout relevant screens.
3. Preserve all existing screens and workflows unless a separate product decision explicitly removes them.
4. Reuse the same typography, spacing, buttons, cards, inputs, badges, and navigation patterns.
5. Use white and pale-green surfaces for readability; use dark green for high-impact brand sections.
6. Do not add images that are unrelated to the screen's task.
7. Avoid unnecessary gradients, oversized shadows, excessive rounded pills, and decorative clutter.
8. Keep mobile screens functional, not merely scaled-down desktop layouts.
9. Keep existing content and functionality intact while improving hierarchy and visual consistency.
10. Use accessible contrast and clear feedback for every important action.
12. Acceptance Checklist
- [ ] The first impression is clearly green and agricultural, not beige or cream.
- [ ] The public landing page includes a prominent, high-quality farmer/crop photograph.
- [ ] Relevant screens use varied images of farmers, crops, fields, and agricultural experts.
- [ ] All existing screens remain present and visually consistent.
- [ ] Primary buttons use farm green with readable white text.
- [ ] Forms, cards, tables, badges, and navigation share a consistent design system.
- [ ] Mobile layouts work without horizontal overflow or unreadable text.
- [ ] Errors, warnings, loading states, and successful actions are clearly communicated.
- [ ] Images have appropriate sizing, cropping, and alt text.
- [ ] Beige is limited to small accents and does not dominate any major screen.
13. Implementation Note
Apply these requirements to the existing HTML/CSS screens in the current Stitch export. Prefer shared design tokens and reusable component styles over one-off overrides. Update the global palette first, then navigation and buttons, then cards/forms/tables, and finally add or refine relevant photography per screen. After styling, review the landing page, farmer dashboard, expert dashboard, admin dashboard, and mobile report flow at desktop and mobile widths.