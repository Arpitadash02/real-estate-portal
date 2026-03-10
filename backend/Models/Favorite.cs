namespace RealEstateApi.Models;

public class Favorite
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public User? Customer { get; set; }
    public int PropertyId { get; set; }
    public Property? Property { get; set; }
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}
