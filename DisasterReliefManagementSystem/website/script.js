// ============================================================
// DRMS website logic.
// Beginner-level JavaScript: plain functions, one global db
// object, everything persisted with localStorage.
// ============================================================

var DB_KEY = "drms_db";           // all records
var SESSION_KEY = "drms_session"; // logged-in username

var db = {};
var currentUser = null;

// ---------- sample data, used only on the very first visit ----------

function defaultData() {
  var t = today();
  return {
    users: [
      { id: 1, role: "ADMIN", username: "admin", password: "admin123", fullName: "System Admin", phone: "9800000001", district: "", skills: "", availability: "Available", address: "" },
      { id: 2, role: "MUNICIPALITY", username: "municipality", password: "muni123", fullName: "Kathmandu Municipality", phone: "9800000002", district: "Kathmandu", skills: "", availability: "Available", address: "" },
      { id: 3, role: "VOLUNTEER", username: "ramvol", password: "ram123", fullName: "Ram Bahadur", phone: "9800000003", district: "", skills: "First aid, rescue driving", availability: "Available", address: "" },
      { id: 4, role: "CITIZEN", username: "sita", password: "sita123", fullName: "Sita Sharma", phone: "9800000004", district: "", skills: "", availability: "Available", address: "Bhaktapur" }
    ],
    disasters: [
      { id: 1, type: "Flood", location: "Saptari", severity: "High", date: t, description: "Koshi river overflowed into nearby villages.", status: "Ongoing", reportedBy: "Sita Sharma" },
      { id: 2, type: "Earthquake", location: "Kathmandu", severity: "Medium", date: t, description: "Minor tremor, some old houses damaged in the old bazaar.", status: "Resolved", reportedBy: "Kathmandu Municipality" }
    ],
    shelters: [
      { id: 1, name: "Bhaktapur College Shelter", location: "Bhaktapur", capacity: 200, occupied: 85, contact: "9801000001" },
      { id: 2, name: "Saptari Community Hall", location: "Saptari", capacity: 150, occupied: 150, contact: "9801000002" },
      { id: 3, name: "Kathmandu Public School", location: "Kathmandu", capacity: 300, occupied: 40, contact: "9801000003" }
    ],
    resources: [
      { id: 1, name: "Rice bags", quantity: 120, unit: "bags", location: "Central warehouse, Kathmandu" },
      { id: 2, name: "Drinking water", quantity: 300, unit: "bottles", location: "Central warehouse, Kathmandu" },
      { id: 3, name: "First aid kits", quantity: 45, unit: "kits", location: "Bir Hospital store" },
      { id: 4, name: "Blankets", quantity: 80, unit: "pieces", location: "Central warehouse, Kathmandu" }
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

// ---------- storage ----------

function loadDB() {
  var raw = localStorage.getItem(DB_KEY);
  if (raw) {
    db = JSON.parse(raw);
  } else {
    db = defaultData();
    saveDB();
  }
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

// keep typed text from breaking the tables
function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// status tag: color carries the state, the word carries the meaning
function tag(status) {
  var cls = status.toLowerCase().replace(" ", "-");
  return '<span class="tag tag-' + cls + '">' + esc(status) + "</span>";
}

function idCell(id) {
  return '<td class="col-id"><span class="rec-id">' + id + "</span></td>";
}

// ---------- role helpers ----------

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

// ---------- navigation ----------

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

// ---------- login / register ----------

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
  showMsg("Logged in as " + user.fullName);
  showSection("home");
}

function logout() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  updateAuthUI();
  renderAll();
  showMsg("Logged out");
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
    msg.textContent = "Fill in every required field.";
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
  showMsg("Account created. Welcome, " + fullName);
  showSection("home");
}

// skills box only for volunteers, address box only for citizens
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

// amount box for money, item box for supplies
function toggleDonateFields() {
  var type = document.getElementById("dnType").value;
  var amount = document.getElementById("dnAmountField");
  var item = document.getElementById("dnItemField");
  var amountInput = document.getElementById("dnAmount");
  var itemInput = document.getElementById("dnItem");
  if (type === "Money") {
    amount.classList.remove("hidden");
    item.classList.add("hidden");
    amountInput.required = true;
    itemInput.required = false;
  } else {
    amount.classList.add("hidden");
    item.classList.remove("hidden");
    amountInput.required = false;
    itemInput.required = true;
  }
}

// ---------- role-based visibility of forms and actions ----------

function updateAuthUI() {
  var navUser = document.getElementById("navUser");
  if (currentUser) {
    navUser.innerHTML =
      '<span class="user-chip"><b>' + esc(currentUser.fullName) + "</b> (" + currentUser.role + ")</span>" +
      '<button class="btn btn-line btn-sm" onclick="logout()">Log out</button>';
  } else {
    navUser.innerHTML = '<button class="btn btn-solid btn-sm" onclick="showSection(\'login\')">Log in</button>';
  }

  var guestText = "Log in to use this form. Demo citizen account: sita / sita123.";
  var staffText = "This form is for Admin and Municipality accounts.";
  var citizenText = "This form is for Citizen accounts. Demo citizen: sita / sita123.";

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

  if (currentUser) {
    document.getElementById("loginPanel").classList.add("hidden");
    document.getElementById("loggedInPanel").classList.remove("hidden");
    document.getElementById("loggedInAs").textContent =
      "Logged in as " + currentUser.fullName + " (" + currentUser.role + ").";
  } else {
    document.getElementById("loginPanel").classList.remove("hidden");
    document.getElementById("loggedInPanel").classList.add("hidden");
  }

  var actionHead = document.getElementById("disasterActionHead");
  if (isStaff()) {
    actionHead.classList.remove("hidden");
  } else {
    actionHead.classList.add("hidden");
  }
}

// ---------- rendering ----------

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
  var colCount = isStaff() ? 8 : 7;
  for (var i = 0; i < db.disasters.length; i++) {
    var d = db.disasters[i];
    var actionCell = "";
    if (isStaff()) {
      actionCell = '<td class="action-cell"><select class="mini-select" onchange="updateDisasterStatus(' + d.id + ', this.value)">' +
        statusOption("Reported", d.status) + statusOption("Ongoing", d.status) +
        statusOption("Resolved", d.status) + "</select></td>";
    }
    rows += "<tr>" + idCell(d.id) +
      "<td>" + esc(d.type) + "</td>" +
      "<td>" + esc(d.location) + "</td>" +
      "<td>" + tag(d.severity) + "</td>" +
      '<td class="mono">' + esc(d.date) + "</td>" +
      "<td>" + tag(d.status) + "</td>" +
      "<td>" + esc(d.reportedBy) + "</td>" +
      actionCell + "</tr>";
    rows += '<tr class="desc-row"><td colspan="' + colCount + '" class="desc">' + esc(d.description) + "</td></tr>";
  }
  if (db.disasters.length === 0) {
    rows = '<tr><td colspan="' + colCount + '" class="empty-cell">No disasters on record.</td></tr>';
  }
  body.innerHTML = rows;
  setText("disastersCount", db.disasters.length + " events");
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = text;
  }
}

