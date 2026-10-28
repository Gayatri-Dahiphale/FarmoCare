# Farmora Care — Agricultural Support & Expert Response Platform

Farmora Care is a full-stack agricultural problem reporting, case triage, expert diagnostic consultation, and similar solved problems retrieval system.

## Key Features

- **Green-Dominant Visual Redesign**: Built upon Farmora Care design tokens (Forest Green `#174A2A`, Farm Green `#287A3E`, Leaf Green `#56A94F`, Pale Green `#F1F8EE`, Light Sprout `#E1F0DF`).
- **Authentic Agricultural Storytelling**: High-resolution photography of Indian farmers, agronomists, lush crops, and leaf symptom diagnostics.
- **Role-Based Access Control (RBAC)**: Secure separation between **Farmers**, **Agriculture Experts**, and **Administrators**.
- **Structured Problem Reporting**: Step-by-step reporting with crop selection, category classification, geographical localization (village, district, state), and photographic evidence upload.
- **Admin Caseload Triage & Expert Assignment**: Workload-balanced expert assignment, reassignment with reason tracking, and case history preservation.
- **Expert Diagnosis & Advisory Workflow**: Structured observations, actionable treatment recommendations, precautionary guidelines, and official advisory generation.
- **Similar Solved Problems**: In-database keyword and metadata similarity retrieval matching resolved cases by crop, category, and symptoms without external AI API dependencies.
- **Analytics & Visual Dashboards**: Real-time MongoDB-aggregated metrics visualized with Chart.js.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Chart.js (`react-chartjs-2`), React Router DOM.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT authentication, bcryptjs, Multer.
- **Database**: MongoDB (local service or MongoDB Atlas).

## Getting Started

### 1. Prerequisites
- Node.js v18+ (tested on v24.18.0)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Populates crops, categories, demo users, and historical resolved cases
npm run dev      # Starts API on http://localhost:5000/api/v1
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts frontend on http://localhost:5173
```

### 4. Default Demo Accounts
- **Admin**: `admin@farmora.care` / `Farmora@Admin2026`
- **Expert**: `dr.shinde@farmora.care` / `Expert@2026` (Virologist & Polyhouse Advisor)
- **Farmer**: `ramesh.patil@farmora.care` / `Farmer@2026`
