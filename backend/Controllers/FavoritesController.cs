using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize(Roles = "customer")]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _db;
    public FavoritesController(AppDbContext db) => _db = db;

    // GET /api/favorites
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customerId = GetUserId();

        // LINQ join – project only what the frontend needs
        var result = await _db.Favorites
            .Where(f => f.CustomerId == customerId)
            .Include(f => f.Property)
            .OrderByDescending(f => f.SavedAt)
            .Select(f => new FavoriteResponse(
                f.Id,
                f.PropertyId,
                f.Property!.Title,
                f.Property.Location,
                f.Property.Price,
                f.Property.ImageUrl,
                f.Property.Type,
                f.SavedAt))
            .ToListAsync();

        return Ok(result);
    }

    // POST /api/favorites/{propertyId}
    [HttpPost("{propertyId}")]
    public async Task<IActionResult> Add(int propertyId)
    {
        var customerId = GetUserId();

        var exists = await _db.Favorites.AnyAsync(
            f => f.CustomerId == customerId && f.PropertyId == propertyId);
        if (exists)
            return Conflict(new { message = "Already in favorites." });

        var propExists = await _db.Properties.AnyAsync(p => p.Id == propertyId);
        if (!propExists) return NotFound(new { message = "Property not found." });

        var fav = new Favorite { CustomerId = customerId, PropertyId = propertyId };
        _db.Favorites.Add(fav);
        await _db.SaveChangesAsync();

        return Ok(new { id = fav.Id, propertyId, customerId });
    }

    // DELETE /api/favorites/{propertyId}
    [HttpDelete("{propertyId}")]
    public async Task<IActionResult> Remove(int propertyId)
    {
        var customerId = GetUserId();
        var fav = await _db.Favorites.FirstOrDefaultAsync(
            f => f.CustomerId == customerId && f.PropertyId == propertyId);

        if (fav is null) return NotFound();
        _db.Favorites.Remove(fav);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)!);
}
