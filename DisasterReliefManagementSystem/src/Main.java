import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * SMART DISASTER RELIEF MANAGEMENT SYSTEM (Console Application)
 *
 * A beginner-level Java project for Nepal disaster relief:
 *  - Disaster reporting
 *  - Shelter management
 *  - Volunteer registration
 *  - Resource inventory
 *  - Relief request management
 *  - Missing person records
 *  - Donation tracking
 *  - File handling (all data is saved in the "data" folder as text files)
 *
 * Users: Admin, Municipality, Volunteer, Citizen
 */
public class Main {

    static Scanner sc = new Scanner(System.in);

    // All records live in these lists while the program runs.
    // Every change is immediately saved to a text file by FileHandler.
    static ArrayList<User> users = new ArrayList<User>();
    static ArrayList<Disaster> disasters = new ArrayList<Disaster>();
    static ArrayList<Shelter> shelters = new ArrayList<Shelter>();
    static ArrayList<Resource> resources = new ArrayList<Resource>();
    static ArrayList<ReliefRequest> requests = new ArrayList<ReliefRequest>();
    static ArrayList<MissingPerson> missingPersons = new ArrayList<MissingPerson>();
    static ArrayList<Donation> donations = new ArrayList<Donation>();

    public static void main(String[] args) {
        loadData();
        if (users.isEmpty()) {
            seedDefaultData(); // first run: create default accounts and sample data
        }

        System.out.println("====================================================");
        System.out.println("      SMART DISASTER RELIEF MANAGEMENT SYSTEM       ");
        System.out.println("             Nepal Disaster Relief                  ");
        System.out.println("====================================================");
        System.out.println("All data is saved as text files inside 'data/'.");

        boolean running = true;
        while (running) {
            System.out.println();
            System.out.println("---------------- MAIN MENU ----------------");
            System.out.println("1. Login");
            System.out.println("2. Register");
            System.out.println("3. Exit");
            int choice = readInt("Choose an option: ");
            if (choice == 1) {
                login();
            } else if (choice == 2) {
                register();
            } else if (choice == 3) {
                running = false;
            } else {
                System.out.println("Invalid option, please try again.");
            }
        }
        System.out.println("Thank you for using the system. Stay safe!");
    }

    // ==================== DATA LOAD / SAVE ====================

    static void loadData() {
        users = FileHandler.loadUsers();
        disasters = FileHandler.loadDisasters();
        shelters = FileHandler.loadShelters();
        resources = FileHandler.loadResources();
        requests = FileHandler.loadRequests();
        missingPersons = FileHandler.loadMissingPersons();
        donations = FileHandler.loadDonations();
    }

    static void saveAll() {
        FileHandler.saveUsers(users);
        FileHandler.saveDisasters(disasters);
        FileHandler.saveShelters(shelters);
        FileHandler.saveResources(resources);
        FileHandler.saveRequests(requests);
        FileHandler.saveMissingPersons(missingPersons);
        FileHandler.saveDonations(donations);
    }

    // Runs only on the very first start, so the system is not empty for a demo.
    static void seedDefaultData() {
        System.out.println("(First run: creating default accounts and sample data...)");
        users.add(new Admin("admin", "admin123", "System Admin", "9800000001"));
        users.add(new Municipality("municipality", "muni123", "Kathmandu Municipality", "9800000002", "Kathmandu"));
        users.add(new Volunteer("ramvol", "ram123", "Ram Bahadur", "9800000003", "First Aid, Rescue Driving"));
        users.add(new Citizen("sita", "sita123", "Sita Sharma", "9800000004", "Bhaktapur"));

        disasters.add(new Disaster(1, "Flood", "Saptari", "High", today(),
                "Koshi river overflowed into nearby villages.", "Ongoing", "Sita Sharma"));

        shelters.add(new Shelter(1, "Bhaktapur College Shelter", "Bhaktapur", 200, 85, "9801000001"));
        shelters.add(new Shelter(2, "Saptari Community Hall", "Saptari", 150, 150, "9801000002"));

        resources.add(new Resource(1, "Rice Bags", 120, "bags", "Central Warehouse, Kathmandu"));
        resources.add(new Resource(2, "Drinking Water", 300, "bottles", "Central Warehouse, Kathmandu"));
        resources.add(new Resource(3, "First Aid Kits", 45, "kits", "Bir Hospital Store"));
        resources.add(new Resource(4, "Blankets", 80, "pieces", "Central Warehouse, Kathmandu"));

        requests.add(new ReliefRequest(1, "Ram Bahadur", "9800000003", "Saptari", "Drinking Water",
                20, "Pending", today(), ""));

        missingPersons.add(new MissingPerson(1, "Hari Karki", 34, "Saptari weekly market",
                "Gita Karki", "9800000005", "Missing", today()));

        donations.add(new Donation(1, "Nabil Bank", "Money", "-", 250000, today()));
        donations.add(new Donation(2, "Sita Sharma", "Supplies", "20 blankets", 0, today()));

        saveAll();
    }

