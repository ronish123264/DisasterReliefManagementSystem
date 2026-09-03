import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 * FILE HANDLING for the whole system.
 * Every record is saved as one line of text inside the "data" folder.
 * Fields of a record are separated by the | character.
 *
 * Example line in disasters.txt:
 * 1|Flood|Saptari|High|2026-09-01|Koshi river overflowed|Ongoing|Sita Sharma
 */
public class FileHandler {

    public static final String DATA_FOLDER = "data";

    // Makes sure the data folder exists before we read or write.
    public static void ensureDataFolder() {
        File folder = new File(DATA_FOLDER);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }

    // ================= GENERAL HELPERS =================

    // Reads a text file and returns every non-empty line.
    // If the file does not exist yet (first run) an empty list is returned.
    public static ArrayList<String> readLines(String fileName) {
        ArrayList<String> lines = new ArrayList<String>();
        ensureDataFolder();
        File file = new File(DATA_FOLDER, fileName);
        if (!file.exists()) {
            return lines;
        }
        try {
            BufferedReader br = new BufferedReader(new FileReader(file));
            String line = br.readLine();
            while (line != null) {
                if (!line.trim().isEmpty()) {
                    lines.add(line);
                }
                line = br.readLine();
            }
            br.close();
        } catch (IOException e) {
            System.out.println("Error reading " + fileName + ": " + e.getMessage());
        }
        return lines;
    }

    // Writes the given lines into the text file (replaces the old content).
    public static void writeLines(String fileName, ArrayList<String> lines) {
        ensureDataFolder();
        try {
            PrintWriter pw = new PrintWriter(new FileWriter(new File(DATA_FOLDER, fileName)));
            for (String line : lines) {
                pw.println(line);
            }
            pw.close();
        } catch (IOException e) {
            System.out.println("Error writing " + fileName + ": " + e.getMessage());
        }
    }

    // ================= USERS =================

    public static void saveUsers(ArrayList<User> users) {
        ArrayList<String> lines = new ArrayList<String>();
        for (User u : users) {
            lines.add(u.toFileString());
        }
        writeLines("users.txt", lines);
    }

    public static ArrayList<User> loadUsers() {
        ArrayList<User> list = new ArrayList<User>();
        for (String line : readLines("users.txt")) {
            String[] p = line.split("\\|", -1); // -1 keeps empty fields at the end of the line
            if (p.length < 5) {
                continue; // skip broken lines
            }
            try {
                String role = p[0];
                if (role.equals("ADMIN")) {
                    list.add(new Admin(p[1], p[2], p[3], p[4]));
                } else if (role.equals("MUNICIPALITY")) {
                    String district = "";
                    if (p.length > 5) {
                        district = p[5];
                    }
                    list.add(new Municipality(p[1], p[2], p[3], p[4], district));
                } else if (role.equals("VOLUNTEER")) {
                    String skills = "";
                    if (p.length > 5) {
                        skills = p[5];
                    }
                    String availability = "Available";
                    if (p.length > 6) {
                        availability = p[6];
                    }
                    list.add(new Volunteer(p[1], p[2], p[3], p[4], skills, availability));
                } else { // CITIZEN
                    String address = "";
                    if (p.length > 5) {
                        address = p[5];
                    }
                    list.add(new Citizen(p[1], p[2], p[3], p[4], address));
                }
            } catch (Exception e) {
                System.out.println("Skipping a broken line in users.txt");
            }
        }
        return list;
    }

    // ================= DISASTERS =================

    public static void saveDisasters(ArrayList<Disaster> disasters) {
        ArrayList<String> lines = new ArrayList<String>();
        for (Disaster d : disasters) {
            lines.add(d.toFileString());
        }
        writeLines("disasters.txt", lines);
    }

    public static ArrayList<Disaster> loadDisasters() {
        ArrayList<Disaster> list = new ArrayList<Disaster>();
        for (String line : readLines("disasters.txt")) {
            String[] p = line.split("\\|", -1);
            if (p.length < 8) {
                continue;
            }
            try {
                list.add(new Disaster(Integer.parseInt(p[0]), p[1], p[2], p[3], p[4], p[5], p[6], p[7]));
            } catch (Exception e) {
                System.out.println("Skipping a broken line in disasters.txt");
            }
        }
        return list;
    }

    // ================= SHELTERS =================

