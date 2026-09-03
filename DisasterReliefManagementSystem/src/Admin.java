// Administrator account - can manage every part of the system.
public class Admin extends User {

    public Admin(String username, String password, String fullName, String phone) {
        super(username, password, fullName, phone, "ADMIN");
    }

    @Override
    public String displayInfo() {
        return "[ADMIN] " + getFullName() + " (username: " + getUsername() + ")";
    }
}
