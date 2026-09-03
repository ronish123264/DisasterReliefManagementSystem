// ============================================================
// SMART DISASTER RELIEF MANAGEMENT SYSTEM - WEBSITE
// Beginner-level JavaScript.
// All data is saved inside the browser using localStorage,
// the same way the Java console app saves to text files.
// ============================================================

var DB_KEY = "drms_db";      // all records
var SESSION_KEY = "drms_session"; // logged in username

var db = {};
var currentUser = null;

// ================= SAMPLE DATA (FIRST VISIT ONLY) =================

function defaultData() {
  var t = today();
  return {
    users: [
      { id: 1, role: "ADMIN", username: "admin", password: "admin123", fullName: "System Admin", phone: "9800000001", district: "", skills: "", availability: "Available", address: "" },
      { id: 2, role: "MUNICIPALITY", username: "municipality", password: "muni123", fullName: "Kathmandu Municipality", phone: "9800000002", district: "Kathmandu", skills: "", availability: "Available", address: "" },
      { id: 3, role: "VOLUNTEER", username: "ramvol", password: "ram123", fullName: "Ram Bahadur", phone: "9800000003", district: "", skills: "First Aid, Rescue Driving", availability: "Available", address: "" },
      { id: 4, role: "CITIZEN", username: "sita", password: "sita123", fullName: "Sita Sharma", phone: "9800000004", district: "", skills: "", availability: "Available", address: "Bhaktapur" }
    ],
    disasters: [
      { id: 1, type: "Flood", location: "Saptari", severity: "High", date: t, description: "Koshi river overflowed into nearby villages.", status: "Ongoing", reportedBy: "Sita Sharma" },
      { id: 2, type: "Earthquake", location: "Kathmandu", severity: "Medium", date: t, description: "Minor quake damaged some old houses in the old bazaar.", status: "Resolved", reportedBy: "Kathmandu Municipality" }
    ],
    shelters: [
      { id: 1, name: "Bhaktapur College Shelter", location: "Bhaktapur", capacity: 200, occupied: 85, contact: "9801000001" },
      { id: 2, name: "Saptari Community Hall", location: "Saptari", capacity: 150, occupied: 150, contact: "9801000002" },
      { id: 3, name: "Kathmandu Public School", location: "Kathmandu", capacity: 300, occupied: 40, contact: "9801000003" }
    ],
    resources: [
      { id: 1, name: "Rice Bags", quantity: 120, unit: "bags", location: "Central Warehouse, Kathmandu" },
      { id: 2, name: "Drinking Water", quantity: 300, unit: "bottles", location: "Central Warehouse, Kathmandu" },
      { id: 3, name: "First Aid Kits", quantity: 45, unit: "kits", location: "Bir Hospital Store" },
      { id: 4, name: "Blankets", quantity: 80, unit: "pieces", location: "Central Warehouse, Kathmandu" }
    ],
    requests: [
      { id: 1, citizenName: "Ram Bahadur", contact: "9800000003", location: "Saptari", needType: "Drinking Water", quantity: 20, status: "Pending", date: t, volunteer: "" },
      { id: 2, citizenName: "Sita Sharma", contact: "9800000004", location: "Bhaktapur", needType: "Food", quantity: 10, status: "Approved", date: t, volunteer: "Ram Bahadur" }
    ],
    missing: [
      { id: 1, name: "Hari Karki", age: 34, lastSeen: "Saptari weekly market", reportedBy: "Gita Karki", contact: "9800000005", status: "Missing", date: t }
    ],
    donations: [
      { id: 1, donorName: "Nabil Bank", type: "Money", itemName: "-", amount: 250000, date: t },
      { id: 2, donorName: "Sita Sharma", type: "Supplies", itemName: "20 blankets", amount: 0, date: t }
    ]
  };
}

// ================= STORAGE HELPERS =================

function loadDB() {
  var raw = localStorage.getItem(DB_KEY);
  if (raw) {
    db = JSON.parse(raw);
  } else {
    db = defaultData();
    saveDB();
  }
  // keep the user logged in after refreshing the page
  var sessionName = localStorage.getItem(SESSION_KEY);
  if (sessionName) {
    currentUser = findUser(sessionName);
  }
}

