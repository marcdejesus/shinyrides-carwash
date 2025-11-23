// Packages API - GET all packages and POST new package
import { queryAll, query } from '../../lib/db.js';
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

  try {
    // GET - Fetch all packages (public endpoint)
    if (req.method === 'GET') {
      const packages = await queryAll(
        'SELECT * FROM packages ORDER BY display_order ASC, id ASC'
      );

      const response = createSuccessResponse({
        success: true,
        packages
      });

      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // POST - Create new package (authenticated)
    if (req.method === 'POST') {
      // Authenticate request
      const user = authenticateRequest(req);

      if (!user) {
        const response = createErrorResponse(401, 'Unauthorized');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      const { name, price, membership_price, description, features, subscription_url, display_order, is_featured } = req.body;

      // Validate required fields
      if (!name || price === undefined || membership_price === undefined) {
        const response = createErrorResponse(400, 'Name, price, and membership_price are required');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      // Validate price values
      if (isNaN(price) || isNaN(membership_price) || price < 0 || membership_price < 0) {
        const response = createErrorResponse(400, 'Price values must be valid positive numbers');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      // Insert new package
      const result = await query(
        `INSERT INTO packages 
        (name, price, membership_price, description, features, subscription_url, display_order, is_featured) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [
          name,
          price,
          membership_price,
          description || '',
          JSON.stringify(features || []),
          subscription_url || '',
          display_order || 0,
          is_featured || false
        ]
      );

      const newPackage = result.rows[0];

      const response = createSuccessResponse({
        success: true,
        message: 'Package created successfully',
        package: newPackage
      }, 201);

      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Method not allowed
    const response = createErrorResponse(405, 'Method not allowed');
    res.status(response.status).json(JSON.parse(response.body));
  } catch (error) {
    console.error('Packages API error:', error);
    const response = createErrorResponse(500, 'Internal server error');
    res.status(response.status).json(JSON.parse(response.body));
  }
}