    // ==================== LOGIN / REGISTER ====================

    static void login() {
        System.out.println();
        System.out.println("---------------- LOGIN ----------------");
        String username = readLine("Username: ");
        String password = readLine("Password: ");

        User found = null;
        for (User u : users) {
            if (u.getUsername().equalsIgnoreCase(username) && u.getPassword().equals(password)) {
                found = u;
            }
        }

        if (found == null) {
            System.out.println("Wrong username or password.");
            return;
        }

        System.out.println("Welcome, " + found.getFullName() + "! You are logged in as " + found.getRole() + ".");

        if (found.getRole().equals("ADMIN")) {
            adminMenu(found);
        } else if (found.getRole().equals("MUNICIPALITY")) {
            municipalityMenu(found);
        } else if (found.getRole().equals("VOLUNTEER")) {
            volunteerMenu((Volunteer) found);
        } else {
            citizenMenu(found);
        }
    }

    static void register() {
        System.out.println();
        System.out.println("-------------- REGISTER NEW ACCOUNT --------------");
        System.out.println("1. Register as Citizen");
        System.out.println("2. Register as Volunteer");
        System.out.println("0. Cancel");
        int choice = readInt("Choose an option: ");

        if (choice == 1) {
            String username = readUniqueUsername();
            String password = readLine("Password: ");
            String fullName = readLine("Full name: ");
            String phone = readLine("Phone number: ");
            String address = readLine("Address: ");
            users.add(new Citizen(username, password, fullName, phone, address));
            FileHandler.saveUsers(users);
            System.out.println("[Saved to data/users.txt]");
            System.out.println("Citizen account created for " + fullName + ". You can login now.");
        } else if (choice == 2) {
            String username = readUniqueUsername();
            String password = readLine("Password: ");
            String fullName = readLine("Full name: ");
            String phone = readLine("Phone number: ");
            String skills = readLine("Your skills (example: First Aid, Driving): ");
            users.add(new Volunteer(username, password, fullName, phone, skills));
            FileHandler.saveUsers(users);
            System.out.println("[Saved to data/users.txt]");
            System.out.println("Volunteer account created for " + fullName + ". You can login now.");
        } else {
            System.out.println("Registration cancelled.");
        }
    }

    // ==================== ADMIN MENU ====================

    static void adminMenu(User admin) {
        boolean loggedIn = true;
        while (loggedIn) {
            System.out.println();
            System.out.println("--------------- ADMIN MENU ---------------");
            System.out.println("1. View Disasters");
            System.out.println("2. Update Disaster Status");
            System.out.println("3. View Shelters");
            System.out.println("4. Add Shelter");
            System.out.println("5. View Resources");
            System.out.println("6. Add Resource");
            System.out.println("7. View Relief Requests");
            System.out.println("8. Approve / Reject Relief Request");
            System.out.println("9. View Missing Persons");
            System.out.println("10. Mark Missing Person as Found");
            System.out.println("11. View Volunteers");
            System.out.println("12. View Donations");
            System.out.println("13. Create Municipality Account");
            System.out.println("14. Summary Report");
            System.out.println("0. Logout");
            int choice = readInt("Choose an option: ");

            if (choice == 1) {
                viewDisasters();
            } else if (choice == 2) {
                updateDisasterStatus();
            } else if (choice == 3) {
                viewShelters();
            } else if (choice == 4) {
                addShelter();
            } else if (choice == 5) {
                viewResources();
            } else if (choice == 6) {
                addResource();
            } else if (choice == 7) {
                viewRequests();
            } else if (choice == 8) {
                approveRejectRequest();
            } else if (choice == 9) {
                viewMissingPersons();
            } else if (choice == 10) {
                markPersonFound();
            } else if (choice == 11) {
                viewVolunteers();
            } else if (choice == 12) {
                viewDonations();
            } else if (choice == 13) {
                createMunicipalityAccount();
            } else if (choice == 14) {
                summaryReport();
            } else if (choice == 0) {
                loggedIn = false;
                System.out.println("Logged out.");
            } else {
                System.out.println("Invalid option, please try again.");
            }
        }
    }

