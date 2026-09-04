# Smart Disaster Relief Management System ⭐

A disaster relief management system for **Nepal** covering earthquakes, floods,
landslides and forest fires. During a disaster it is hard to know which areas are
hit, which shelters have space, what supplies exist and which volunteers are free.
This project keeps one shared record of all of it.

Three parts, one system:

| Part | Tech | Data storage |
|------|------|--------------|
| **Console app** | Beginner Java | Text files in `data/` (file handling) |
| **Web app** | React + Tailwind CSS v4 + Vite (`web/`) | Browser localStorage |
| **Static site** | Plain HTML/CSS/JS (`website/`) | Browser localStorage |

All three implement the same features and the same role system. The console app
is the beginner-Java deliverable; the web app is the modern front end.

---

## Features

1. **Disaster reporting** — earthquakes, floods, landslides, forest fires; status moves Reported → Ongoing → Resolved
2. **Shelter management** — capacity, occupancy, free space, at-capacity highlighting
3. **Volunteer registration** — skills + availability, volunteers claim requests
4. **Resource inventory** — supplies per warehouse with quantities
5. **Relief request management** — citizen files → staff approves/rejects → volunteer claims
6. **Missing person records** — report, track, mark found
7. **Donation tracking** — money and supplies with running totals

### Roles

| Role | Powers |
|------|--------|
| **Admin** | Everything, plus volunteer list, donations view, municipality account creation, summary report |
| **Municipality** | Disaster status, shelters, resources, request approvals, mark missing found |
| **Volunteer** | View records, claim relief requests, set own availability |
| **Citizen** | Report disasters and missing persons, request relief, donate |

Demo accounts (seeded on first run in all three parts):

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Municipality | `municipality` | `muni123` |
| Volunteer | `ramvol` | `ram123` |
| Citizen | `sita` | `sita123` |

---

## 1. Console application (Java)

**Windows:** double-click `run.bat`
**Linux/macOS:** `./run.sh`
**Manual:**

```bash
javac src/*.java -d bin
java -cp bin Main
```

Pick `1. Login`, enter an account above, and the role menu appears. Citizens and
volunteers can self-register from the main menu.

### File handling

Every record is a line in `data/`, fields separated by `|`:

```
data/
├── users.txt        ROLE|username|password|fullName|phone|extra
├── disasters.txt    id|type|location|severity|date|description|status|reportedBy
├── shelters.txt     id|name|location|capacity|occupied|contact
├── resources.txt    id|name|quantity|unit|location
├── requests.txt     id|citizenName|contact|location|needType|quantity|status|date|volunteer
├── missing.txt      id|name|age|lastSeen|reportedBy|contact|status|date
└── donations.txt    id|donorName|type|itemName|amount|date
```

Written after every change, reloaded on start. Delete `data/` for a fresh first run.

---

## 2. Web app (React + Tailwind)

Requires Node.js 18+.

```bash
cd web
npm install     # first time
npm run dev     # development server
npm run build   # production build → web/dist/
```

Stack and conventions:

- **Vite + React**, functional components and hooks only
- **Tailwind CSS v4** with design tokens in `src/index.css` (one accent: Nepal crimson `#a4222d`; zinc-paper neutrals; 6px radius system)
- **Geist** type family, self-hosted via `@fontsource-variable` (display + mono for all numbers)
- **Phosphor icons** (single icon family, no emoji in the UI)
- **motion** for view transitions and reveals, all gated behind `prefers-reduced-motion`
- State in React Context (`src/context/AppContext.jsx`); persistence in `src/lib/db.js` using the same `localStorage` keys as the static site, so data carries over between the two

Source layout:

```
web/src/
├── main.jsx            entry
├── App.jsx             shell: top bar, section router, footer, toast
├── index.css           Tailwind v4 theme tokens (colors, fonts, radii)
├── lib/db.js           localStorage persistence + seed data
├── context/AppContext.jsx   global state + all domain actions
├── components/         ui primitives, table, top bar, toast, gates
└── views/              Overview + 7 feature views + Login
```

## 3. Static site (no build)

Double-click `website/index.html`. Same features, same data shape, zero tooling.

---

## Java concepts used (beginner level)

- Classes, objects, constructors, **encapsulation** (private fields + getters/setters)
- **Inheritance** — `User` → `Admin`, `Municipality`, `Volunteer`, `Citizen`
- **Polymorphism** — overridden `displayInfo()` and `toFileString()` methods
- `instanceof` and casting for different user types
- `ArrayList`, loops, `if-else` menus, `Scanner` input with number validation
- **File I/O** — `File`, `BufferedReader`, `FileWriter`, `PrintWriter`, `String.split`
- `try-catch` for parsing and file errors

## Project structure

```
DisasterReliefManagementSystem/
├── run.bat / run.sh       console app launchers
├── src/                   13 beginner-level Java classes
├── website/               static HTML/CSS/JS version
├── web/                   React + Tailwind version (primary web UI)
└── data/                  created at first console run
```
