# Rupees2Charts

A browser-based monthly **income & expense tracker** built with vanilla JS, Bootstrap 5, and Chart.js. A Node.js/Express backend provides user authentication (register / login / logout) with session management, backed by PostgreSQL.

---

## Features

- **Monthly income & expense entry** across all 12 months in a tabbed UI
- **Live bar chart** (Chart.js) comparing income vs expenses per month in South African Rand (R)
- **User authentication** — register, login, and logout with bcrypt-hashed passwords
- **Session-based auth** with secure, HttpOnly cookies
- Fully responsive Bootstrap 5 UI — works on desktop and mobile

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, Bootstrap 5.3.3, Chart.js  |
| Backend    | Node.js 20, Express 5             |
| Database   | PostgreSQL 16                     |
| Auth       | bcryptjs, express-session         |
| Testing    | Jest, jest-environment-jsdom      |
| Container  | Docker, Docker Compose            |

---

## Quick Start with Docker (Recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone the repository

```bash
git clone https://github.com/Ndheeraj906/Rupees2Charts.git
cd Rupees2Charts
```

### 2. Configure environment

Copy the example env file and fill in your secrets:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_PASSWORD=your_strong_postgres_password
SESSION_SECRET=your_random_secret_string
```

> Generate a secure `SESSION_SECRET`:
> ```bash
> node -e "require('crypto').randomBytes(48,(_,b)=>console.log(b.toString('hex')))"
> ```

### 3. Start the app

```bash
docker compose up --build
```

The app will be available at **http://localhost:3000**

### 4. Stop the app

```bash
docker compose down
```

> To also remove the database volume: `docker compose down -v`

---

## Local Development (without Docker)

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
psql -U postgres -f db/setup.sql
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your local DB credentials and session secret
```

### 4. Start the server

```bash
npm start
```

App runs at **http://localhost:3000**

---

## Running Tests

```bash
npm test
```

Tests use Jest with jsdom and cover:
- Input validation logic (`validateUsername.test.js`)
- Totals calculation (`updateTotals.test.js`)
- Script logic (`script.test.js`)

---

## Project Structure

```
.
├── index.html            # Frontend UI (Bootstrap 5 + Chart.js)
├── script.js             # All client-side logic
├── server.js             # Express app (auth API + static serving)
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example          # Environment variable template
├── db/
│   ├── setup.sql         # Database & table creation script
│   └── seed.js           # Optional seed data
└── tests/
    ├── script.test.js
    ├── updateTotals.test.js
    └── validateUsername.test.js
```

---

## API Endpoints

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| POST   | /api/register  | Register a new user                |
| POST   | /api/login     | Login with username + password     |
| POST   | /api/logout    | Destroy session and logout         |
| GET    | /api/me        | Returns current session user info  |

---

## Environment Variables

| Variable         | Required | Default      | Description                          |
|------------------|----------|--------------|--------------------------------------|
| `DB_HOST`        | No       | `localhost`  | PostgreSQL host                      |
| `DB_PORT`        | No       | `5432`       | PostgreSQL port                      |
| `DB_NAME`        | No       | `ruppes2bar` | Database name                        |
| `DB_USER`        | No       | `postgres`   | Database user                        |
| `DB_PASSWORD`    | **Yes**  | —            | Database password                    |
| `SESSION_SECRET` | **Yes**  | —            | Secret key for session signing       |
| `PORT`           | No       | `3000`       | Port the Express server listens on   |

---

## License

ISC
