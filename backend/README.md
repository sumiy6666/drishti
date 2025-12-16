# Backend (Node.js + Express + MongoDB) - Enhanced

## New features
- Resume uploads via S3 presigned URLs
- Email verification & password reset (SMTP)
- Pagination metadata
- Salary range & remote filters, saved searches
- Employer-applicant messaging
- Admin analytics
- Improved logging and error handling

## Setup
- Copy `.env.example` to `.env` and fill in values (MONGO_URI, JWT_SECRET, SMTP_*, AWS_*).
- Install dependencies:
  ```
  cd backend
  npm install
  ```
- Seed sample data:
  ```
  npm run seed
  ```
- Run server:
  ```
  npm run dev
  ```
