namespace RealEstateApi.Models;

public class Booking
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public Property? Property { get; set; }
    public int CustomerId { get; set; }
    public User? Customer { get; set; }
    public int BrokerId { get; set; }
    public string Status { get; set; } = "pending"; // pending | accepted | rejected
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
