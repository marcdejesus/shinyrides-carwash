// One-time setup endpoint to create the first admin user
// This endpoint should be disabled after initial setup
import { queryOne, query } from '../../lib/db.js';
import { hashPassword, createErrorResponse, createSuccessResponse } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    const response = createErrorResponse(405, 'Method not allowed');
    res.status(response.status).json(JSON.parse(response.body));
    return;
  }

  try {
    // Check if any admin users already exist
    const existingUser = await queryOne('SELECT id FROM admin_users LIMIT 1');

    if (existingUser) {
      const response = createErrorResponse(403, 'Setup already completed. Admin user exists.');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      const response = createErrorResponse(400, 'Username and password are required');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      const response = createErrorResponse(400, 'Password must be at least 8 characters long');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin user
    const result = await query(
      'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, passwordHash]
    );

    const newUser = result.rows[0];

    // Return success response
    const response = createSuccessResponse({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        created_at: newUser.created_at
      }
    }, 201);

    res.status(response.status).json(JSON.parse(response.body));
  } catch (error) {
    console.error('Setup error:', error);
    const response = createErrorResponse(500, 'Internal server error');
    res.status(response.status).json(JSON.parse(response.body));
  }
}

