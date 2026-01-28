#!/usr/bin/env node
/**
 * Database Setup Script
 * This script creates all database tables and seeds initial data
 * Run: node scripts/setupDatabase.js
 */

const { sequelize } = require('../src/models');
const seedDb = require('./seedDb');

async function setupDatabase() {
    try {
        console.log('🔧 Starting database setup...\n');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established.\n');

        // Create all tables (force: true will drop existing tables)
        console.log('📋 Creating database tables...');
        await sequelize.sync({ force: true });
        console.log('✅ All tables created successfully.\n');

        // Seed data
        console.log('🌱 Seeding database with initial data...');
        await seedDb();
        console.log('✅ Database seeded successfully.\n');

        console.log('🎉 Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();
