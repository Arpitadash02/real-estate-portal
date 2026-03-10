namespace RealEstateApi.DTOs;

// ── Auth ────────────────────────────────────────────────────

public record RegisterRequest(string Name, string Email, string Password, string Role);

public record LoginRequest(string Email, string Password, string Role);

public record AuthResponse(int Id, string Name, string Email, string Role, string Token);

// ── Properties ──────────────────────────────────────────────

public record PropertyResponse(
    int Id,
    string Title,
    string Location,
    decimal Price,
    int Bedrooms,
    int Bathrooms,
    int Area,
    string Description,
    string ImageUrl,
    string Type,
    int BrokerId,
    string BrokerName
);

public record CreatePropertyRequest(
    string Title,
    string Location,
    decimal Price,
    int Bedrooms,
    int Bathrooms,
    int Area,
    string Description,
    string ImageUrl,
    string Type
);

// ── Bookings ─────────────────────────────────────────────────

public record CreateBookingRequest(int PropertyId);

public record UpdateBookingStatusRequest(string Status);

public record BookingResponse(
    int Id,
    int PropertyId,
    string PropertyTitle,
    string PropertyLocation,
    decimal PropertyPrice,
    string PropertyImage,
    int CustomerId,
    string CustomerName,
    string CustomerEmail,
    int BrokerId,
    string Status,
    DateTime CreatedAt
);

// ── Favorites ────────────────────────────────────────────────

public record FavoriteResponse(
    int Id,
    int PropertyId,
    string PropertyTitle,
    string PropertyLocation,
    decimal PropertyPrice,
    string PropertyImage,
    string PropertyType,
    DateTime SavedAt
);