    // ==================== MUNICIPALITY MENU ====================

    static void municipalityMenu(User muni) {
        boolean loggedIn = true;
        while (loggedIn) {
            System.out.println();
            System.out.println("------------ MUNICIPALITY MENU ------------");
            System.out.println("1. View Disasters");
            System.out.println("2. Update Disaster Status");
            System.out.println("3. View Shelters");
            System.out.println("4. Add Shelter");
            System.out.println("5. View Resources");
            System.out.println("6. Add Resource");
            System.out.println("7. View Relief Requests");
            System.out.println("8. Approve / Reject Relief Request");
            System.out.println("9. View Missing Persons");
            System.out.println("10. Mark Missing Person as Found");
            System.out.println("11. Summary Report");
            System.out.println("0. Logout");
            int choice = readInt("Choose an option: ");

            if (choice == 1) {
                viewDisasters();
            } else if (choice == 2) {
                updateDisasterStatus();
            } else if (choice == 3) {
                viewShelters();
            } else if (choice == 4) {
                addShelter();
            } else if (choice == 5) {
                viewResources();
            } else if (choice == 6) {
                addResource();
            } else if (choice == 7) {
                viewRequests();
            } else if (choice == 8) {
                approveRejectRequest();
            } else if (choice == 9) {
                viewMissingPersons();
            } else if (choice == 10) {
                markPersonFound();
            } else if (choice == 11) {
                summaryReport();
            } else if (choice == 0) {
                loggedIn = false;
                System.out.println("Logged out.");
            } else {
                System.out.println("Invalid option, please try again.");
            }
        }
    }

    // ==================== VOLUNTEER MENU ====================

    static void volunteerMenu(Volunteer me) {
        boolean loggedIn = true;
        while (loggedIn) {
            System.out.println();
            System.out.println("------------- VOLUNTEER MENU --------------");
            System.out.println("1. View Disasters");
            System.out.println("2. View Shelters");
            System.out.println("3. View Relief Requests");
            System.out.println("4. Claim a Relief Request");
            System.out.println("5. Update My Availability");
            System.out.println("6. View Missing Persons");
            System.out.println("0. Logout");
            int choice = readInt("Choose an option: ");

            if (choice == 1) {
                viewDisasters();
            } else if (choice == 2) {
                viewShelters();
            } else if (choice == 3) {
                viewRequests();
            } else if (choice == 4) {
                claimRequest(me);
            } else if (choice == 5) {
                updateAvailability(me);
            } else if (choice == 6) {
                viewMissingPersons();
            } else if (choice == 0) {
                loggedIn = false;
                System.out.println("Logged out.");
            } else {
                System.out.println("Invalid option, please try again.");
            }
        }
    }

    // ==================== CITIZEN MENU ====================

    static void citizenMenu(User me) {
        boolean loggedIn = true;
        while (loggedIn) {
            System.out.println();
            System.out.println("-------------- CITIZEN MENU ---------------");
            System.out.println("1. Report a Disaster");
            System.out.println("2. View Disasters");
            System.out.println("3. View Shelters");
            System.out.println("4. Request Relief");
            System.out.println("5. View My Relief Requests");
            System.out.println("6. Report a Missing Person");
            System.out.println("7. View Missing Persons");
            System.out.println("8. Make a Donation");
            System.out.println("0. Logout");
            int choice = readInt("Choose an option: ");

            if (choice == 1) {
                reportDisaster(me);
            } else if (choice == 2) {
                viewDisasters();
            } else if (choice == 3) {
                viewShelters();
            } else if (choice == 4) {
                requestRelief(me);
            } else if (choice == 5) {
                viewMyRequests(me);
            } else if (choice == 6) {
                reportMissingPerson(me);
            } else if (choice == 7) {
                viewMissingPersons();
            } else if (choice == 8) {
                makeDonation(me);
            } else if (choice == 0) {
                loggedIn = false;
                System.out.println("Logged out.");
            } else {
                System.out.println("Invalid option, please try again.");
            }
        }
    }

    // ==================== FEATURE: DISASTER REPORTING ====================

