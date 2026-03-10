using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/properties")]
public class PropertiesController : ControllerBase
{
    private readonly AppDbContext _db;

    public PropertiesController(AppDbContext db) => _db = db;

    // GET /api/properties?search=&type=&minPrice=&maxPrice=&sortBy=price&sortDir=asc
    // LINQ filtering + sorting, no auth required (public listing)
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? type,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string sortBy    = "price",
        [FromQuery] string sortDir   = "asc")
    {
        var query = _db.Properties.Include(p => p.Broker).AsQueryable();

        // ── LINQ Filtering ────────────────────────────────────────────────
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(p =>
                p.Title.ToLower().Contains(s) ||
                p.Location.ToLower().Contains(s) ||
                p.Type.ToLower().Contains(s) ||
                p.Description.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(p => p.Type.ToLower() == type.ToLower());

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        // ── LINQ Sorting ──────────────────────────────────────────────────
        query = (sortBy.ToLower(), sortDir.ToLower()) switch
        {
            ("price", "desc")    => query.OrderByDescending(p => p.Price),
            ("price", _)         => query.OrderBy(p => p.Price),
            ("bedrooms", "desc") => query.OrderByDescending(p => p.Bedrooms),
            ("bedrooms", _)      => query.OrderBy(p => p.Bedrooms),
            ("area", "desc")     => query.OrderByDescending(p => p.Area),
            ("area", _)          => query.OrderBy(p => p.Area),
            ("title", "desc")    => query.OrderByDescending(p => p.Title),
            ("title", _)         => query.OrderBy(p => p.Title),
            _                    => query.OrderBy(p => p.Price)
        };

        // ── LINQ Projection ───────────────────────────────────────────────
        var result = await query
            .Select(p => new PropertyResponse(
                p.Id, p.Title, p.Location, p.Price,
                p.Bedrooms, p.Bathrooms, p.Area,
                p.Description, p.ImageUrl, p.Type,
                p.BrokerId, p.Broker!.Name))
            .ToListAsync();

        return Ok(result);
    }

    // GET /api/properties/broker  – broker's own listings
    [HttpGet("broker")]
    [Authorize(Roles = "broker")]
    public async Task<IActionResult> GetByBroker()
    {
        var brokerId = GetUserId();
        var result = await _db.Properties
            .Where(p => p.BrokerId == brokerId)
            .Select(p => new PropertyResponse(
                p.Id, p.Title, p.Location, p.Price,
                p.Bedrooms, p.Bathrooms, p.Area,
                p.Description, p.ImageUrl, p.Type,
                p.BrokerId, p.Broker!.Name))
            .ToListAsync();
        return Ok(result);
    }

    // POST /api/properties
    [HttpPost]
    [Authorize(Roles = "broker")]
    public async Task<IActionResult> Create([FromBody] CreatePropertyRequest req)
    {
        var prop = new Property
        {
            Title       = req.Title,
            Location    = req.Location,
            Price       = req.Price,
            Bedrooms    = req.Bedrooms,
            Bathrooms   = req.Bathrooms,
            Area        = req.Area,
            Description = req.Description,
            ImageUrl    = req.ImageUrl,
            Type        = req.Type,
            BrokerId    = GetUserId()
        };
        _db.Properties.Add(prop);
        await _db.SaveChangesAsync();

        await _db.Entry(prop).Reference(p => p.Broker).LoadAsync();
        return CreatedAtAction(nameof(GetAll), new { id = prop.Id },
            new PropertyResponse(prop.Id, prop.Title, prop.Location, prop.Price,
                prop.Bedrooms, prop.Bathrooms, prop.Area,
                prop.Description, prop.ImageUrl, prop.Type,
                prop.BrokerId, prop.Broker!.Name));
    }

    // DELETE /api/properties/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "broker")]
    public async Task<IActionResult> Delete(int id)
    {
        var prop = await _db.Properties.FindAsync(id);
        if (prop is null) return NotFound();
        if (prop.BrokerId != GetUserId()) return Forbid();

        _db.Properties.Remove(prop);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)!);
}