function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function findUser(username) {
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].username.toLowerCase() === username.toLowerCase()) {
      return db.users[i];
    }
  }
  return null;
}

// next free ID for a list of records
function nextId(list) {
  var max = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id > max) {
      max = list[i].id;
    }
  }
  return max + 1;
}

function today() {
  var d = new Date();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  var mm = (m < 10) ? "0" + m : "" + m;
  var dd = (day < 10) ? "0" + day : "" + day;
  return d.getFullYear() + "-" + mm + "-" + dd;
}

// stop user-typed text from breaking the HTML tables
function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function statusBadge(status) {
  var cls = status.toLowerCase().replace(" ", "-");
  return '<span class="badge badge-' + cls + '">' + esc(status) + '</span>';
}

// ================= ROLE HELPERS =================

function isStaff() {
  return currentUser !== null &&
    (currentUser.role === "ADMIN" || currentUser.role === "MUNICIPALITY");
}

function isCitizen() {
  return currentUser !== null && currentUser.role === "CITIZEN";
}

function isVolunteer() {
  return currentUser !== null && currentUser.role === "VOLUNTEER";
}

// ================= NAVIGATION =================

function showSection(id) {
  var sections = document.querySelectorAll(".section");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("hidden");
  }
  document.getElementById(id).classList.remove("hidden");

  var links = document.querySelectorAll("#navLinks a");
  for (var j = 0; j < links.length; j++) {
    if (links[j].getAttribute("data-sec") === id) {
      links[j].classList.add("active");
    } else {
      links[j].classList.remove("active");
    }
  }
  window.scrollTo(0, 0);
}

function goRegister(role) {
  document.getElementById("regRole").value = role;
  toggleRegFields();
  showSection("login");
}

// ================= LOGIN / REGISTER =================

function login() {
  var username = document.getElementById("loginUsername").value.trim();
  var password = document.getElementById("loginPassword").value;
  var msg = document.getElementById("loginMsg");

  var user = findUser(username);
  if (user === null || user.password !== password) {
    msg.textContent = "Wrong username or password.";
    return;
  }
  currentUser = user;
  localStorage.setItem(SESSION_KEY, user.username);
  msg.textContent = "";
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
  updateAuthUI();
  renderAll();
  showMsg("Welcome, " + user.fullName + "!");
  showSection("home");
}

function logout() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  updateAuthUI();
  renderAll();
  showMsg("You are logged out.");
  showSection("home");
}

function registerUser() {
  var msg = document.getElementById("regMsg");
  var role = document.getElementById("regRole").value;
  var username = document.getElementById("regUsername").value.trim();
  var password = document.getElementById("regPassword").value;
  var fullName = document.getElementById("regFullName").value.trim();
  var phone = document.getElementById("regPhone").value.trim();

  if (username === "" || password === "" || fullName === "") {
    msg.textContent = "Please fill every required field.";
    return;
  }
  if (findUser(username) !== null) {
    msg.textContent = "That username is already taken.";
    return;
  }

  var newUser = {
    id: nextId(db.users),
    role: role,
    username: username,
    password: password,
    fullName: fullName,
    phone: phone,
    district: "",
    skills: "",
    availability: "Available",
    address: ""
  };
  if (role === "VOLUNTEER") {
    newUser.skills = document.getElementById("regSkills").value.trim();
  } else {
    newUser.address = document.getElementById("regAddress").value.trim();
  }

  db.users.push(newUser);
  saveDB();
  msg.textContent = "";

  currentUser = newUser;
  localStorage.setItem(SESSION_KEY, newUser.username);
  updateAuthUI();
  renderAll();
  showMsg("Account created. Welcome, " + fullName + "!");
  showSection("home");
}

// show skills box only for volunteers, address box only for citizens
function toggleRegFields() {
  var role = document.getElementById("regRole").value;
  if (role === "VOLUNTEER") {
    document.getElementById("regSkillsWrap").classList.remove("hidden");
    document.getElementById("regAddressWrap").classList.add("hidden");
  } else {
    document.getElementById("regSkillsWrap").classList.add("hidden");
    document.getElementById("regAddressWrap").classList.remove("hidden");
  }
}

