using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public BookingsController(AppDbContext db) => _db = db;

    // POST /api/bookings  (customer only)
    [HttpPost]
    [Authorize(Roles = "customer")]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest req)
    {
        var customerId = GetUserId();

        // LINQ duplicate check
        var alreadyBooked = await _db.Bookings.AnyAsync(b =>
            b.PropertyId == req.PropertyId &&
            b.CustomerId == customerId &&
            b.Status != "rejected");

        if (alreadyBooked)
            return Conflict(new { message = "You have already booked this property." });

        var property = await _db.Properties.FindAsync(req.PropertyId);
        if (property is null) return NotFound(new { message = "Property not found." });

        var booking = new Booking
        {
            PropertyId = req.PropertyId,
            CustomerId = customerId,
            BrokerId   = property.BrokerId,
            Status     = "pending"
        };
        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        return Ok(await ToResponseAsync(booking));
    }

    // GET /api/bookings/customer  (current customer's bookings)
    [HttpGet("customer")]
    [Authorize(Roles = "customer")]
    public async Task<IActionResult> GetForCustomer()
    {
        var id = GetUserId();
        var bookings = await _db.Bookings
            .Where(b => b.CustomerId == id)
            .Include(b => b.Property)
            .Include(b => b.Customer)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Ok(bookings.Select(ToResponse));
    }

    // GET /api/bookings/broker  (current broker's incoming requests)
    [HttpGet("broker")]
    [Authorize(Roles = "broker")]
    public async Task<IActionResult> GetForBroker()
    {
        var id = GetUserId();
        var bookings = await _db.Bookings
            .Where(b => b.BrokerId == id)
            .Include(b => b.Property)
            .Include(b => b.Customer)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Ok(bookings.Select(ToResponse));
    }

    // PATCH /api/bookings/{id}/status  (broker only)
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "broker")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusRequest req)
    {
        var brokerId = GetUserId();
        var booking  = await _db.Bookings
            .Include(b => b.Property)
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking is null) return NotFound();
        if (booking.BrokerId != brokerId) return Forbid();

        var status = req.Status.ToLower();
        if (status != "accepted" && status != "rejected")
            return BadRequest(new { message = "Status must be 'accepted' or 'rejected'." });

        booking.Status = status;
        await _db.SaveChangesAsync();
        return Ok(ToResponse(booking));
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private static BookingResponse ToResponse(Booking b) => new(
        b.Id,
        b.PropertyId,
        b.Property?.Title        ?? "",
        b.Property?.Location     ?? "",
        b.Property?.Price        ?? 0,
        b.Property?.ImageUrl     ?? "",
        b.CustomerId,
        b.Customer?.Name         ?? "",
        b.Customer?.Email        ?? "",
        b.BrokerId,
        b.Status,
        b.CreatedAt
    );

    private async Task<BookingResponse> ToResponseAsync(Booking b)
    {
        await _db.Entry(b).Reference(x => x.Property).LoadAsync();
        await _db.Entry(b).Reference(x => x.Customer).LoadAsync();
        return ToResponse(b);
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)!);
}
