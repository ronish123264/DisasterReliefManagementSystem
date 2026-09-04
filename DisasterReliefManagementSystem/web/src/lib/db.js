// Data layer: everything is persisted in localStorage under the same
// keys the vanilla site used, so existing data carries over.

const DB_KEY = "drms_db";
const SESSION_KEY = "drms_session";

function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function defaultData() {
  const t = today();
  return {
    users: [
      { id: 1, role: "ADMIN", username: "admin", password: "admin123", fullName: "System Admin", phone: "9800000001", district: "", skills: "", availability: "Available", address: "" },
      { id: 2, role: "MUNICIPALITY", username: "municipality", password: "muni123", fullName: "Kathmandu Municipality", phone: "9800000002", district: "Kathmandu", skills: "", availability: "Available", address: "" },
      { id: 3, role: "VOLUNTEER", username: "ramvol", password: "ram123", fullName: "Ram Bahadur", phone: "9800000003", district: "", skills: "First aid, rescue driving", availability: "Available", address: "" },
      { id: 4, role: "CITIZEN", username: "sita", password: "sita123", fullName: "Sita Sharma", phone: "9800000004", district: "", skills: "", availability: "Available", address: "Bhaktapur" },
    ],
    disasters: [
      { id: 1, type: "Flood", location: "Saptari", severity: "High", date: t, description: "Koshi river overflowed into nearby villages.", status: "Ongoing", reportedBy: "Sita Sharma" },
      { id: 2, type: "Earthquake", location: "Kathmandu", severity: "Medium", date: t, description: "Minor tremor, some old houses damaged in the old bazaar.", status: "Resolved", reportedBy: "Kathmandu Municipality" },
    ],
    shelters: [
      { id: 1, name: "Bhaktapur College Shelter", location: "Bhaktapur", capacity: 200, occupied: 85, contact: "9801000001" },
      { id: 2, name: "Saptari Community Hall", location: "Saptari", capacity: 150, occupied: 150, contact: "9801000002" },
      { id: 3, name: "Kathmandu Public School", location: "Kathmandu", capacity: 300, occupied: 40, contact: "9801000003" },
    ],
    resources: [
      { id: 1, name: "Rice bags", quantity: 120, unit: "bags", location: "Central warehouse, Kathmandu" },
      { id: 2, name: "Drinking water", quantity: 300, unit: "bottles", location: "Central warehouse, Kathmandu" },
      { id: 3, name: "First aid kits", quantity: 45, unit: "kits", location: "Bir Hospital store" },
      { id: 4, name: "Blankets", quantity: 80, unit: "pieces", location: "Central warehouse, Kathmandu" },
    ],
    requests: [
      { id: 1, citizenName: "Ram Bahadur", contact: "9800000003", location: "Saptari", needType: "Drinking Water", quantity: 20, status: "Pending", date: t, volunteer: "" },
      { id: 2, citizenName: "Sita Sharma", contact: "9800000004", location: "Bhaktapur", needType: "Food", quantity: 10, status: "Approved", date: t, volunteer: "Ram Bahadur" },
    ],
    missing: [
      { id: 1, name: "Hari Karki", age: 34, lastSeen: "Saptari weekly market", reportedBy: "Gita Karki", contact: "9800000005", status: "Missing", date: t },
    ],
    donations: [
      { id: 1, donorName: "Nabil Bank", type: "Money", itemName: "-", amount: 250000, date: t },
      { id: 2, donorName: "Sita Sharma", type: "Supplies", itemName: "20 blankets", amount: 0, date: t },
    ],
  };
}

export function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through and reseed if storage was corrupted
    }
  }
  const seeded = defaultData();
  localStorage.setItem(DB_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function loadSession(users) {
  const name = localStorage.getItem(SESSION_KEY);
  if (!name) return null;
  return users.find((u) => u.username.toLowerCase() === name.toLowerCase()) || null;
}

export function storeSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, user.username);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function nextId(list) {
  return list.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;
}

export { today };
