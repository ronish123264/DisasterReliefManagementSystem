// Municipality account - manages disasters, shelters and relief requests of its district.
public class Municipality extends User {

    private String district;

    public Municipality(String username, String password, String fullName, String phone, String district) {
        super(username, password, fullName, phone, "MUNICIPALITY");
        this.district = district;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    @Override
    public String displayInfo() {
        return "[MUNICIPALITY] " + getFullName() + " | district: " + district
                + " | username: " + getUsername();
    }

    @Override
    public String toFileString() {
        return super.toFileString() + "|" + district;
    }
}