// show amount box for money, item box for supplies
function toggleDonateFields() {
  var type = document.getElementById("dnType").value;
  if (type === "Money") {
    document.getElementById("dnAmountLabel").classList.remove("hidden");
    document.getElementById("dnItemLabel").classList.add("hidden");
  } else {
    document.getElementById("dnAmountLabel").classList.add("hidden");
    document.getElementById("dnItemLabel").classList.remove("hidden");
  }
}

// ================= ROLE-BASED FORM VISIBILITY =================

function updateAuthUI() {
  var navUser = document.getElementById("navUser");
  if (currentUser) {
    navUser.innerHTML =
      '<span class="user-chip">' + esc(currentUser.fullName) + ' (' + currentUser.role + ')</span>' +
      '<button class="btn btn-ghost btn-sm" onclick="logout()">Logout</button>';
  } else {
    navUser.innerHTML = '<button class="btn btn-accent btn-sm" onclick="showSection(\'login\')">Login / Register</button>';
  }

  var guestText = "Please login to use this form. Demo citizen account: sita / sita123.";
  var staffText = "Only ADMIN and MUNICIPALITY accounts can use this form.";
  var citizenText = "Only CITIZEN accounts can use this form. Demo citizen: sita / sita123.";

  // citizen-only forms
  var citizenForms = [
    ["formReportDisaster", "noteReportDisaster"],
    ["formRequestRelief", "noteRequestRelief"],
    ["formReportMissing", "noteReportMissing"],
    ["formDonate", "noteDonate"]
  ];
  for (var i = 0; i < citizenForms.length; i++) {
    var form = document.getElementById(citizenForms[i][0]);
    var note = document.getElementById(citizenForms[i][1]);
    if (isCitizen()) {
      form.classList.remove("hidden");
      note.textContent = "";
    } else {
      form.classList.add("hidden");
      note.textContent = currentUser ? citizenText : guestText;
    }
  }

  // staff-only forms
  var staffForms = [
    ["formAddShelter", "noteAddShelter"],
    ["formAddResource", "noteAddResource"]
  ];
  for (var j = 0; j < staffForms.length; j++) {
    var sForm = document.getElementById(staffForms[j][0]);
    var sNote = document.getElementById(staffForms[j][1]);
    if (isStaff()) {
      sForm.classList.remove("hidden");
      sNote.textContent = "";
    } else {
      sForm.classList.add("hidden");
      sNote.textContent = currentUser ? staffText : guestText;
    }
  }

  // login / register panels
  if (currentUser) {
    document.getElementById("loginPanel").classList.add("hidden");
    document.getElementById("loggedInPanel").classList.remove("hidden");
    document.getElementById("loggedInAs").textContent =
      "You are logged in as " + currentUser.fullName + " (" + currentUser.role + ").";
  } else {
    document.getElementById("loginPanel").classList.remove("hidden");
    document.getElementById("loggedInPanel").classList.add("hidden");
  }

  // update-status column only for staff
  var actionHead = document.getElementById("disasterActionHead");
  if (isStaff()) {
    actionHead.classList.remove("hidden");
  } else {
    actionHead.classList.add("hidden");
  }
}

// ================= RENDERING =================

function renderAll() {
  renderStats();
  renderDisasters();
  renderShelters();
  renderVolunteers();
  renderResources();
  renderRequests();
  renderMissing();
  renderDonations();
}

function renderStats() {
  var openRequests = 0;
  for (var i = 0; i < db.requests.length; i++) {
    if (db.requests[i].status === "Pending" || db.requests[i].status === "Approved") {
      openRequests++;
    }
  }
  var freeSpace = 0;
  for (var j = 0; j < db.shelters.length; j++) {
    freeSpace = freeSpace + (db.shelters[j].capacity - db.shelters[j].occupied);
  }
  var totalMoney = 0;
  for (var k = 0; k < db.donations.length; k++) {
    totalMoney = totalMoney + db.donations[k].amount;
  }

  document.getElementById("statDisasters").textContent = db.disasters.length;
  document.getElementById("statRequests").textContent = openRequests;
  document.getElementById("statShelterSpace").textContent = freeSpace;
  document.getElementById("statDonations").textContent = "Rs. " + totalMoney.toLocaleString();
}

