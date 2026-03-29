# FairRoom Copilot Instructions

Use the locked Gate 2 architecture as the implementation baseline.

Core rules:
- Canonical roles are `student` and `admin`.
- Canonical user field is `fullName`.
- Canonical booking time fields are `startsAt` and `endsAt`.
- Room availability is derived from bookings, not stored as room slots.
- `accountActivities` is a derived read model, not a stored entity.
- The API contract and domain model live in Notion and are the source of truth.
- If current code conflicts with the approved architecture, align the code to the architecture unless the issue explicitly says otherwise.

Pull request rules:
- Every PR must link at least one GitHub issue.
- Every PR must list the affected user story IDs.
- Every PR should stay narrow and match the issue scope.
- Human approval is required before merge.

Implementation guidance:
- Replace mock-only DTO shapes rather than extending them.
- Do not introduce new fields, statuses, or route names without matching the approved contract.
- Keep frontend and backend names aligned.
- Prefer small, reviewable PRs over wide refactors.
