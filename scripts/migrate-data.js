// Migration script to populate database with existing package data
// Run this script after setting up the database schema
// Usage: node scripts/migrate-data.js

import { config } from 'dotenv';
import { query } from '../lib/db.js';
import { hashPassword } from '../lib/auth.js';

// Load environment variables
config({ path: '.env.local' });

const packages = [
  {
    name: 'Express',
    price: 8.00,
    membership_price: 19.95,
    description: 'Quick and efficient basic wash',
    features: ['Exterior Wash', 'Bug Remover', 'Manual hand dry', 'Free Vacuum'],
    subscription_url: 'https://subscriptions.helcim.com/subscribe/fgf611yoa5halqhpu9xnk7ne2ywdj',
    display_order: 1,
    is_featured: false
  },
  {
    name: 'Deluxe',
    price: 11.00,
    membership_price: 26.95,
    description: 'Enhanced cleaning with premium features',
    features: ['Everything in Express', 'Tire Scrub', 'Triple Foam Conditioner'],
    subscription_url: 'https://subscriptions.helcim.com/subscribe/fy33xvbst8mt14bxb26dnkkteovrz',
    display_order: 2,
    is_featured: false
  },
  {
    name: 'Ultimate',
    price: 15.00,
    membership_price: 33.95,
    description: 'Complete care with maximum protection',
    features: ['Everything in Deluxe and Express', 'Wheel Cleaner', 'Triple Foam Conditioner w/ Wax', 'Under Body Wash'],
    subscription_url: 'https://subscriptions.helcim.com/subscribe/fgce5ftrwg4z3ddxjkjgd8xnahomk',
    display_order: 3,
    is_featured: false
  },
  {
    name: 'Platinum',
    price: 20.00,
    membership_price: 38.99,
    description: 'Ultimate care with all premium features',
    features: ['Everything in Ultimate, Deluxe, and Express', 'Tire Shine', 'Tire Cleaner'],
    subscription_url: 'https://subscriptions.helcim.com/subscribe/f45b2d5ug0g7r2csigevm7gok1j90',
    display_order: 4,
    is_featured: true
  }
];

async function migratePackages() {
  console.log('Starting package migration...');

  try {
    for (const pkg of packages) {
      console.log(`Inserting package: ${pkg.name}...`);
      
      await query(
        `INSERT INTO packages 
        (name, price, membership_price, description, features, subscription_url, display_order, is_featured) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING`,
        [
          pkg.name,
          pkg.price,
          pkg.membership_price,
          pkg.description,
          JSON.stringify(pkg.features),
          pkg.subscription_url,
          pkg.display_order,
          pkg.is_featured
        ]
      );
      
      console.log(`✓ Package "${pkg.name}" inserted successfully`);
    }

    console.log('\n✓ All packages migrated successfully!');
  } catch (error) {
    console.error('Error migrating packages:', error);
    throw error;
  }
}

async function createAdminUser() {
  console.log('\nCreating admin user...');

  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'changeme123';

    // Check if admin user already exists
    const existingUser = await query(
      'SELECT id FROM admin_users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠ Admin user already exists, skipping...');
      return;
    }

    const passwordHash = await hashPassword(password);

    await query(
      'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
      [username, passwordHash]
    );

    console.log(`✓ Admin user "${username}" created successfully`);
    console.log(`⚠ Default password: ${password}`);
    console.log('⚠ IMPORTANT: Change this password immediately after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('=== Database Migration Script ===\n');

    await migratePackages();
    await createAdminUser();

    console.log('\n=== Migration Complete ===');
    console.log('\nNext steps:');
    console.log('1. Deploy to Vercel or start local dev server');
    console.log('2. Test the API endpoints');
    console.log('3. Access the admin dashboard at /admin');
    console.log('4. Change the default admin password\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();

