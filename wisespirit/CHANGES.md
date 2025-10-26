# Database Migration and Seed Updates

## Summary of Changes

This update migrates WiseSpirit from SQLite to PostgreSQL and adds 4 new airlines with comprehensive policy data.

### ✅ Changes Made

#### 1. **Prisma Schema** (`prisma/schema.prisma`)
- ✅ Changed datasource from `sqlite` to `postgresql`
- ✅ Database now uses PostgreSQL connection string from `.env`

#### 2. **Seed Data** (`prisma/seed.ts`)
- ✅ Added 4 new airlines with detailed, realistic policy texts:
  - **Qatar Airways** - Comprehensive policy with 65% reuse, 35% discard, can combine
  - **Swiss International Air Lines** - Detailed policy with 55% reuse, 22% discard, no combining
  - **Delta Air Lines** - Extensive policy with 60% reuse, 25% discard, can combine with conditions
  - **Emirates** - Already existed but kept in updated seed
- ✅ Updated British Airways with more detailed policy text
- ✅ Kept existing airlines (Aeromexico, Lufthansa, Singapore Airlines)
- ✅ Total: 7 airlines now seeded

#### 3. **Environment Configuration**
- ✅ Updated `.env.example` with PostgreSQL template
- ✅ Created `.env` placeholder (needs your credentials)
- ✅ Created `DATABASE_SETUP.md` with detailed instructions

### 📋 New Airline Policies

#### **Qatar Airways**
- **Reuse:** 65% or more
- **Discard:** Below 35%
- **Combine:** 35-64% with management approval
- **Special:** Premium spirits down to 40%

#### **Swiss International Air Lines**
- **Reuse:** 55% or more
- **Discard:** Below 22%
- **Combine:** Prohibited
- **Special:** Exceptionally expensive spirits (>$100) may reuse down to 40%

#### **Delta Air Lines**
- **Reuse:** 60% or more
- **Discard:** Below 25%
- **Combine:** Matching bottles 25%+, combined volume must be 50%+
- **Special:** High-value spirits (>$75) reuse down to 35%

### 🔧 Required Actions

1. **Update .env file** with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/wisespirit"
   ```

2. **Create PostgreSQL database** (if not exists):
   ```bash
   psql -U postgres
   CREATE DATABASE wisespirit;
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database**:
   ```bash
   npx prisma db seed
   ```

5. **Verify with Prisma Studio**:
   ```bash
   npx prisma studio
   ```

### 📊 Database Status

- **Provider:** PostgreSQL (migrated from SQLite)
- **Total Airlines:** 7
- **Predefined Rules:** 2 (Aeromexico, Lufthansa)
- **AI-Interpreted Policies:** 5 (British Airways, Emirates, Singapore Airlines, Qatar Airways, Swiss, Delta)
- **Seed Protection:** Prevents duplicates by clearing existing data first

### 🎯 Next Steps

1. Configure your PostgreSQL connection
2. Run migrations and seeding
3. View airlines in Prisma Studio
4. Test the enhanced AI decision system with new airlines

