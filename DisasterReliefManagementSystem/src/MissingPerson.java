// A missing person report filed during a disaster.
public class MissingPerson {

    private int id;
    private String name;
    private int age;
    private String lastSeenLocation;
    private String reportedBy;
    private String contact;
    private String status; // Missing or Found
    private String dateReported;

    public MissingPerson(int id, String name, int age, String lastSeenLocation, String reportedBy,
                         String contact, String status, String dateReported) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.lastSeenLocation = lastSeenLocation;
        this.reportedBy = reportedBy;
        this.contact = contact;
        this.status = status;
        this.dateReported = dateReported;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getLastSeenLocation() {
        return lastSeenLocation;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public String getContact() {
        return contact;
    }

    public String getStatus() {
        return status;
    }

    public String getDateReported() {
        return dateReported;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // One line saved into data/missing.txt.
    public String toFileString() {
        return id + "|" + name + "|" + age + "|" + lastSeenLocation + "|" + reportedBy + "|"
                + contact + "|" + status + "|" + dateReported;
    }
}
