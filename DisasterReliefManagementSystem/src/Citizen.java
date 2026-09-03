// Citizen account - can report disasters, ask for relief and donate.
public class Citizen extends User {

    private String address;

    public Citizen(String username, String password, String fullName, String phone, String address) {
        super(username, password, fullName, phone, "CITIZEN");
        this.address = address;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String displayInfo() {
        return "[CITIZEN] " + getFullName() + " | address: " + address
                + " | username: " + getUsername();
    }

    @Override
    public String toFileString() {
        return super.toFileString() + "|" + address;
    }
}
