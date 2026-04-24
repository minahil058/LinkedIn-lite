# 🚀 MERN Stack Job Portal - LinkedIn Lite

A high-fidelity, professional job portal built with the modern MERN stack. Designed for recruiters to post jobs and candidates to find opportunities with a premium, LinkedIn-inspired user experience.

![Project Status](https://img.shields.io/badge/Status-Complete-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## ✨ Core Features

- 🔐 **JWT Authentication**: Secure user authentication with JSON Web Tokens and HTTP-only cookies.
- ☁️ **Cloudinary Integration**: High-performance image and resume uploads for profiles and company logos.
- 👥 **Role-based Dashboards**: Specialized interfaces for **Recruiters** (Job Management) and **Candidates** (Application Tracking).
- 🔍 **Advanced Job Feed**: Snappy search and filtering logic to find the perfect professional match.
- 📊 **Application Status Tracking**: Real-time status updates (Pending, Accepted, Rejected) for every job application.

---

## 🛠️ Tech Stack

### Frontend
- **React**: Modern component-based architecture.
- **Tailwind CSS v4**: Ultra-premium, responsive styling with a minimalist aesthetic.
- **Redux Toolkit**: Centralized state management for users and jobs.
- **Vite**: Next-generation frontend tooling for optimized performance.

### Backend
- **Node.js & Express**: Scalable and robust server-side architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database with strict schema modeling.
- **Bcrypt.js**: Advanced password hashing for maximum security.

---

## ⚙️ .env Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary Keys (Required for Live Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd job-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run start
```
*The server will run at `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The application will be available at `http://localhost:5173`*

---

## 🛡️ Reliability Features
- **Zero-Icon Stability**: Uses high-quality text and image-based fallbacks to ensure the app never crashes due to missing dependencies.
- **Secure Hashing**: Bulletproof synchronous hashing in Mongoose hooks to prevent process hanging.
- **Global Error Handling**: Standardized JSON responses for all API endpoints.

---

**LinkedIn Lite** - Empowering professionals through technology. 🚀
