# Patent Hash Database Export

## Export Contents

This database export contains the complete Patent Hash database structure and data from your Replit environment.

### Files Included

1. **`database-complete.sql`** - Complete database dump (schema + data + cleanup)
2. **`database-schema.sql`** - Schema-only export (tables, indexes, constraints)
3. **`database-data.sql`** - Data-only export (INSERT statements)

### Current Database Statistics
- **Users**: 1 (your account)
- **Patents**: 0 (no patents filed yet)
- **Sessions**: 2 (active sessions)
- **Tables**: 8 total tables

## Import Instructions

### Option 1: Complete Restore (Recommended)
```bash
# Create new database
createdb patent_hash_db

# Import complete dump
psql patent_hash_db < database-complete.sql
```

### Option 2: Schema + Data Separate
```bash
# Create new database
createdb patent_hash_db

# Import schema first
psql patent_hash_db < database-schema.sql

# Import data
psql patent_hash_db < database-data.sql
```

### Option 3: Schema Only (Fresh Start)
```bash
# Create new database
createdb patent_hash_db

# Import just the schema
psql patent_hash_db < database-schema.sql
```

## Database Structure

### Core Tables
- **`users`** - User accounts and profiles
- **`sessions`** - User sessions (required for authentication)
- **`patents`** - Patent records and metadata
- **`patent_documents`** - Document attachments and files
- **`ai_analysis`** - AI-powered analysis results
- **`prior_art_results`** - Prior art search findings
- **`blockchain_transactions`** - Hedera blockchain records
- **`patent_activity`** - Activity log and audit trail

### Key Features
- UUID primary keys for all entities
- Comprehensive foreign key relationships
- Enum types for status and categories
- JSONB columns for flexible metadata storage
- Proper indexing for performance

## Local Setup Notes

1. **Environment Variables**: Update your `.env` file with the new database URL
2. **Database Connection**: Ensure PostgreSQL is running locally
3. **Schema Updates**: Use `npm run db:push` for any future schema changes
4. **Data Migration**: Your user account will be preserved

## Connection String Format
```
DATABASE_URL=postgresql://username:password@localhost:5432/patent_hash_db
```

## Verification Commands

After import, verify the database:
```bash
# Check tables
psql patent_hash_db -c "\dt"

# Check user data
psql patent_hash_db -c "SELECT id, email, first_name, last_name FROM users;"

# Check schema version
psql patent_hash_db -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

## Troubleshooting

### Permission Issues
If you get permission errors:
```bash
# Make sure you're the database owner
psql patent_hash_db -c "ALTER DATABASE patent_hash_db OWNER TO your_username;"
```

### Encoding Issues
If you see encoding errors:
```bash
# Create database with UTF8 encoding
createdb -E UTF8 patent_hash_db
```

### Connection Issues
Ensure PostgreSQL is running:
```bash
# Start PostgreSQL (varies by system)
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

## Next Steps

1. Import the database using one of the methods above
2. Update your backend `.env` file with the new database URL
3. Test the connection: `cd backend && npm run db:push`
4. Start your local development servers
5. Verify your user account works by logging in

The exported database maintains all the relationships and constraints needed for the Patent Hash application to function properly in your local environment.