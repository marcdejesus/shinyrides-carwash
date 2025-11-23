// Login endpoint for admin authentication
import { queryOne } from '../../lib/db.js';
import { comparePassword, generateToken, createErrorResponse, createSuccessResponse } from '../../lib/auth.js';

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
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      const response = createErrorResponse(400, 'Username and password are required');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Find user in database
    const user = await queryOne(
      'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
      [username]
    );

    if (!user) {
      const response = createErrorResponse(401, 'Invalid credentials');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      const response = createErrorResponse(401, 'Invalid credentials');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username
    });

    // Return success response with token
    const response = createSuccessResponse({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

    res.status(response.status).json(JSON.parse(response.body));
  } catch (error) {
    console.error('Login error:', error);
    const response = createErrorResponse(500, 'Internal server error');
    res.status(response.status).json(JSON.parse(response.body));
  }
}