    static void reportDisaster(User reporter) {
        System.out.println();
        System.out.println("------------ REPORT A DISASTER ------------");
        System.out.println("Disaster type: 1. Earthquake  2. Flood  3. Landslide  4. Forest Fire  5. Other");
        int typeChoice = readInt("Choose disaster type: ");
        String type;
        if (typeChoice == 1) {
            type = "Earthquake";
        } else if (typeChoice == 2) {
            type = "Flood";
        } else if (typeChoice == 3) {
            type = "Landslide";
        } else if (typeChoice == 4) {
            type = "Forest Fire";
        } else if (typeChoice == 5) {
            type = "Other";
        } else {
            System.out.println("Cancelled (invalid type).");
            return;
        }

        System.out.println("Severity: 1. Low  2. Medium  3. High  4. Critical");
        int sevChoice = readInt("Choose severity: ");
        String severity;
        if (sevChoice == 1) {
            severity = "Low";
        } else if (sevChoice == 2) {
            severity = "Medium";
        } else if (sevChoice == 3) {
            severity = "High";
        } else if (sevChoice == 4) {
            severity = "Critical";
        } else {
            System.out.println("Cancelled (invalid severity).");
            return;
        }

        String location = readLine("Location (village / municipality / district): ");
        String description = readLine("Short description of the situation: ");

        Disaster d = new Disaster(nextDisasterId(), type, location, severity, today(),
                description, "Reported", reporter.getFullName());
        disasters.add(d);
        FileHandler.saveDisasters(disasters);
        System.out.println("[Saved to data/disasters.txt]");
        System.out.println("Disaster reported with ID " + d.getId() + ". Thank you!");
    }

    static void viewDisasters() {
        System.out.println();
        System.out.println("---------------- ALL DISASTERS ----------------");
        if (disasters.isEmpty()) {
            System.out.println("No disasters reported yet.");
            return;
        }
        System.out.printf("%-4s %-12s %-20s %-10s %-12s %-10s %-18s%n",
                "ID", "TYPE", "LOCATION", "SEVERITY", "DATE", "STATUS", "REPORTED BY");
        for (Disaster d : disasters) {
            System.out.printf("%-4d %-12s %-20s %-10s %-12s %-10s %-18s%n",
                    d.getId(), d.getType(), d.getLocation(), d.getSeverity(),
                    d.getDate(), d.getStatus(), d.getReportedBy());
        }
        for (Disaster d : disasters) {
            System.out.println("  #" + d.getId() + ": " + d.getDescription());
        }
    }

    static void updateDisasterStatus() {
        viewDisasters();
        if (disasters.isEmpty()) {
            return;
        }
        int id = readInt("Enter disaster ID to update (0 to cancel): ");
        Disaster d = findDisaster(id);
        if (id == 0) {
            return;
        }
        if (d == null) {
            System.out.println("No disaster found with ID " + id + ".");
            return;
        }
        System.out.println("New status: 1. Reported  2. Ongoing  3. Resolved");
        int statusChoice = readInt("Choose new status: ");
        if (statusChoice == 1) {
            d.setStatus("Reported");
        } else if (statusChoice == 2) {
            d.setStatus("Ongoing");
        } else if (statusChoice == 3) {
            d.setStatus("Resolved");
        } else {
            System.out.println("Cancelled (invalid status).");
            return;
        }
        FileHandler.saveDisasters(disasters);
        System.out.println("[Saved to data/disasters.txt]");
        System.out.println("Disaster #" + d.getId() + " status is now: " + d.getStatus());
    }

    // ==================== FEATURE: SHELTER MANAGEMENT ====================

    static void viewShelters() {
        System.out.println();
        System.out.println("---------------- ALL SHELTERS ----------------");
        if (shelters.isEmpty()) {
            System.out.println("No shelters registered yet.");
            return;
        }
        System.out.printf("%-4s %-28s %-20s %-9s %-9s %-9s %-12s%n",
                "ID", "NAME", "LOCATION", "CAPACITY", "OCCUPIED", "FREE", "CONTACT");
        int totalFree = 0;
        for (Shelter s : shelters) {
            System.out.printf("%-4d %-28s %-20s %-9d %-9d %-9d %-12s%n",
                    s.getId(), s.getName(), s.getLocation(), s.getCapacity(),
                    s.getOccupied(), s.getAvailableSpace(), s.getContact());
            totalFree = totalFree + s.getAvailableSpace();
        }
        System.out.println("Total free shelter space right now: " + totalFree + " people");
    }

