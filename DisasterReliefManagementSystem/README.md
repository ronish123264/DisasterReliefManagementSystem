# Smart Disaster Relief Management System ⭐

A beginner-level **Java + Web** project for **Nepal disaster relief**.

Nepal frequently experiences **earthquakes, floods, landslides and forest fires**.
During a disaster it is difficult to know:

- Which areas are affected
- Which shelters have space
- What supplies are available
- Which volunteers are available

This system brings all of that into one place.

The project has **two parts** that implement the same features:

| Part | Technology | Where data is stored |
|------|-----------|----------------------|
| **Console application** | Beginner Java (classes, inheritance, ArrayList, Scanner) | Text files in the `data/` folder (file handling) |
| **Website** | HTML + CSS + JavaScript (no frameworks) | Browser localStorage |

Both are written only with **beginner-level** concepts — no databases, no frameworks, no advanced Java.

---

## Features (all 7 required + file handling)

1. **Disaster reporting** — citizens report earthquakes, floods, landslides and forest fires; staff update the status (Reported → Ongoing → Resolved).
2. **Shelter management** — add shelters with capacity, see occupied and free space (full shelters are highlighted).
3. **Volunteer registration** — volunteers register with skills and availability; they can claim relief requests.
4. **Resource inventory** — rice, water, medicine, blankets etc. tracked per warehouse.
5. **Relief request management** — citizens request relief, admin/municipality approve or reject, volunteers claim them.
6. **Missing person records** — report missing people, mark them as found.
7. **Donation tracking** — money and supply donations with totals.
8. **File handling** — the console app saves every record to a text file after each change and reloads them on start.

### User roles

| Role | What they can do |
|------|------------------|
| **Admin** | Everything: shelters, resources, approve requests, mark found, view volunteers & donations, create municipality accounts, summary report |
| **Municipality** | Manage disasters, shelters, resources, approve requests, mark missing as found, summary report |
| **Volunteer** | View disasters/shelters/requests, claim relief requests, update own availability |
| **Citizen** | Report disasters, request relief, report missing persons, donate, view all records |

---

## How to run the console application

**Windows (easiest):** double-click `run.bat`

**Manual (any OS):**
```bash
javac src/*.java -d bin
java -cp bin Main
```

### Default accounts (created on first run)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Municipality | `municipality` | `muni123` |
| Volunteer | `ramvol` | `ram123` |
| Citizen | `sita` | `sita123` |

New citizens and volunteers can also register from the main menu (option 2).

### Menus by role (console app)

You see these menus **after choosing option 1 (Login)** on the main menu:

**ADMIN MENU** — after login as `admin`
```
1. View Disasters            8. Approve / Reject Relief Request
2. Update Disaster Status    9. View Missing Persons
3. View Shelters            10. Mark Missing Person as Found
4. Add Shelter              11. View Volunteers
5. View Resources           12. View Donations
6. Add Resource             13. Create Municipality Account
7. View Relief Requests     14. Summary Report
0. Logout
```

**MUNICIPALITY MENU** — after login as `municipality`
```
1. View Disasters            7. View Relief Requests
2. Update Disaster Status    8. Approve / Reject Relief Request
3. View Shelters             9. View Missing Persons
4. Add Shelter              10. Mark Missing Person as Found
5. View Resources           11. Summary Report
6. Add Resource              0. Logout
```

**VOLUNTEER MENU** — after login as `ramvol`
```
1. View Disasters            4. Claim a Relief Request
2. View Shelters             5. Update My Availability
3. View Relief Requests      6. View Missing Persons
0. Logout
```

**CITIZEN MENU** — after login as `sita` (or a newly registered citizen)
```
1. Report a Disaster         5. View My Relief Requests
2. View Disasters            6. Report a Missing Person
3. View Shelters             7. View Missing Persons
4. Request Relief            8. Make a Donation
0. Logout
```

### Where are the role menus on the website?

The website has **one shared navbar** (Disasters, Shelters, Volunteers, Resources,
Relief Requests, Missing Persons, Donations). The role menus appear **inside each page
after you login**, as extra buttons and forms:

| Logged in as | What appears that others don't see |
|--------------|-------------------------------------|
| **Admin / Municipality** | "Add a Shelter" form, "Add a Resource" form, Approve / Reject buttons on Pending requests, Mark Found buttons, "Update Status" dropdown on each disaster |
| **Volunteer** | "Claim" button on Pending relief requests with no volunteer |
| **Citizen** | "Report a Disaster", "Request Relief", "Report a Missing Person" and "Make a Donation" forms |
| **Nobody (guest)** | Read-only tables + the login/register page |

When you login, a green toast message confirms who you are, and your name + role is
shown as a chip on the top-right of the navbar.

---

## File handling details

All data lives in the `data/` folder, one text file per record type:

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

- Fields are separated by `|`; typed input is cleaned so `|` cannot break the format.
- On the first run the program creates default accounts and a little sample data.
- Delete the `data/` folder to reset the system to a fresh first run.

---

## How to run the website

Open `website/index.html` in any browser (double-click it). No server or internet needed.

- Login with the same demo accounts (shown on the login page).
- The navbar switches between sections; live totals are shown on the home page.
- Buttons and forms appear based on the logged-in role, exactly like the console menus.
- Data is saved in the browser (localStorage). To reset the website data, open the
  browser developer tools console and run: `localStorage.removeItem('drms_db')`.

---

## Java concepts used (beginner level)

- Classes, objects, constructors, **encapsulation** (private fields + getters/setters)
- **Inheritance** — `User` → `Admin`, `Municipality`, `Volunteer`, `Citizen`
- **Polymorphism** — overridden `displayInfo()` and `toFileString()` methods
- `instanceof` and casting when handling different user types
- `ArrayList` for storing records, loops and `switch`/`if-else` for menus
- `Scanner` for console input with number-validation helpers
- **File I/O** — `File`, `BufferedReader`, `FileWriter`, `PrintWriter`, `String.split`
- `try-catch` for number parsing and file errors

## Project structure

```
DisasterReliefManagementSystem/
├── run.bat                  double-click to run the console app (Windows)
├── run.sh                   run script for Linux/macOS
├── src/
│   ├── Main.java            menus, login, all features
│   ├── FileHandler.java     saves/loads every record to text files
│   ├── User.java            base user class
│   ├── Admin.java  Municipality.java  Volunteer.java  Citizen.java
│   ├── Disaster.java  Shelter.java  Resource.java
│   ├── ReliefRequest.java  MissingPerson.java  Donation.java
├── website/
│   ├── index.html           all sections (SPA-style navigation)
│   ├── style.css            design
│   └── script.js            data + logic (localStorage)
└── data/                    created automatically at first run
```