function statusOption(value, current) {
  var selected = (value === current) ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + value + "</option>";
}

function renderShelters() {
  var body = document.getElementById("sheltersBody");
  var rows = "";
  var totalFree = 0;
  var fullCount = 0;
  for (var i = 0; i < db.shelters.length; i++) {
    var s = db.shelters[i];
    var free = s.capacity - s.occupied;
    totalFree = totalFree + free;
    if (free === 0) {
      fullCount++;
    }
    rows += "<tr>" + idCell(s.id) +
      "<td>" + esc(s.name) + "</td>" +
      "<td>" + esc(s.location) + "</td>" +
      '<td class="num mono">' + s.capacity + "</td>" +
      '<td class="num mono">' + s.occupied + "</td>" +
      '<td class="num mono">' + (free === 0 ? "full" : free) + "</td>" +
      '<td class="mono">' + esc(s.contact) + "</td></tr>";
  }
  if (db.shelters.length === 0) {
    rows = '<tr><td colspan="7" class="empty-cell">No shelters registered.</td></tr>';
  }
  body.innerHTML = rows;
  setText("sheltersMeta", db.shelters.length + " shelters · " + totalFree +
    " places free" + (fullCount > 0 ? ", " + fullCount + " at capacity" : ""));
}

function renderVolunteers() {
  var body = document.getElementById("volunteersBody");
  var rows = "";
  var available = 0;
  var total = 0;
  for (var i = 0; i < db.users.length; i++) {
    var u = db.users[i];
    if (u.role !== "VOLUNTEER") {
      continue;
    }
    total++;
    if (u.availability === "Available") {
      available++;
    }
    rows += "<tr>" +
      "<td>" + esc(u.fullName) + "</td>" +
      '<td class="mono">' + esc(u.username) + "</td>" +
      "<td>" + esc(u.skills) + "</td>" +
      '<td class="mono">' + esc(u.phone) + "</td>" +
      "<td>" + tag(u.availability) + "</td></tr>";
  }
  if (rows === "") {
    rows = '<tr><td colspan="5" class="empty-cell">No volunteers registered yet.</td></tr>';
  }
  body.innerHTML = rows;
  setText("volunteersMeta", total + " registered · " + available + " available");
}

