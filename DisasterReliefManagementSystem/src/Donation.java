// A donation (money or supplies) given by a donor.
public class Donation {

    private int id;
    private String donorName;
    private String type;    // Money or Supplies
    private String itemName; // what was given ("-" for money donations)
    private double amount;  // rupees for money donations, 0 for supplies
    private String date;

    public Donation(int id, String donorName, String type, String itemName, double amount, String date) {
        this.id = id;
        this.donorName = donorName;
        this.type = type;
        this.itemName = itemName;
        this.amount = amount;
        this.date = date;
    }

    public int getId() {
        return id;
    }

    public String getDonorName() {
        return donorName;
    }

    public String getType() {
        return type;
    }

    public String getItemName() {
        return itemName;
    }

    public double getAmount() {
        return amount;
    }

    public String getDate() {
        return date;
    }

    // One line saved into data/donations.txt.
    public String toFileString() {
        return id + "|" + donorName + "|" + type + "|" + itemName + "|" + amount + "|" + date;
    }
}
