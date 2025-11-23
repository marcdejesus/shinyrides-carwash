// Verify JWT token endpoint
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    const response = createErrorResponse(405, 'Method not allowed');
    res.status(response.status).json(JSON.parse(response.body));
    return;
  }

  try {
    // Authenticate request
    const user = authenticateRequest(req);

    if (!user) {
      const response = createErrorResponse(401, 'Invalid or expired token');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Return user info
    const response = createSuccessResponse({
      success: true,
      user: {
        id: user.id,
        username: user.username
      }
    });

    res.status(response.status).json(JSON.parse(response.body));
  } catch (error) {
    console.error('Token verification error:', error);
    const response = createErrorResponse(500, 'Internal server error');
    res.status(response.status).json(JSON.parse(response.body));
  }
}

