# Fixes Applied

- Fixed frontend/backend API path consistency (`/api/...`) and Google login route.
- Fixed Sent Activity ordering so successful `SENT` records appear before `FAILED` records with null `sentAt`.
- Added `sentCount` and `failedCount` in the sent-email API response.
- Hardened BullMQ worker against duplicate sends on retries.
- Added SMTP rejection handling and Ethereal preview URL logging.
- SMTP config now accepts both `SMTP_*` and legacy `ETHEREAL_*` variable names.
- Elasticsearch failures no longer prevent scheduling or sending emails.
- Added Elasticsearch auth options for hosted deployments.
- Added Elasticsearch backfill at server startup so old DB emails become searchable.
- Added frontend Elasticsearch search box in Email Activity.
- Cancel/delete actions now keep Elasticsearch in sync.
- Added live BullMQ dashboard at `/admin/queues` and JSON status at `/api/queue/status`.
- Added complete `.env.example` files and made Docker Compose include PostgreSQL, Redis, and Elasticsearch from the project root.
- Corrected README paths from backend/frontend to server/client and documented deployment URL convention.

## Important deployment convention

`VITE_API_URL` must be only the backend origin, e.g.:

`https://your-backend.onrender.com`

Do **not** append `/api`.

## Local checks

Backend TypeScript build passes with `npm run build`.
Frontend source was syntax-checked; install client dependencies with `npm install` before running the normal Vite build.
