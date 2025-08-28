# Alloy Demo App (React + Express)

A minimal full-stack web app that simulates a credit application flow.  
It collects applicant information, sends it to an API (Alloy Sandbox), and displays the outcome (**Approved ✅**, **Manual Review 🔵**, **Denied ❌**).

- **Frontend:** React + Vite + React Hook Form + Zod + Modal
- **Backend:** Express + Axios + Zod + dotenv
- **Modes:**
  - **Simulation mode (`SIMULATE=1`)**: returns outcomes locally (based on last name).
  - **Real mode (`SIMULATE=0`)**: forwards requests to the Alloy Sandbox API.

---

## 📦 Prerequisites

- **Node.js 18+**
  - [Download Node.js](https://nodejs.org/en/download/)
  - Confirm installation:
    ```bash
    node -v   # should be >= 18
    npm -v    # comes with Node
    ```

- **npm** (included with Node)

---

## 🚀 Getting Started

### 1. Clone or unzip this repo
```bash
git clone https://github.com/YOUR_USERNAME/alloy-demo.git
cd alloy-demo
```

Project structure:
```
alloy-demo/
  server/   # Express backend
  web/      # React frontend
```

### 2. Run the backend (Express)
```bash
cd server
cp .env.example .env       # Windows (PowerShell): Copy-Item .env.example .env
npm install
npm run dev
```
Backend runs on [http://localhost:3001](http://localhost:3001)

Check health:
```bash
curl http://localhost:3001/api/health
# {"ok":true}
```

### 3. Run the frontend (React + Vite)
```bash
cd ../web
npm install
npm run dev
```
Frontend runs on [http://localhost:5173](http://localhost:5173)

### 4. Submit a dummy application
Example values:

| Field        | Example           |
|--------------|-------------------|
| First Name   | Yonel             |
| Last Name    | Review            |
| Address      | 545 Vanderbilt Ave, Apt 19C, Brooklyn, NY 11238, US |
| State        | NY                |
| ZIP          | 11238             |
| Country      | US                |
| SSN          | 123456789         |
| Email        | test@test.com     |
| DOB          | 1994-04-26        |

---

## 🧪 Simulation vs Real Mode

### Simulation (default)
- Last Name = `Review` → Manual Review
- Last Name = `Deny` or `Denied` → Denied
- Any other last name → Approved
- Token starts with `SIM-`

### Real
Edit `server/.env`:
```env
ALLOY_BASE=https://sandbox.alloy.co
ALLOY_TOKEN=YOUR_TOKEN
ALLOY_SECRET=YOUR_SECRET
SIMULATE=0
```
Restart backend → now real Alloy requests.

---

## 🎨 Customization

- **Logo:** `web/src/logo.svg`
- **Colors:** `web/src/styles.css`
- **Fonts:** `web/index.html`

---

## ⚠️ Troubleshooting

- **"Failed to fetch":** backend not running or CORS issue.  
- **Validation errors:** check formats (state=2 letters, SSN=9 digits, DOB=YYYY-MM-DD, country=US).  
- **Exit backend:** Ctrl+C in terminal.  
- **Port conflicts:** change `PORT` in `server/.env` or `vite.config.js`.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Hook Form, Zod  
- **Backend:** Express, Axios, dotenv, Zod, Morgan  
- **Modes:** Simulation vs Real Alloy API  