function renderDisasters() {
  var body = document.getElementById("disastersBody");
  var rows = "";
  var colCount = isStaff() ? 9 : 8; // staff see one extra "update status" column
  for (var i = 0; i < db.disasters.length; i++) {
    var d = db.disasters[i];
    var actionCell = "";
    if (isStaff()) {
      actionCell = '<td><select class="mini-select" onchange="updateDisasterStatus(' + d.id + ', this.value)">' +
        statusOption("Reported", d.status) + statusOption("Ongoing", d.status) +
        statusOption("Resolved", d.status) + '</select></td>';
    }
    rows += "<tr>" +
      "<td>" + d.id + "</td>" +
      "<td>" + esc(d.type) + "</td>" +
      "<td>" + esc(d.location) + "</td>" +
      "<td>" + statusBadge(d.severity) + "</td>" +
      "<td>" + esc(d.date) + "</td>" +
      "<td>" + statusBadge(d.status) + "</td>" +
      "<td>" + esc(d.reportedBy) + "</td>" +
      actionCell + "</tr>";
    rows += '<tr class="desc-row"><td colspan="' + colCount + '">' + esc(d.description) + "</td></tr>";
  }
  if (db.disasters.length === 0) {
    rows = '<tr><td colspan="' + colCount + '" class="empty">No disasters reported yet.</td></tr>';
  }
  body.innerHTML = rows;
}

function statusOption(value, current) {
  var selected = (value === current) ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + value + "</option>";
}

function renderShelters() {
  var body = document.getElementById("sheltersBody");
  var rows = "";
  for (var i = 0; i < db.shelters.length; i++) {
    var s = db.shelters[i];
    var free = s.capacity - s.occupied;
    var cls = (free === 0) ? ' class="row-full"' : "";
    rows += "<tr" + cls + ">" +
      "<td>" + s.id + "</td>" +
      "<td>" + esc(s.name) + "</td>" +
      "<td>" + esc(s.location) + "</td>" +
      "<td>" + s.capacity + "</td>" +
      "<td>" + s.occupied + "</td>" +
      "<td>" + (free > 0 ? '<b class="good">' + free + "</b>" : '<b class="bad">FULL</b>') + "</td>" +
      "<td>" + esc(s.contact) + "</td></tr>";
  }
  if (db.shelters.length === 0) {
    rows = '<tr><td colspan="7" class="empty">No shelters registered yet.</td></tr>';
  }
  body.innerHTML = rows;
}

function renderVolunteers() {
  var body = document.getElementById("volunteersBody");
  var rows = "";
  for (var i = 0; i < db.users.length; i++) {
    var u = db.users[i];
    if (u.role !== "VOLUNTEER") {
      continue;
    }
    rows += "<tr>" +
      "<td>" + esc(u.fullName) + "</td>" +
      "<td>" + esc(u.username) + "</td>" +
      "<td>" + esc(u.skills) + "</td>" +
      "<td>" + esc(u.phone) + "</td>" +
      "<td>" + statusBadge(u.availability) + "</td></tr>";
  }
  if (rows === "") {
    rows = '<tr><td colspan="5" class="empty">No volunteers registered yet.</td></tr>';
  }
  body.innerHTML = rows;
}

function renderResources() {
  var body = document.getElementById("resourcesBody");
  var rows = "";
  for (var i = 0; i < db.resources.length; i++) {
    var r = db.resources[i];
    rows += "<tr>" +
      "<td>" + r.id + "</td>" +
      "<td>" + esc(r.name) + "</td>" +
      "<td><b>" + r.quantity + "</b> " + esc(r.unit) + "</td>" +
      "<td>" + esc(r.location) + "</td></tr>";
  }
  if (db.resources.length === 0) {
    rows = '<tr><td colspan="4" class="empty">No resources recorded yet.</td></tr>';
  }
  body.innerHTML = rows;
}

