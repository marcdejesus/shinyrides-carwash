-- Seed script to populate database with initial data
-- Run this after creating the schema

-- Note: The admin user password hash needs to be generated properly
-- This is just a placeholder. Use the /api/auth/setup endpoint to create the first admin user

-- Clear existing data (use with caution!)
-- TRUNCATE TABLE packages RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE admin_users RESTART IDENTITY CASCADE;

-- Insert packages from current washes.html
INSERT INTO packages (name, price, membership_price, description, features, subscription_url, display_order, is_featured) VALUES
(
    'Express',
    8.00,
    19.95,
    'Quick and efficient basic wash',
    '["Exterior Wash", "Bug Remover", "Manual hand dry", "Free Vacuum"]'::jsonb,
    'https://subscriptions.helcim.com/subscribe/fgf611yoa5halqhpu9xnk7ne2ywdj',
    1,
    FALSE
),
(
    'Deluxe',
    11.00,
    26.95,
    'Enhanced cleaning with premium features',
    '["Everything in Express", "Tire Scrub", "Triple Foam Conditioner"]'::jsonb,
    'https://subscriptions.helcim.com/subscribe/fy33xvbst8mt14bxb26dnkkteovrz',
    2,
    FALSE
),
(
    'Ultimate',
    15.00,
    33.95,
    'Complete care with maximum protection',
    '["Everything in Deluxe and Express", "Wheel Cleaner", "Triple Foam Conditioner w/ Wax", "Under Body Wash"]'::jsonb,
    'https://subscriptions.helcim.com/subscribe/fgce5ftrwg4z3ddxjkjgd8xnahomk',
    3,
    FALSE
),
(
    'Platinum',
    20.00,
    38.99,
    'Ultimate care with all premium features',
    '["Everything in Ultimate, Deluxe, and Express", "Tire Shine", "Tire Cleaner"]'::jsonb,
    'https://subscriptions.helcim.com/subscribe/f45b2d5ug0g7r2csigevm7gok1j90',
    4,
    TRUE
)
ON CONFLICT DO NOTHING;