    static void addShelter() {
        System.out.println();
        System.out.println("--------------- ADD SHELTER ----------------");
        String name = readLine("Shelter name: ");
        String location = readLine("Location: ");
        int capacity = readInt("Capacity (how many people): ");
        int occupied = readInt("People currently staying there: ");
        if (occupied < 0) {
            occupied = 0;
        }
        if (occupied > capacity) {
            System.out.println("Occupied cannot be bigger than capacity. Setting occupied = capacity.");
            occupied = capacity;
        }
        String contact = readLine("Contact phone: ");

        Shelter s = new Shelter(nextShelterId(), name, location, capacity, occupied, contact);
        shelters.add(s);
        FileHandler.saveShelters(shelters);
        System.out.println("[Saved to data/shelters.txt]");
        System.out.println("Shelter added with ID " + s.getId() + ".");
    }

    // ==================== FEATURE: RESOURCE INVENTORY ====================

    static void viewResources() {
        System.out.println();
        System.out.println("------------ RESOURCE INVENTORY -------------");
        if (resources.isEmpty()) {
            System.out.println("No resources recorded yet.");
            return;
        }
        System.out.printf("%-4s %-22s %-10s %-10s %-32s%n", "ID", "ITEM", "QUANTITY", "UNIT", "STORED AT");
        for (Resource r : resources) {
            System.out.printf("%-4d %-22s %-10d %-10s %-32s%n",
                    r.getId(), r.getName(), r.getQuantity(), r.getUnit(), r.getLocation());
        }
    }

    static void addResource() {
        System.out.println();
        System.out.println("--------------- ADD RESOURCE ----------------");
        String name = readLine("Item name (example: Rice Bags): ");
        int quantity = readInt("Quantity: ");
        String unit = readLine("Unit (bags / bottles / kits...): ");
        String location = readLine("Stored at (warehouse name): ");

        Resource r = new Resource(nextResourceId(), name, quantity, unit, location);
        resources.add(r);
        FileHandler.saveResources(resources);
        System.out.println("[Saved to data/resources.txt]");
        System.out.println("Resource added with ID " + r.getId() + ".");
    }

    // ==================== FEATURE: RELIEF REQUEST MANAGEMENT ====================

    static void viewRequests() {
        System.out.println();
        System.out.println("------------- RELIEF REQUESTS ----------------");
        if (requests.isEmpty()) {
            System.out.println("No relief requests yet.");
            return;
        }
        System.out.printf("%-4s %-18s %-18s %-15s %-8s %-10s %-12s %-18s%n",
                "ID", "CITIZEN", "LOCATION", "NEED", "QTY", "STATUS", "DATE", "VOLUNTEER");
        for (ReliefRequest r : requests) {
            String volunteer = r.getVolunteer();
            if (volunteer.isEmpty()) {
                volunteer = "-";
            }
            System.out.printf("%-4d %-18s %-18s %-15s %-8d %-10s %-12s %-18s%n",
                    r.getId(), r.getCitizenName(), r.getLocation(), r.getNeedType(),
                    r.getQuantity(), r.getStatus(), r.getDate(), volunteer);
        }
    }

    static void requestRelief(User citizen) {
        System.out.println();
        System.out.println("------------- REQUEST RELIEF ----------------");
        System.out.println("What do you need: 1. Food  2. Drinking Water  3. Medicine  4. Clothes  5. Other");
        int needChoice = readInt("Choose need type: ");
        String needType;
        if (needChoice == 1) {
            needType = "Food";
        } else if (needChoice == 2) {
            needType = "Drinking Water";
        } else if (needChoice == 3) {
            needType = "Medicine";
        } else if (needChoice == 4) {
            needType = "Clothes";
        } else if (needChoice == 5) {
            needType = "Other";
        } else {
            System.out.println("Cancelled (invalid need).");
            return;
        }

        int quantity = readInt("How many people / units do you need it for: ");
        String location = readLine("Where should it be delivered: ");
        System.out.print("Contact number (press Enter to use " + citizen.getPhone() + "): ");
        String contact = sc.nextLine().trim().replace("|", "/");
        if (contact.isEmpty()) {
            contact = citizen.getPhone();
        }

        ReliefRequest r = new ReliefRequest(nextRequestId(), citizen.getFullName(), contact,
                location, needType, quantity, "Pending", today(), "");
        requests.add(r);
        FileHandler.saveRequests(requests);
        System.out.println("[Saved to data/requests.txt]");
        System.out.println("Relief request submitted with ID " + r.getId() + ". Status: Pending.");
    }

    static void viewMyRequests(User citizen) {
        System.out.println();
        System.out.println("------------- MY RELIEF REQUESTS -------------");
        boolean any = false;
        for (ReliefRequest r : requests) {
            if (r.getCitizenName().equalsIgnoreCase(citizen.getFullName())) {
                any = true;
                System.out.println("Request #" + r.getId() + " | " + r.getNeedType()
                        + " | quantity: " + r.getQuantity() + " | " + r.getStatus()
                        + " | date: " + r.getDate());
            }
        }
        if (!any) {
            System.out.println("You have not submitted any relief request yet.");
        }
    }