function renderRequests() {
  var body = document.getElementById("requestsBody");
  var rows = "";
  for (var i = 0; i < db.requests.length; i++) {
    var r = db.requests[i];
    var volunteer = r.volunteer === "" ? "-" : esc(r.volunteer);
    var actions = '<span class="muted">—</span>';
    if (isStaff() && r.status === "Pending") {
      actions = '<button class="btn btn-success btn-sm" onclick="approveRequest(' + r.id + ')">Approve</button> ' +
        '<button class="btn btn-danger btn-sm" onclick="rejectRequest(' + r.id + ')">Reject</button>';
    } else if (isVolunteer() && r.status === "Pending" && r.volunteer === "") {
      actions = '<button class="btn btn-primary btn-sm" onclick="claimRequest(' + r.id + ')">Claim</button>';
    }
    rows += "<tr>" +
      "<td>" + r.id + "</td>" +
      "<td>" + esc(r.citizenName) + "</td>" +
      "<td>" + esc(r.location) + "</td>" +
      "<td>" + esc(r.needType) + "</td>" +
      "<td>" + r.quantity + "</td>" +
      "<td>" + statusBadge(r.status) + "</td>" +
      "<td>" + esc(r.date) + "</td>" +
      "<td>" + volunteer + "</td>" +
      "<td class='action-cell'>" + actions + "</td></tr>";
  }
  if (db.requests.length === 0) {
    rows = '<tr><td colspan="9" class="empty">No relief requests yet.</td></tr>';
  }
  body.innerHTML = rows;
}

function renderMissing() {
  var body = document.getElementById("missingBody");
  var rows = "";
  for (var i = 0; i < db.missing.length; i++) {
    var m = db.missing[i];
    var actions = '<span class="muted">—</span>';
    if (isStaff() && m.status === "Missing") {
      actions = '<button class="btn btn-success btn-sm" onclick="markFound(' + m.id + ')">Mark Found</button>';
    }
    rows += "<tr>" +
      "<td>" + m.id + "</td>" +
      "<td>" + esc(m.name) + "</td>" +
      "<td>" + m.age + "</td>" +
      "<td>" + esc(m.lastSeen) + "</td>" +
      "<td>" + statusBadge(m.status) + "</td>" +
      "<td>" + esc(m.contact) + "</td>" +
      "<td>" + esc(m.date) + "</td>" +
      "<td class='action-cell'>" + actions + "</td></tr>";
  }
  if (db.missing.length === 0) {
    rows = '<tr><td colspan="8" class="empty">No missing person reports yet.</td></tr>';
  }
  body.innerHTML = rows;
}

function renderDonations() {
  var body = document.getElementById("donationsBody");
  var rows = "";
  var totalMoney = 0;
  for (var i = 0; i < db.donations.length; i++) {
    var d = db.donations[i];
    totalMoney = totalMoney + d.amount;
    rows += "<tr>" +
      "<td>" + d.id + "</td>" +
      "<td>" + esc(d.donorName) + "</td>" +
      "<td>" + statusBadge(d.type === "Money" ? "Money" : "Supplies") + "</td>" +
      "<td>" + esc(d.itemName) + "</td>" +
      "<td>" + (d.amount > 0 ? "Rs. " + d.amount.toLocaleString() : "—") + "</td>" +
      "<td>" + esc(d.date) + "</td></tr>";
  }
  if (db.donations.length === 0) {
    rows = '<tr><td colspan="6" class="empty">No donations received yet.</td></tr>';
  } else {
    rows += '<tr class="total-row"><td colspan="4"><b>Total money donated</b></td><td colspan="2"><b>Rs. ' +
      totalMoney.toLocaleString() + "</b></td></tr>";
  }
  body.innerHTML = rows;

  var donateAs = document.getElementById("donateAs");
  if (currentUser) {
    donateAs.textContent = "Donating as: " + currentUser.fullName;
  }
}

// ================= FORM ACTIONS =================

function reportDisaster() {
  db.disasters.push({
    id: nextId(db.disasters),
    type: document.getElementById("disType").value,
    location: document.getElementById("disLocation").value.trim(),
    severity: document.getElementById("disSeverity").value,
    date: today(),
    description: document.getElementById("disDescription").value.trim(),
    status: "Reported",
    reportedBy: currentUser.fullName
  });
  saveDB();
  document.getElementById("formReportDisaster").reset();
  renderAll();
  showMsg("Disaster report submitted. Thank you!");
}

function addShelter() {
  var capacity = parseInt(document.getElementById("shCapacity").value, 10);
  var occupied = parseInt(document.getElementById("shOccupied").value, 10);
  if (isNaN(occupied) || occupied < 0) {
    occupied = 0;
  }
  if (occupied > capacity) {
    occupied = capacity;
  }
  db.shelters.push({
    id: nextId(db.shelters),
    name: document.getElementById("shName").value.trim(),
    location: document.getElementById("shLocation").value.trim(),
    capacity: capacity,
    occupied: occupied,
    contact: document.getElementById("shContact").value.trim()
  });
  saveDB();
  document.getElementById("formAddShelter").reset();
  renderAll();
  showMsg("Shelter added.");
}

