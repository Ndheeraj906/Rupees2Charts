# Rupees2Charts 📊

A premium, browser-based **income & expense tracker** built with vanilla JS and Node.js. It features a stunning glassmorphic UI, live data visualization, and secure user authentication.

🚀 **Live Demo:** [https://rupees2charts-478532845626.us-central1.run.app](https://rupees2charts-478532845626.us-central1.run.app)

---

## ✨ Features

- **Dynamic Dashboard**: Monthly income & expense entry with a sleek, responsive tabbed UI.
- **Visual Analytics**: Interactive bar charts (Chart.js) comparing monthly figures in **Indian Rupee (₹)**.
- **Secure Auth**: Full registration/login system using **bcrypt** for password hashing and **express-session** for state management.
- **Modern Aesthetics**: Premium design using custom CSS, glassmorphism, mesh gradients, and smooth micro-animations.
- **Robust Backend**: Node.js/Express server backed by a **PostgreSQL** database.

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| **Frontend**   | HTML5, Vanilla CSS, Bootstrap 5.3.3, Chart.js  |
| **Backend**    | Node.js 20, Express 5             |
| **Database**   | PostgreSQL 16                     |
| **Auth**       | bcryptjs, express-session         |
| **Testing**    | Jest, jest-environment-jsdom      |
| **Deployment** | Docker, Google Cloud Run          |

---

## 🚀 Quick Start (Local)

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Setup
```bash
git clone https://github.com/Ndheeraj906/Rupees2Charts.git
cd Rupees2Charts
cp .env.example .env
```

### 3. Run with Docker
```bash
docker compose up --build
```
Access the app at **http://localhost:3000**.

---

## ☁️ Cloud Deployment

This project is optimized for **Google Cloud Run**. 

### Deployment Steps:
1. **Build and Push Image**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/rupees2charts
   ```
2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy rupees2charts --image gcr.io/[PROJECT_ID]/rupees2charts --platform managed --allow-unauthenticated --port 3000
   ```

---

## 🧪 Running Tests

Ensure all logic is sound before committing:
```bash
npm test
```
The test suite covers input validation, total calculations, and core script functionality.

---

## 📂 Project Structure

```
.
├── index.html            # Frontend UI (Glassmorphic Design)
├── script.js             # Client-side logic & Chart.js integration
├── server.js             # Express API & Session management
├── Dockerfile            # Multi-stage production build
├── docker-compose.yml    # Full-stack local orchestration
├── .env.example          # Template for secrets
└── tests/                # Jest test suites
```

---

## 📄 License

ISC License. Built with ❤️ for financial clarity.