    static void approveRejectRequest() {
        viewRequests();
        if (requests.isEmpty()) {
            return;
        }
        int id = readInt("Enter request ID to process (0 to cancel): ");
        if (id == 0) {
            return;
        }
        ReliefRequest r = findRequest(id);
        if (r == null) {
            System.out.println("No request found with ID " + id + ".");
            return;
        }
        if (!r.getStatus().equals("Pending")) {
            System.out.println("Request #" + id + " is already " + r.getStatus() + ".");
            return;
        }
        System.out.println("1. Approve   2. Reject");
        int decision = readInt("Your decision: ");
        if (decision == 1) {
            r.setStatus("Approved");
            System.out.println("[Saved to data/requests.txt]");
            System.out.println("Request #" + id + " approved.");
        } else if (decision == 2) {
            r.setStatus("Rejected");
            System.out.println("[Saved to data/requests.txt]");
            System.out.println("Request #" + id + " rejected.");
        } else {
            System.out.println("Cancelled.");
            return;
        }
        FileHandler.saveRequests(requests);
    }

    static void claimRequest(Volunteer me) {
        System.out.println();
        System.out.println("------------ CLAIM A RELIEF REQUEST ----------");
        boolean anyPending = false;
        for (ReliefRequest r : requests) {
            if (r.getStatus().equals("Pending")) {
                anyPending = true;
                String volunteer = r.getVolunteer();
                if (volunteer.isEmpty()) {
                    volunteer = "not claimed yet";
                }
                System.out.println("Request #" + r.getId() + " | " + r.getNeedType()
                        + " | " + r.getLocation() + " | by " + r.getCitizenName()
                        + " | volunteer: " + volunteer);
            }
        }
        if (!anyPending) {
            System.out.println("No pending requests right now.");
            return;
        }
        int id = readInt("Enter request ID to claim (0 to cancel): ");
        if (id == 0) {
            return;
        }
        ReliefRequest r = findRequest(id);
        if (r == null || !r.getStatus().equals("Pending")) {
            System.out.println("No pending request with ID " + id + ".");
            return;
        }
        if (!r.getVolunteer().isEmpty()) {
            System.out.println("Sorry, request #" + id + " was already claimed by " + r.getVolunteer() + ".");
            return;
        }
        r.setVolunteer(me.getFullName());
        FileHandler.saveRequests(requests);
        System.out.println("[Saved to data/requests.txt]");
        System.out.println("Thank you " + me.getFullName() + "! You are assigned to request #" + id + ".");
    }

    static void updateAvailability(Volunteer me) {
        System.out.println();
        System.out.println("Your current availability: " + me.getAvailability());
        System.out.println("1. Available   2. Busy");
        int choice = readInt("Set availability to: ");
        if (choice == 1) {
            me.setAvailability("Available");
        } else if (choice == 2) {
            me.setAvailability("Busy");
        } else {
            System.out.println("Cancelled.");
            return;
        }
        FileHandler.saveUsers(users);
        System.out.println("[Saved to data/users.txt]");
        System.out.println("You are now marked as: " + me.getAvailability());
    }

    // ==================== FEATURE: MISSING PERSON RECORDS ====================

    static void viewMissingPersons() {
        System.out.println();
        System.out.println("------------- MISSING PERSONS ----------------");
        if (missingPersons.isEmpty()) {
            System.out.println("No missing person reports yet.");
            return;
        }
        System.out.printf("%-4s %-20s %-5s %-24s %-10s %-12s %-18s%n",
                "ID", "NAME", "AGE", "LAST SEEN AT", "STATUS", "CONTACT", "DATE");
        for (MissingPerson m : missingPersons) {
            System.out.printf("%-4d %-20s %-5d %-24s %-10s %-12s %-18s%n",
                    m.getId(), m.getName(), m.getAge(), m.getLastSeenLocation(),
                    m.getStatus(), m.getContact(), m.getDateReported());
        }
        for (MissingPerson m : missingPersons) {
            System.out.println("  #" + m.getId() + ": reported by " + m.getReportedBy());
        }
    }

