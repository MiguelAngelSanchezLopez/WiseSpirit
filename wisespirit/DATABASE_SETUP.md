# Database Setup Instructions

## Current Status
✅ **Schema Updated:** Prisma schema now uses PostgreSQL instead of SQLite
✅ **Seed Updated:** Seed script includes 7 airlines with detailed policies

## Required Actions

### 1. Update .env File with Your PostgreSQL Credentials

Edit the `.env` file and replace the DATABASE_URL with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/wisespirit?schema=public"
```

**Replace:**
- `username` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `localhost:5432` - Your PostgreSQL host and port (if different)
- `wisespirit` - Your database name

### 2. Create PostgreSQL Database

If the database doesn't exist yet, create it:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE wisespirit;

# Exit psql
\q
```

### 3. Run Prisma Migrations

```bash
# Generate migration
npx prisma migrate dev --name init

# Or if starting fresh
npx prisma migrate reset
```

### 4. Seed the Database

```bash
npx prisma db seed
```

### 5. Verify with Prisma Studio

```bash
npx prisma studio
```

Visit http://localhost:5555 to view all airlines and their policies in the database.

## Database Content

The seed will add **7 airlines** to your PostgreSQL database:

1. **Aeromexico** - Structured rules (40% reuse, 30% discard, can combine)
2. **Lufthansa** - Structured rules (50% reuse, 20% discard, no combining)
3. **British Airways** - AI-interpreted policy text
4. **Emirates** - AI-interpreted policy text
5. **Singapore Airlines** - AI-interpreted policy text
6. **Qatar Airways** - AI-interpreted policy text (NEW)
7. **Swiss International Air Lines** - AI-interpreted policy text (NEW)
8. **Delta Air Lines** - AI-interpreted policy text (NEW)

## Important Notes

- The seed script deletes all existing data before seeding to prevent duplicates
- All new airlines (Qatar, Swiss, Delta, Emirates) have realistic, comprehensive policy texts
- The AI decision system will automatically interpret policy texts into structured rules
- Ensure your PostgreSQL server is running before running migrations and seeding