    public static void saveShelters(ArrayList<Shelter> shelters) {
        ArrayList<String> lines = new ArrayList<String>();
        for (Shelter s : shelters) {
            lines.add(s.toFileString());
        }
        writeLines("shelters.txt", lines);
    }

    public static ArrayList<Shelter> loadShelters() {
        ArrayList<Shelter> list = new ArrayList<Shelter>();
        for (String line : readLines("shelters.txt")) {
            String[] p = line.split("\\|", -1);
            if (p.length < 6) {
                continue;
            }
            try {
                list.add(new Shelter(Integer.parseInt(p[0]), p[1], p[2],
                        Integer.parseInt(p[3]), Integer.parseInt(p[4]), p[5]));
            } catch (Exception e) {
                System.out.println("Skipping a broken line in shelters.txt");
            }
        }
        return list;
    }

    // ================= RESOURCES =================

    public static void saveResources(ArrayList<Resource> resources) {
        ArrayList<String> lines = new ArrayList<String>();
        for (Resource r : resources) {
            lines.add(r.toFileString());
        }
        writeLines("resources.txt", lines);
    }

    public static ArrayList<Resource> loadResources() {
        ArrayList<Resource> list = new ArrayList<Resource>();
        for (String line : readLines("resources.txt")) {
            String[] p = line.split("\\|", -1);
            if (p.length < 5) {
                continue;
            }
            try {
                list.add(new Resource(Integer.parseInt(p[0]), p[1], Integer.parseInt(p[2]), p[3], p[4]));
            } catch (Exception e) {
                System.out.println("Skipping a broken line in resources.txt");
            }
        }
        return list;
    }

    // ================= RELIEF REQUESTS =================

    public static void saveRequests(ArrayList<ReliefRequest> requests) {
        ArrayList<String> lines = new ArrayList<String>();
        for (ReliefRequest r : requests) {
            lines.add(r.toFileString());
        }
        writeLines("requests.txt", lines);
    }

    public static ArrayList<ReliefRequest> loadRequests() {
        ArrayList<ReliefRequest> list = new ArrayList<ReliefRequest>();
        for (String line : readLines("requests.txt")) {
            String[] p = line.split("\\|", -1);
            if (p.length < 9) {
                continue;
            }
            try {
                list.add(new ReliefRequest(Integer.parseInt(p[0]), p[1], p[2], p[3], p[4],
                        Integer.parseInt(p[5]), p[6], p[7], p[8]));
            } catch (Exception e) {
                System.out.println("Skipping a broken line in requests.txt");
            }
        }
        return list;
    }

    // ================= MISSING PERSONS =================

    public static void saveMissingPersons(ArrayList<MissingPerson> missingPersons) {
        ArrayList<String> lines = new ArrayList<String>();
        for (MissingPerson m : missingPersons) {
            lines.add(m.toFileString());
        }
        writeLines("missing.txt", lines);
    }

    public static ArrayList<MissingPerson> loadMissingPersons() {
        ArrayList<MissingPerson> list = new ArrayList<MissingPerson>();
        for (String line : readLines("missing.txt")) {
            String[] p = line.split("\\|", -1);
            if (p.length < 8) {
                continue;
            }
            try {
                list.add(new MissingPerson(Integer.parseInt(p[0]), p[1], Integer.parseInt(p[2]),
                        p[3], p[4], p[5], p[6], p[7]));
            } catch (Exception e) {
                System.out.println("Skipping a broken line in missing.txt");
            }
        }
        return list;
    }

    // ================= DONATIONS =================

    public static void saveDonations(ArrayList<Donation> donations) {
        ArrayList<String> lines = new ArrayList<String>();
        for (Donation d : donations) {
            lines.add(d.toFileString());
        }
        writeLines("donations.txt", lines);
    }

    public static ArrayList<Donation> loadDonations() {
        ArrayList<Donation> list = new ArrayList<Donation>();
        for (String line : readLines("donations.txt")) {
            String[] p = line.split("\\|", -1);
            if (p.length < 6) {
                continue;
            }
            try {
                list.add(new Donation(Integer.parseInt(p[0]), p[1], p[2], p[3],
                        Double.parseDouble(p[4]), p[5]));
            } catch (Exception e) {
                System.out.println("Skipping a broken line in donations.txt");
            }
        }
        return list;
    }
}
