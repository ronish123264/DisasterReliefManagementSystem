// A relief shelter where displaced people stay.
public class Shelter {

    private int id;
    private String name;
    private String location;
    private int capacity;   // total people it can hold
    private int occupied;   // people currently staying there
    private String contact; // phone number of the shelter manager

    public Shelter(int id, String name, String location, int capacity, int occupied, String contact) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.occupied = occupied;
        this.contact = contact;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public int getCapacity() {
        return capacity;
    }

    public int getOccupied() {
        return occupied;
    }

    public String getContact() {
        return contact;
    }

    public void setOccupied(int occupied) {
        this.occupied = occupied;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    // Simple method that works with the object's own fields.
    public int getAvailableSpace() {
        return capacity - occupied;
    }

    // One line saved into data/shelters.txt.
    public String toFileString() {
        return id + "|" + name + "|" + location + "|" + capacity + "|" + occupied + "|" + contact;
    }
}
