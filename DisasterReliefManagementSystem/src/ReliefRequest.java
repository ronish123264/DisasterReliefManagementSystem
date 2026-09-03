// A request from a citizen asking for relief supplies (food, water, medicine...).
public class ReliefRequest {

    private int id;
    private String citizenName;
    private String contact;
    private String location;
    private String needType;  // Food, Drinking Water, Medicine, Clothes, Other
    private int quantity;
    private String status;    // Pending, Approved, Rejected, Delivered
    private String date;
    private String volunteer; // volunteer who claimed this request (empty if none)

    public ReliefRequest(int id, String citizenName, String contact, String location,
                         String needType, int quantity, String status, String date,
                         String volunteer) {
        this.id = id;
        this.citizenName = citizenName;
        this.contact = contact;
        this.location = location;
        this.needType = needType;
        this.quantity = quantity;
        this.status = status;
        this.date = date;
        this.volunteer = volunteer;
    }

    public int getId() {
        return id;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public String getContact() {
        return contact;
    }

    public String getLocation() {
        return location;
    }

    public String getNeedType() {
        return needType;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getStatus() {
        return status;
    }

    public String getDate() {
        return date;
    }

    public String getVolunteer() {
        return volunteer;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setVolunteer(String volunteer) {
        this.volunteer = volunteer;
    }

    // One line saved into data/requests.txt.
    public String toFileString() {
        return id + "|" + citizenName + "|" + contact + "|" + location + "|" + needType + "|"
                + quantity + "|" + status + "|" + date + "|" + volunteer;
    }
}
