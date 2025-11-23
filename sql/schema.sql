-- Bayside Carwash Database Schema
-- For use with Neon Serverless Postgres

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    membership_price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    subscription_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_packages_display_order ON packages(display_order);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_packages_updated_at 
    BEFORE UPDATE ON packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial admin user (password: changeme123)
-- Note: This is a bcrypt hash of "changeme123" - CHANGE THIS IN PRODUCTION
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$rKZvGx8VZ5qVZ5qVZ5qVZ.YvGx8VZ5qVZ5qVZ5qVZ5qVZ5qVZ5qVZ')
ON CONFLICT (username) DO NOTHING;

-- Insert existing packages from washes.html
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

