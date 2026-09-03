// A relief supply kept in a warehouse (rice, water, medicine, blankets...).
public class Resource {

    private int id;
    private String name;
    private int quantity;
    private String unit;    // bags, bottles, kits, pieces...
    private String location; // warehouse or store location

    public Resource(int id, String name, int quantity, String unit, String location) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.location = location;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public String getLocation() {
        return location;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    // One line saved into data/resources.txt.
    public String toFileString() {
        return id + "|" + name + "|" + quantity + "|" + unit + "|" + location;
    }
}