function renderResources() {
  var body = document.getElementById("resourcesBody");
  var rows = "";
  for (var i = 0; i < db.resources.length; i++) {
    var r = db.resources[i];
    rows += "<tr>" + idCell(r.id) +
      "<td>" + esc(r.name) + "</td>" +
      '<td class="num mono">' + r.quantity + " " + esc(r.unit) + "</td>" +
      "<td>" + esc(r.location) + "</td></tr>";
  }
  if (db.resources.length === 0) {
    rows = '<tr><td colspan="4" class="empty-cell">No resources recorded.</td></tr>';
  }
  body.innerHTML = rows;
  setText("resourcesMeta", db.resources.length + " line items");
}

function renderRequests() {
  var body = document.getElementById("requestsBody");
  var rows = "";
  var pending = 0;
  var approved = 0;
  for (var i = 0; i < db.requests.length; i++) {
    var r = db.requests[i];
    if (r.status === "Pending") {
      pending++;
    } else if (r.status === "Approved") {
      approved++;
    }
    var volunteer = r.volunteer === "" ? "-" : esc(r.volunteer);
    var actions = '<span class="no-action">-</span>';
    if (isStaff() && r.status === "Pending") {
      actions = '<button class="btn btn-ink btn-sm" onclick="approveRequest(' + r.id + ')">Approve</button>' +
        '<button class="btn btn-line btn-sm" onclick="rejectRequest(' + r.id + ')">Reject</button>';
    } else if (isVolunteer() && r.status === "Pending" && r.volunteer === "") {
      actions = '<button class="btn btn-solid btn-sm" onclick="claimRequest(' + r.id + ')">Claim</button>';
    }
    rows += "<tr>" + idCell(r.id) +
      "<td>" + esc(r.citizenName) + "</td>" +
      "<td>" + esc(r.location) + "</td>" +
      "<td>" + esc(r.needType) + "</td>" +
      '<td class="num mono">' + r.quantity + "</td>" +
      "<td>" + tag(r.status) + "</td>" +
      '<td class="mono">' + esc(r.date) + "</td>" +
      "<td>" + volunteer + "</td>" +
      '<td class="action-cell">' + actions + "</td></tr>";
  }
  if (db.requests.length === 0) {
    rows = '<tr><td colspan="9" class="empty-cell">No relief requests yet.</td></tr>';
  }
  body.innerHTML = rows;
  setText("requestsMeta", db.requests.length + " total · " + pending +
    " pending · " + approved + " approved");
}

