# Real Estate Portal – Backend Setup Guide

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| .NET SDK | 8.x | https://dotnet.microsoft.com/download/dotnet/8.0 |
| MySQL | 8.x | https://dev.mysql.com/downloads/installer/ |
| Node.js | 18+ | Already installed |

---

## Step 1 – Configure MySQL Password

Open `backend/appsettings.json` and replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password:

```json
"Default": "server=localhost;port=3306;database=realestate;user=root;password=YOUR_ACTUAL_PASSWORD"
```

---

## Step 2 – Create the Database

Open MySQL Workbench or the MySQL command line and run:

```sql
CREATE DATABASE IF NOT EXISTS realestate;
```

---

## Step 3 – Install Backend Dependencies & Run Migrations

Open a **new terminal** in the `backend/` folder:

```powershell
cd real-estate-portal\backend

# Restore NuGet packages
dotnet restore

# Create EF Core initial migration (first time only)
dotnet ef migrations add InitialCreate

# Apply migration (creates all tables + seeds data)
dotnet ef database update
```

---

## Step 4 – Start the Backend

```powershell
dotnet run
```

The API will start at **http://localhost:5000**  
Swagger UI will be available at **http://localhost:5000/swagger**

---

## Step 5 – Start the Frontend

In a **separate terminal**:

```powershell
cd real-estate-portal\frontend
npm start
```

Frontend runs at **http://localhost:3000**

---

## Demo Accounts (seeded automatically)

| Role | Email | Password |
|---|---|---|
| Broker | broker@demo.com | password |
| Customer | customer@demo.com | password |

---

## API Endpoints Summary

### Auth
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |

### Properties
| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/properties | Public |
| GET | /api/properties?search=&type=&minPrice=&maxPrice=&sortBy=price&sortDir=asc | Public |
| GET | /api/properties/broker | Broker JWT |
| POST | /api/properties | Broker JWT |
| DELETE | /api/properties/{id} | Broker JWT |

### Bookings
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/bookings | Customer JWT |
| GET | /api/bookings/customer | Customer JWT |
| GET | /api/bookings/broker | Broker JWT |
| PATCH | /api/bookings/{id}/status | Broker JWT |

### Favorites
| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/favorites | Customer JWT |
| POST | /api/favorites/{propertyId} | Customer JWT |
| DELETE | /api/favorites/{propertyId} | Customer JWT |

---

## Troubleshooting

**"Authentication scheme already registered"** – Remove duplicate `.AddJwtBearer()` calls in old configuration.  
**MySQL connection refused** – Ensure MySQL service is running (`services.msc` → MySQL80 → Start).  
**CORS error in browser** – Ensure backend is running on port 5000 before starting the frontend.  
**`dotnet ef` not found** – Run `dotnet tool install --global dotnet-ef` first.