function addResource() {
  db.resources.push({
    id: nextId(db.resources),
    name: document.getElementById("rsName").value.trim(),
    quantity: parseInt(document.getElementById("rsQuantity").value, 10),
    unit: document.getElementById("rsUnit").value.trim(),
    location: document.getElementById("rsLocation").value.trim()
  });
  saveDB();
  document.getElementById("formAddResource").reset();
  renderAll();
  showMsg("Resource added to inventory.");
}

function requestRelief() {
  db.requests.push({
    id: nextId(db.requests),
    citizenName: currentUser.fullName,
    contact: document.getElementById("rqContact").value.trim(),
    location: document.getElementById("rqLocation").value.trim(),
    needType: document.getElementById("rqNeed").value,
    quantity: parseInt(document.getElementById("rqQuantity").value, 10),
    status: "Pending",
    date: today(),
    volunteer: ""
  });
  saveDB();
  document.getElementById("formRequestRelief").reset();
  renderAll();
  showMsg("Relief request submitted. Status: Pending.");
}

function reportMissing() {
  db.missing.push({
    id: nextId(db.missing),
    name: document.getElementById("mpName").value.trim(),
    age: parseInt(document.getElementById("mpAge").value, 10),
    lastSeen: document.getElementById("mpLastSeen").value.trim(),
    reportedBy: currentUser.fullName,
    contact: document.getElementById("mpContact").value.trim(),
    status: "Missing",
    date: today()
  });
  saveDB();
  document.getElementById("formReportMissing").reset();
  renderAll();
  showMsg("Missing person report filed.");
}

function donate() {
  var type = document.getElementById("dnType").value;
  var itemName = "-";
  var amount = 0;
  if (type === "Money") {
    amount = parseInt(document.getElementById("dnAmount").value, 10);
  } else {
    itemName = document.getElementById("dnItem").value.trim();
  }
  db.donations.push({
    id: nextId(db.donations),
    donorName: currentUser.fullName,
    type: type,
    itemName: itemName,
    amount: amount,
    date: today()
  });
  saveDB();
  document.getElementById("formDonate").reset();
  toggleDonateFields();
  renderAll();
  showMsg("Thank you for your donation!");
}

// ================= STAFF / VOLUNTEER ACTIONS =================

function updateDisasterStatus(id, newStatus) {
  for (var i = 0; i < db.disasters.length; i++) {
    if (db.disasters[i].id === id) {
      db.disasters[i].status = newStatus;
    }
  }
  saveDB();
  renderAll();
  showMsg("Disaster #" + id + " status updated to " + newStatus + ".");
}

function approveRequest(id) {
  setStatusOfRequest(id, "Approved");
}

function rejectRequest(id) {
  setStatusOfRequest(id, "Rejected");
}

function setStatusOfRequest(id, status) {
  for (var i = 0; i < db.requests.length; i++) {
    if (db.requests[i].id === id) {
      db.requests[i].status = status;
    }
  }
  saveDB();
  renderAll();
  showMsg("Request #" + id + " " + status.toLowerCase() + ".");
}

function claimRequest(id) {
  for (var i = 0; i < db.requests.length; i++) {
    if (db.requests[i].id === id) {
      db.requests[i].volunteer = currentUser.fullName;
    }
  }
  saveDB();
  renderAll();
  showMsg("You claimed request #" + id + ". Thank you!");
}

function markFound(id) {
  for (var i = 0; i < db.missing.length; i++) {
    if (db.missing[i].id === id) {
      db.missing[i].status = "Found";
    }
  }
  saveDB();
  renderAll();
  showMsg("Good news! Person #" + id + " marked as found.");
}

// ================= SMALL MESSAGE TOAST =================

var toastTimer = null;
function showMsg(text) {
  var toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  if (toastTimer !== null) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// ================= START THE APP =================

loadDB();
toggleRegFields();
toggleDonateFields();
updateAuthUI();
renderAll();
showSection("home");
