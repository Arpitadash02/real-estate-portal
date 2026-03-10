using Microsoft.EntityFrameworkCore;
using RealEstateApi.Models;

namespace RealEstateApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Favorite> Favorites => Set<Favorite>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Price precision ──────────────────────────────────────────────
        modelBuilder.Entity<Property>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        // ── Seed users (passwords are BCrypt hashes of "password") ───────
        // Hash generated offline: BCrypt.HashPassword("password")
        const string passwordHash = "$2a$11$KzJhIv/gAuHiUBXEfYZAMuY0bGJM9ZZM9D3Ol3J7yEFQ.jCvFWkde";

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Alice (Broker)",   Email = "broker@demo.com",   PasswordHash = passwordHash, Role = "broker" },
            new User { Id = 2, Name = "Bob (Customer)",   Email = "customer@demo.com", PasswordHash = passwordHash, Role = "customer" }
        );

        // ── Seed properties ──────────────────────────────────────────────
        modelBuilder.Entity<Property>().HasData(
            new Property
            {
                Id = 1, BrokerId = 1,
                Title = "Skyline Penthouse",
                Location = "Manhattan, New York",
                Price = 4500000m, Bedrooms = 4, Bathrooms = 3, Area = 3200,
                Type = "Penthouse",
                Description = "Breathtaking 32nd-floor penthouse with panoramic city views, floor-to-ceiling glass, designer kitchen, and rooftop terrace.",
                ImageUrl = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
            },
            new Property
            {
                Id = 2, BrokerId = 1,
                Title = "Oceanfront Villa",
                Location = "Malibu, California",
                Price = 8900000m, Bedrooms = 6, Bathrooms = 5, Area = 5800,
                Type = "Villa",
                Description = "Stunning beachfront estate with private pool, home theater, gourmet kitchen, and direct beach access on the Pacific Ocean.",
                ImageUrl = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
            },
            new Property
            {
                Id = 3, BrokerId = 1,
                Title = "Downtown Loft",
                Location = "Chicago, Illinois",
                Price = 1200000m, Bedrooms = 2, Bathrooms = 2, Area = 1800,
                Type = "Loft",
                Description = "Stylish converted industrial loft with exposed brick, polished concrete floors, and stunning river views in the heart of Chicago.",
                ImageUrl = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
            },
            new Property
            {
                Id = 4, BrokerId = 1,
                Title = "Mountain Retreat",
                Location = "Aspen, Colorado",
                Price = 6200000m, Bedrooms = 5, Bathrooms = 4, Area = 4500,
                Type = "Chalet",
                Description = "Luxury ski-in/ski-out chalet with stone fireplace, heated floors, wine cellar, and sweeping Rocky Mountain vistas.",
                ImageUrl = "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80"
            },
            new Property
            {
                Id = 5, BrokerId = 1,
                Title = "Garden Townhouse",
                Location = "Austin, Texas",
                Price = 980000m, Bedrooms = 3, Bathrooms = 2, Area = 2200,
                Type = "Townhouse",
                Description = "Modern townhouse in a vibrant neighborhood with smart home features, rooftop deck, and a lush private garden.",
                ImageUrl = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"
            }
        );
    }
}
