// Volunteer account - has extra fields: skills and availability.
public class Volunteer extends User {

    private String skills;       // example: "First Aid, Driving, Cooking"
    private String availability; // "Available" or "Busy"

    public Volunteer(String username, String password, String fullName, String phone, String skills) {
        this(username, password, fullName, phone, skills, "Available");
    }

    public Volunteer(String username, String password, String fullName, String phone,
                     String skills, String availability) {
        super(username, password, fullName, phone, "VOLUNTEER");
        this.skills = skills;
        this.availability = availability;
    }

    public String getSkills() {
        return skills;
    }

    public String getAvailability() {
        return availability;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    @Override
    public String displayInfo() {
        return "[VOLUNTEER] " + getFullName() + " | skills: " + skills
                + " | " + availability + " | phone: " + getPhone();
    }

    @Override
    public String toFileString() {
        return super.toFileString() + "|" + skills + "|" + availability;
    }
}
