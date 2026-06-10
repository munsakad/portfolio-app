# Portfolio Android App + SQL Analytics

A complete Android Java portfolio management system with built-in data analytics.
Built for the CODIORA Remote Internship Program — Week 1 Task.

---

## WHAT'S INSIDE

```
portfolio-android/
├── app/                          ← Android Java App
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/portfolio/app/
│       │   ├── activities/       ← All screens
│       │   │   ├── SplashActivity.java
│       │   │   ├── LoginActivity.java
│       │   │   ├── RegisterActivity.java
│       │   │   ├── MainActivity.java     ← Home screen
│       │   │   ├── ProfileActivity.java  ← Profile + Skills
│       │   │   ├── ProjectsActivity.java ← Projects list
│       │   │   ├── AddProjectActivity.java
│       │   │   ├── AddSkillActivity.java
│       │   │   ├── ContactActivity.java
│       │   │   └── AnalyticsActivity.java ← Charts dashboard
│       │   ├── database/
│       │   │   └── DatabaseHelper.java   ← All SQL queries
│       │   ├── models/           ← User, Project, Skill
│       │   └── adapters/         ← RecyclerView adapters
│       └── res/
│           ├── layout/           ← All XML screen layouts
│           ├── values/
│           │   ├── colors.xml    ← BRAND KIT color palette
│           │   ├── themes.xml    ← Brand styles & themes
│           │   └── strings.xml
│           └── drawable/         ← Logo, backgrounds, tags
│
└── analytics/                    ← SQL Analytics Layer
    ├── schema_and_sample_data.sql ← Tables + 5 users + data
    ├── analytics_queries.sql      ← All analysis SQL queries
    └── run_analytics.py           ← Python analytics report
```

---

## HOW TO OPEN IN VS CODE

### Prerequisites
Install these first (all free):
- **Java JDK 17+** → https://adoptium.net
- **Android Studio** (for the Android emulator) → https://developer.android.com/studio
- **VS Code Extensions** → install "Extension Pack for Java" and "Android iOS Emulator"

### Step 1 — Open the project
```
File → Open Folder → select portfolio-android/
```

### Step 2 — Open in Android Studio (to build & run)
Android Studio handles Gradle and the emulator best.

1. Open Android Studio
2. **File → Open** → select the `portfolio-android/` folder
3. Wait for Gradle sync to finish (1-2 minutes)
4. Click the green **Run ▶** button
5. Choose an emulator (or plug in your Android phone)

> The app will install and launch on the emulator automatically.

---

## HOW TO RUN THE SQL ANALYTICS

The analytics layer runs standalone — no Android needed.

### Step 1 — Install Python dependency
```bash
pip install tabulate
```

### Step 2 — Run the report
```bash
cd analytics
python run_analytics.py
```

You'll see a full analytics report in the terminal covering:
- Platform overview (users, projects, skills totals)
- User profiles with project & skill counts
- Skills distribution by category (with %)
- Skills by proficiency level
- Top 10 most common skills
- Projects with live demo URLs
- Portfolio completeness scores per user

---

## APP FEATURES

| Feature | Description |
|---|---|
| Splash Screen | Branded intro — auto-navigates based on login state |
| Register / Login | SQLite-backed auth with session persistence |
| Home Screen | Avatar, bio, stats (projects + skills count), quick actions |
| Profile Management | Edit name, title, bio, location, phone, social links |
| Skills Management | Add skills with category & level, progress bar display |
| Projects Management | Add/edit/delete projects with tech stack & URLs |
| Contact Screen | One-tap email, GitHub, LinkedIn, website links |
| Analytics Dashboard | Pie chart (skills by category) + Bar chart (by level) |
| Sample Data | Auto-loaded on first register — 14 skills, 5 projects |
| Brand Kit | Deep Navy + Ocean Blue + Cyan color palette throughout |

---

## BRAND KIT

The app uses a professional brand identity built into `colors.xml` and `themes.xml`:

| Token | Hex | Use |
|---|---|---|
| `brand_primary` | `#03045E` | Dark navy — backgrounds, text on buttons |
| `brand_secondary` | `#0077B6` | Ocean blue — app bar, avatar |
| `brand_accent` | `#00B4D8` | Cyan — highlights, buttons, chart colors |
| `brand_light` | `#90E0EF` | Sky cyan — labels, secondary text |
| `surface_dark` | `#1A1A2E` | Screen backgrounds |
| `surface_card` | `#16213E` | Card backgrounds |
| `success` | `#06D6A0` | Expert level badge |

---

## DEPLOYMENT (Share your APK)

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Choose **APK** → follow the signing wizard
3. Your APK will be in `app/release/app-release.apk`
4. Share the APK file or upload to Google Play
