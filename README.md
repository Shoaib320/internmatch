# Internship Recommendation Platform

InternMatch is an internship recommendation platform with student, company, and admin flows.

## Project parts

- `client`: Next.js frontend
- `server`: Node.js and Express backend
- `ml-service`: Python and Flask recommendation service
- `docs`: planning notes

## Current status

The main product flows are connected:
- Auth for student, company, and admin
- Student profile, predictions, resume builder, and applications
- Company profile, internship posting, and applicant review
- Admin dashboard and management pages
- Flask-based ML recommendation service with backend fallback scoring

## Local run

### Backend

1. Update `server/.env`
2. Add your real `MONGODB_URI`
3. Replace `JWT_SECRET` with your own value
4. Run:

```bash
cd server
npm run dev
```

### Frontend

1. Optional: copy `client/.env.example` to `client/.env`
2. Run:

```bash
cd client
npm run dev
```

### ML service

1. Install Python packages:

```bash
cd ml-service
python -m pip install -r requirements.txt
```

2. Run the Flask service:

```bash
cd ml-service
python app.py
```

### What to test first

- Signup and login
- Student profile create and update
- Prediction generation
- Resume save and update
- Company profile create
- Internship posting
- Applicant status changes
- Admin dashboard and management pages
- ML service health at `http://127.0.0.1:8000/health`
- Prediction generation with Flask running so ML roles appear in the UI