    static void reportMissingPerson(User reporter) {
        System.out.println();
        System.out.println("------------ REPORT MISSING PERSON -----------");
        String name = readLine("Missing person's full name: ");
        int age = readInt("Age: ");
        String lastSeen = readLine("Where were they last seen: ");
        String contact = readLine("Your contact number: ");

        MissingPerson m = new MissingPerson(nextMissingId(), name, age, lastSeen,
                reporter.getFullName(), contact, "Missing", today());
        missingPersons.add(m);
        FileHandler.saveMissingPersons(missingPersons);
        System.out.println("[Saved to data/missing.txt]");
        System.out.println("Missing person report filed with ID " + m.getId() + ".");
    }

    static void markPersonFound() {
        viewMissingPersons();
        if (missingPersons.isEmpty()) {
            return;
        }
        int id = readInt("Enter missing person ID to mark as found (0 to cancel): ");
        if (id == 0) {
            return;
        }
        MissingPerson m = findMissingPerson(id);
        if (m == null) {
            System.out.println("No missing person report with ID " + id + ".");
            return;
        }
        if (m.getStatus().equals("Found")) {
            System.out.println(m.getName() + " is already marked as found.");
            return;
        }
        m.setStatus("Found");
        FileHandler.saveMissingPersons(missingPersons);
        System.out.println("[Saved to data/missing.txt]");
        System.out.println("Good news! " + m.getName() + " is now marked as FOUND.");
    }

    // ==================== FEATURE: DONATION TRACKING ====================

    static void viewDonations() {
        System.out.println();
        System.out.println("---------------- DONATIONS ------------------");
        if (donations.isEmpty()) {
            System.out.println("No donations received yet.");
            return;
        }
        System.out.printf("%-4s %-22s %-10s %-24s %-12s %-12s%n",
                "ID", "DONOR", "TYPE", "ITEM", "AMOUNT (Rs.)", "DATE");
        double totalMoney = 0;
        for (Donation d : donations) {
            System.out.printf("%-4d %-22s %-10s %-24s %-12.2f %-12s%n",
                    d.getId(), d.getDonorName(), d.getType(), d.getItemName(),
                    d.getAmount(), d.getDate());
            totalMoney = totalMoney + d.getAmount();
        }
        System.out.printf("Total money donated: Rs. %.2f%n", totalMoney);
    }

    static void makeDonation(User donor) {
        System.out.println();
        System.out.println("-------------- MAKE A DONATION ---------------");
        System.out.println("1. Money   2. Supplies");
        int typeChoice = readInt("Donation type: ");
        String type;
        String itemName = "-";
        double amount = 0;

        if (typeChoice == 1) {
            type = "Money";
            amount = readDouble("Amount in rupees: ");
        } else if (typeChoice == 2) {
            type = "Supplies";
            itemName = readLine("What are you donating (example: 20 blankets): ");
        } else {
            System.out.println("Cancelled (invalid type).");
            return;
        }

        Donation d = new Donation(nextDonationId(), donor.getFullName(), type, itemName, amount, today());
        donations.add(d);
        FileHandler.saveDonations(donations);
        System.out.println("[Saved to data/donations.txt]");
        System.out.println("Thank you for your donation, " + donor.getFullName() + "!");
    }

    // ==================== ADMIN: EXTRA FEATURES ====================

    static void viewVolunteers() {
        System.out.println();
        System.out.println("------------- REGISTERED VOLUNTEERS -----------");
        boolean any = false;
        for (User u : users) {
            if (u instanceof Volunteer) {
                any = true;
                Volunteer v = (Volunteer) u;
                System.out.println(v.displayInfo());
            }
        }
        if (!any) {
            System.out.println("No volunteers registered yet.");
        }
    }

    static void createMunicipalityAccount() {
        System.out.println();
        System.out.println("---------- CREATE MUNICIPALITY ACCOUNT --------");
        String username = readUniqueUsername();
        String password = readLine("Password: ");
        String fullName = readLine("Municipality name: ");
        String phone = readLine("Phone number: ");
        String district = readLine("District: ");

        users.add(new Municipality(username, password, fullName, phone, district));
        FileHandler.saveUsers(users);
        System.out.println("[Saved to data/users.txt]");
        System.out.println("Municipality account created for " + fullName + ".");
    }

