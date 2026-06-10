# Portfolio Management System — Next.js Full Stack

A complete portfolio platform with authentication, project management, and skills management.

---

## SETUP & RUN INSTRUCTIONS

### Prerequisites
- Node.js 18 or higher → https://nodejs.org
- npm (comes with Node.js)

### Step 1 — Install dependencies

Open a terminal, navigate to this folder, then run:

```bash
npm install
```

> Note: `better-sqlite3` compiles a native module. If you see a build error, make sure you have Python and a C++ compiler installed (on Windows: run `npm install --global windows-build-tools` in an admin terminal, or install Visual Studio Build Tools).

### Step 2 — Set your JWT secret (optional but recommended)

Open `.env.local` and change the JWT_SECRET to any random string:

```
JWT_SECRET=some-long-random-secret-string
```

### Step 3 — Run the app

```bash
npm run dev
```

The app starts at: **http://localhost:3000**

---

## HOW TO USE

1. Open http://localhost:3000 — you see the public landing page
2. Click **Get Started** → Register with your name, email, password
3. You're taken to the **Dashboard**
4. Fill in your **Profile** (name, title, bio, GitHub, LinkedIn, etc.)
5. Go to **Projects** → Add your projects with descriptions and links
6. Go to **Skills** → Add skills by category and proficiency level
7. Click **View Portfolio** (top right in dashboard) to see your live public page

---

## FOLDER STRUCTURE

```
portfolio-app/
├── .env.local              ← JWT secret (edit this)
├── middleware.js           ← Route protection (redirects unauthenticated users)
├── next.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
│
├── lib/
│   ├── db.js              ← SQLite database setup + table creation
│   └── auth.js            ← JWT sign/verify helpers
│
└── app/
    ├── layout.js           ← Root layout
    ├── globals.css         ← Tailwind CSS
    ├── page.js             ← Public portfolio page (Home, About, Skills, Projects, Contact)
    │
    ├── auth/
    │   ├── login/page.js   ← Login page
    │   └── register/page.js ← Register page
    │
    ├── dashboard/
    │   ├── layout.js        ← Dashboard nav (protected)
    │   ├── page.js          ← Edit profile (Portfolio Management)
    │   ├── ProfileForm.js   ← Profile form component
    │   ├── LogoutButton.js  ← Logout button
    │   ├── projects/
    │   │   ├── page.js          ← Projects management page
    │   │   └── ProjectsClient.js ← Add/Edit/Delete projects (Project Management)
    │   └── skills/
    │       ├── page.js          ← Skills management page
    │       └── SkillsClient.js  ← Add/Edit/Delete skills (Skills Management)
    │
    └── api/
        ├── auth/
        │   ├── register/route.js  ← POST /api/auth/register
        │   ├── login/route.js     ← POST /api/auth/login
        │   └── logout/route.js    ← POST /api/auth/logout
        ├── portfolio/route.js     ← GET/PUT /api/portfolio
        ├── projects/
        │   ├── route.js           ← GET/POST /api/projects
        │   └── [id]/route.js      ← PUT/DELETE /api/projects/:id
        └── skills/
            ├── route.js           ← GET/POST /api/skills
            └── [id]/route.js      ← PUT/DELETE /api/skills/:id
```

---

## DEPLOY TO VERCEL (free)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → Import your repo
3. Add environment variable: `JWT_SECRET` = your secret string
4. Click Deploy

> Note: SQLite writes to the local filesystem. For production, consider switching to a cloud database like PlanetScale (MySQL) or Supabase (PostgreSQL) with Prisma.

---

## FEATURES COVERED

| Requirement | Status |
|---|---|
| Authentication (Register + Login + Logout) | ✅ |
| Portfolio Management (profile, bio, links) | ✅ |
| Project Management (add, edit, delete) | ✅ |
| Skills Management (add, edit, delete, by category) | ✅ |
| Public portfolio page (Home, About, Skills, Projects, Contact) | ✅ |
| Responsive design | ✅ |
| Protected routes (middleware) | ✅ |
