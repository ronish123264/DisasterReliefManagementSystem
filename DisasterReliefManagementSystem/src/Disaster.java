// One reported disaster (earthquake, flood, landslide, forest fire...).
public class Disaster {

    private int id;
    private String type;        // Earthquake, Flood, Landslide, Forest Fire, Other
    private String location;
    private String severity;    // Low, Medium, High, Critical
    private String date;        // yyyy-mm-dd
    private String description;
    private String status;      // Reported, Ongoing, Resolved
    private String reportedBy;

    public Disaster(int id, String type, String location, String severity, String date,
                    String description, String status, String reportedBy) {
        this.id = id;
        this.type = type;
        this.location = location;
        this.severity = severity;
        this.date = date;
        this.description = description;
        this.status = status;
        this.reportedBy = reportedBy;
    }

    public int getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getLocation() {
        return location;
    }

    public String getSeverity() {
        return severity;
    }

    public String getDate() {
        return date;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // One line saved into data/disasters.txt.
    public String toFileString() {
        return id + "|" + type + "|" + location + "|" + severity + "|" + date + "|"
                + description + "|" + status + "|" + reportedBy;
    }
}