    static void summaryReport() {
        System.out.println();
        System.out.println("================ SUMMARY REPORT ================");

        int volunteerCount = 0;
        for (User u : users) {
            if (u instanceof Volunteer) {
                volunteerCount++;
            }
        }
        System.out.println("Registered users        : " + users.size() + " (volunteers: " + volunteerCount + ")");

        int ongoing = 0;
        for (Disaster d : disasters) {
            if (d.getStatus().equals("Ongoing")) {
                ongoing++;
            }
        }
        System.out.println("Disasters reported      : " + disasters.size() + " (ongoing: " + ongoing + ")");

        int totalFree = 0;
        for (Shelter s : shelters) {
            totalFree = totalFree + s.getAvailableSpace();
        }
        System.out.println("Shelters                : " + shelters.size() + " (free space for " + totalFree + " people)");

        System.out.println("Resource items in stock : " + resources.size());

        int pending = 0;
        int approved = 0;
        for (ReliefRequest r : requests) {
            if (r.getStatus().equals("Pending")) {
                pending++;
            } else if (r.getStatus().equals("Approved")) {
                approved++;
            }
        }
        System.out.println("Relief requests         : " + requests.size() + " (pending: " + pending + ", approved: " + approved + ")");

        int stillMissing = 0;
        for (MissingPerson m : missingPersons) {
            if (m.getStatus().equals("Missing")) {
                stillMissing++;
            }
        }
        System.out.println("Missing person reports  : " + missingPersons.size() + " (still missing: " + stillMissing + ")");

        double totalMoney = 0;
        int suppliesCount = 0;
        for (Donation d : donations) {
            totalMoney = totalMoney + d.getAmount();
            if (d.getType().equals("Supplies")) {
                suppliesCount++;
            }
        }
        System.out.printf("Donations               : Rs. %.2f in money, %d supply donations%n", totalMoney, suppliesCount);
        System.out.println("================================================");
    }

    // ==================== SMALL HELPER METHODS ====================

    static String today() {
        return LocalDate.now().toString();
    }

    // Reads a line of text and removes the | character so file lines stay safe.
    static String readLine(String prompt) {
        System.out.print(prompt);
        String line = sc.nextLine().trim().replace("|", "/");
        while (line.isEmpty()) {
            System.out.println("This field cannot be empty.");
            System.out.print(prompt);
            line = sc.nextLine().trim().replace("|", "/");
        }
        return line;
    }

    // Reads a whole number, asking again if the user types something else.
    static int readInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String line = sc.nextLine().trim();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println("Please type a whole number.");
            }
        }
    }

    static double readDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            String line = sc.nextLine().trim();
            try {
                return Double.parseDouble(line);
            } catch (NumberFormatException e) {
                System.out.println("Please type a number (example: 1500 or 1500.50).");
            }
        }
    }

    static String readUniqueUsername() {
        while (true) {
            String username = readLine("Username: ");
            if (findUser(username) == null) {
                return username;
            }
            System.out.println("That username is already taken. Choose another one.");
        }
    }

    static User findUser(String username) {
        for (User u : users) {
            if (u.getUsername().equalsIgnoreCase(username)) {
                return u;
            }
        }
        return null;
    }

    static Disaster findDisaster(int id) {
        for (Disaster d : disasters) {
            if (d.getId() == id) {
                return d;
            }
        }
        return null;
    }

    static ReliefRequest findRequest(int id) {
        for (ReliefRequest r : requests) {
            if (r.getId() == id) {
                return r;
            }
        }
        return null;
    }

    static MissingPerson findMissingPerson(int id) {
        for (MissingPerson m : missingPersons) {
            if (m.getId() == id) {
                return m;
            }
        }
        return null;
    }

    // The next ID is always one bigger than the biggest ID already used.
    static int nextDisasterId() {
        int max = 0;
        for (Disaster d : disasters) {
            if (d.getId() > max) {
                max = d.getId();
            }
        }
        return max + 1;
    }

    static int nextShelterId() {
        int max = 0;
        for (Shelter s : shelters) {
            if (s.getId() > max) {
                max = s.getId();
            }
        }
        return max + 1;
    }

    static int nextResourceId() {
        int max = 0;
        for (Resource r : resources) {
            if (r.getId() > max) {
                max = r.getId();
            }
        }
        return max + 1;
    }

    static int nextRequestId() {
        int max = 0;
        for (ReliefRequest r : requests) {
            if (r.getId() > max) {
                max = r.getId();
            }
        }
        return max + 1;
    }

    static int nextMissingId() {
        int max = 0;
        for (MissingPerson m : missingPersons) {
            if (m.getId() > max) {
                max = m.getId();
            }
        }
        return max + 1;
    }

    static int nextDonationId() {
        int max = 0;
        for (Donation d : donations) {
            if (d.getId() > max) {
                max = d.getId();
            }
        }
        return max + 1;
    }
}
