# Database Setup Guide

## Quick Setup (Recommended)

After cloning the repository, follow these steps to set up the database:

### 1. Create MySQL Database

```bash
mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE teacher_panel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'teacher_panel_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON teacher_panel_db.* TO 'teacher_panel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Configure Environment Variables

Create `.env` file in `server/` directory:

```env
DB_HOST=localhost
DB_USER=teacher_panel_user
DB_PASSWORD=your_password
DB_NAME=teacher_panel_db
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Setup Database (Tables + Data)

Run the automated setup script:

```bash
node scripts/setupDatabase.js
```

This will:
- ✅ Create all database tables
- ✅ Seed initial data (users, subjects, classes, grades)

**OR** do it manually:

```bash
# Create tables only
node scripts/syncDb.js

# Add data only
node scripts/seedDb.js
```

### 5. Start the Server

```bash
npm start
# or for development
npm run dev
```

## Test Accounts

After seeding, you can login with:

**Teachers:**
- jan.kowalski@szkola.pl / password123
- anna.nowak@szkola.pl / password123

**Students:**
- adam.wisniewski@student.pl / password123
- maria.wojcik@student.pl / password123
- (13 more students available)

## Troubleshooting

### Database already exists
If you need to reset the database:

```bash
mysql -u root -p
DROP DATABASE teacher_panel_db;
CREATE DATABASE teacher_panel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Then run setup again
node scripts/setupDatabase.js
```

### Connection errors
- Check if MySQL service is running
- Verify credentials in `.env` file
- Ensure user has proper permissions

## Scripts Reference

- `setupDatabase.js` - Complete setup (creates tables + seeds data)
- `syncDb.js` - Creates/updates database tables only
- `seedDb.js` - Adds initial data only (skips if data exists)
