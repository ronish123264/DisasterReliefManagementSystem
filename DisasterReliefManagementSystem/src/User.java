// Base class for every user of the system.
// Admin, Municipality, Volunteer and Citizen all extend this class (inheritance).
public class User {

    private String username;
    private String password;
    private String fullName;
    private String phone;
    private String role; // ADMIN, MUNICIPALITY, VOLUNTEER, CITIZEN

    public User(String username, String password, String fullName, String phone, String role) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getRole() {
        return role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // Subclasses can override this method (polymorphism).
    public String displayInfo() {
        return role + " | " + fullName + " | username: " + username + " | phone: " + phone;
    }

    // One line saved into data/users.txt (fields separated by |).
    public String toFileString() {
        return role + "|" + username + "|" + password + "|" + fullName + "|" + phone;
    }
}