function renderMissing() {
  var body = document.getElementById("missingBody");
  var rows = "";
  var stillMissing = 0;
  for (var i = 0; i < db.missing.length; i++) {
    var m = db.missing[i];
    if (m.status === "Missing") {
      stillMissing++;
    }
    var actions = '<span class="no-action">-</span>';
    if (isStaff() && m.status === "Missing") {
      actions = '<button class="btn btn-ink btn-sm" onclick="markFound(' + m.id + ')">Mark found</button>';
    }
    rows += "<tr>" + idCell(m.id) +
      "<td>" + esc(m.name) + "</td>" +
      '<td class="num mono">' + m.age + "</td>" +
      "<td>" + esc(m.lastSeen) + "</td>" +
      "<td>" + tag(m.status) + "</td>" +
      '<td class="mono">' + esc(m.contact) + "</td>" +
      '<td class="mono">' + esc(m.date) + "</td>" +
      '<td class="action-cell">' + actions + "</td></tr>";
  }
  if (db.missing.length === 0) {
    rows = '<tr><td colspan="8" class="empty-cell">No missing person reports.</td></tr>';
  }
  body.innerHTML = rows;
  setText("missingMeta", db.missing.length + " reports · " + stillMissing + " still missing");
}

function renderDonations() {
  var body = document.getElementById("donationsBody");
  var rows = "";
  var totalMoney = 0;
  for (var i = 0; i < db.donations.length; i++) {
    var d = db.donations[i];
    totalMoney = totalMoney + d.amount;
    rows += "<tr>" + idCell(d.id) +
      "<td>" + esc(d.donorName) + "</td>" +
      "<td>" + tag(d.type) + "</td>" +
      "<td>" + esc(d.itemName) + "</td>" +
      '<td class="num mono">' + (d.amount > 0 ? "Rs. " + d.amount.toLocaleString() : "-") + "</td>" +
      '<td class="mono">' + esc(d.date) + "</td></tr>";
  }
  if (db.donations.length === 0) {
    rows = '<tr><td colspan="6" class="empty-cell">No donations received.</td></tr>';
  }
  body.innerHTML = rows;
  setText("donationsMeta", db.donations.length + " records · Rs. " + totalMoney.toLocaleString() + " in money");

  var donateAs = document.getElementById("donateAs");
  if (currentUser) {
    donateAs.textContent = "Donating as " + currentUser.fullName;
  } else {
    donateAs.textContent = "";
  }
}

// ---------- form actions ----------

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
  showMsg("Disaster report filed");
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
  showMsg("Shelter added");
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
  showMsg("Resource added to inventory");
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
  showMsg("Relief request submitted, status Pending");
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
  showMsg("Missing person report filed");
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
  showMsg("Donation recorded, thank you");
}

// ---------- staff / volunteer actions ----------

function updateDisasterStatus(id, newStatus) {
  for (var i = 0; i < db.disasters.length; i++) {
    if (db.disasters[i].id === id) {
      db.disasters[i].status = newStatus;
    }
  }
  saveDB();
  renderAll();
  showMsg("Disaster " + id + " set to " + newStatus);
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
  showMsg("Request " + id + " " + status.toLowerCase());
}

function claimRequest(id) {
  for (var i = 0; i < db.requests.length; i++) {
    if (db.requests[i].id === id) {
      db.requests[i].volunteer = currentUser.fullName;
    }
  }
  saveDB();
  renderAll();
  showMsg("You claimed request " + id);
}

function markFound(id) {
  for (var i = 0; i < db.missing.length; i++) {
    if (db.missing[i].id === id) {
      db.missing[i].status = "Found";
    }
  }
  saveDB();
  renderAll();
  showMsg("Person " + id + " marked as found");
}

// ---------- toast ----------

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
  }, 2600);
}

// ---------- boot ----------

loadDB();
toggleRegFields();
toggleDonateFields();
updateAuthUI();
renderAll();
showSection("home");
