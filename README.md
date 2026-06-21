# ElderCare Connect - Elderly Nursing & Healthcare Assistance Services

ElderCare Connect is a complete full-stack MERN (MongoDB, Express, React, Node) application that connects elderly patients and their families with verified caregivers like nurses, physiotherapists, personal attendants, and post-hospital recovery assistants.

---

## Technical Stack

- **Frontend:** React.js, Vite, React Router, Tailwind CSS, Axios, Context API
- **Backend:** Node.js, Express.js, Mongoose ODM
- **Database:** MongoDB
- **Security:** JWT Authentication (stored in local storage), bcryptjs password hashing
- **Development Tooling:** Concurrently (runs client & server together)

---

## Directory Structure

```text
eldercare-connect/
├── package.json              # Root package config (runs client and server concurrently)
├── backend/
│   ├── config/               # DB connection configurations
│   ├── controllers/          # Request controllers (MVC logic)
│   ├── middleware/           # Protected route locks & JWT validations
│   ├── models/               # Mongoose DB Schemas
│   ├── routes/               # API route maps
│   ├── utils/                # Seeder scripts
│   ├── server.js             # Entry Express app
│   └── package.json          # Node server dependencies
└── frontend/
    ├── src/
    │   ├── assets/           # Visual UI media
    │   ├── components/       # Navbars, Protect wrappers, Card lists
    │   ├── context/          # React AuthContext session manager
    │   ├── layouts/          # Dashboard shells
    │   ├── pages/            # Public, family-patient, caregiver, admin screens
    │   ├── routes/           # React Router route shields
    │   ├── services/         # Axios API interceptor configurations
    │   ├── App.jsx           # Mount elements
    │   ├── main.jsx          # Bootstrap scripts
    │   └── index.css         # Tailwind directives
    ├── tailwind.config.js    # Styling adjustments
    └── index.html            # Core template with Google Fonts
```

---

## Setup & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on your default port (`27017`)

### Installation & Launch

1. **Clone or Navigate to the directory:**
   ```bash
   cd C:/Users/Ayush Kumar/.gemini/antigravity-ide/scratch/eldercare-connect
   ```

2. **Install all dependencies:**
   This command installs dependencies for root, backend, and frontend folders automatically:
   ```bash
   npm install
   ```

3. **Run the development servers concurrently:**
   ```bash
   npm run dev
   ```

   This launches:
   - **Express Server:** http://localhost:5000
   - **React/Vite App:** http://localhost:5173

---

## Database Seeding & Demo accounts

The application **automatically seeds the database** upon startup if it finds no registered users, allowing you to evaluate all three roles immediately without manual inputs.

### Pre-configured Accounts:

1. **Administrator Console:**
   - **Email:** `admin@eldercare.com`
   - **Password:** `admin123`
   
2. **Standard User (Family / Elderly Booking):**
   - **Email:** `user@eldercare.com`
   - **Password:** `user123`
   
3. **Caregiver Profile (Registered Nurse):**
   - **Email:** `nurse1@eldercare.com`
   - **Password:** `caregiver123`

You can manually force-seed or clear-reseed data at any time by running:
```bash
npm run seed
```

---

## API Routes Overview

### 🔐 Authentication (`/api/auth`)
- `POST /register` - Register a standard user or caregiver
- `POST /login` - Sign in and get JWT token
- `GET /profile` - Retrieve active user and profile details
- `GET /users` - [Admin] List all registered user accounts
- `DELETE /users/:id` - [Admin] Remove user from database

### 👵 Patients (`/api/patients`)
- `POST /` - Register a patient profile
- `GET /` - List family patients (Admin lists all)
- `GET /:id` - Retrieve patient details
- `PUT /:id` - Update patient details
- `DELETE /:id` - Remove patient profile

### 🩺 Caregivers (`/api/caregivers`)
- `GET /` - List verified caregivers (supports `specialization` and `serviceArea` search query parameters)
- `POST /` - Upsert caregiver qualifications, specialization, and availability shifts
- `PUT /:id` - Update profile settings
- `PUT /:id/verify` - [Admin] Set verification status to `verified` or `rejected`

### 🗓️ Bookings (`/api/bookings`)
- `POST /` - Request a booking appointment
- `GET /` - List bookings mapped to role (User gets theirs, Caregiver gets theirs, Admin gets all)
- `PUT /:id/status` - Transition booking status (`pending` -> `accepted` -> `ongoing` -> `completed` / `cancelled`)
- `DELETE /:id` - [Admin] Delete booking entry
- `GET /admin/analytics` - [Admin] Calculate users, bookings, ratings, and monthly booking statistics

### 📝 Care Notes & Feedback (`/api/care-notes`, `/api/reviews`)
- `POST /care-notes` - [Caregiver] Add care note to booking session
- `GET /care-notes/booking/:bookingId` - View notes history for booking
- `POST /reviews` - [User] Submit star rating and comment for completed booking
- `GET /reviews` - List reviews logs for caregiver

---

## Deployment Ready Instructions

### Backend (Render)
1. Log in to [Render](https://render.com/).
2. Click **New +** > **Web Service**.
3. Link your GitHub repository.
4. Set settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (pointing to the `backend` folder as the root directory or setting directory paths).
5. Add Environment Variables:
   - `MONGODB_URI` - Atlas connection URI link
   - `JWT_SECRET` - Random crypt key string
   - `NODE_ENV` - `production`

### Frontend (Netlify)
1. Log in to [Netlify](https://www.netlify.com/).
2. Create **New Site from Git**.
3. Set configuration settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Set up proxy redirects:
   Create a `_redirects` file in your `frontend/public/` folder to route API requests correctly:
   ```text
   /api/*  https://your-render-backend-url.onrender.com/api/:splat  200
   /*      /index.html  200
   ```
