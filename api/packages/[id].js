// Packages API - GET, PUT, DELETE single package by ID
import { queryOne, query } from '../../lib/db.js';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract package ID from query
    const { id } = req.query;

    if (!id || isNaN(id)) {
      const response = createErrorResponse(400, 'Invalid package ID');
      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // GET - Fetch single package (public endpoint)
    if (req.method === 'GET') {
      const package_ = await queryOne(
        'SELECT * FROM packages WHERE id = $1',
        [id]
      );

      if (!package_) {
        const response = createErrorResponse(404, 'Package not found');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      const response = createSuccessResponse({
        success: true,
        package: package_
      });

      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // PUT - Update package (authenticated)
    if (req.method === 'PUT') {
      // Authenticate request
      const user = authenticateRequest(req);

      if (!user) {
        const response = createErrorResponse(401, 'Unauthorized');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      // Check if package exists
      const existingPackage = await queryOne(
        'SELECT id FROM packages WHERE id = $1',
        [id]
      );

      if (!existingPackage) {
        const response = createErrorResponse(404, 'Package not found');
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

      // Update package
      const result = await query(
        `UPDATE packages 
        SET name = $1, price = $2, membership_price = $3, description = $4, 
            features = $5, subscription_url = $6, display_order = $7, is_featured = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9 
        RETURNING *`,
        [
          name,
          price,
          membership_price,
          description || '',
          JSON.stringify(features || []),
          subscription_url || '',
          display_order !== undefined ? display_order : 0,
          is_featured !== undefined ? is_featured : false,
          id
        ]
      );

      const updatedPackage = result.rows[0];

      const response = createSuccessResponse({
        success: true,
        message: 'Package updated successfully',
        package: updatedPackage
      });

      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // DELETE - Delete package (authenticated)
    if (req.method === 'DELETE') {
      // Authenticate request
      const user = authenticateRequest(req);

      if (!user) {
        const response = createErrorResponse(401, 'Unauthorized');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      // Check if package exists
      const existingPackage = await queryOne(
        'SELECT id, name FROM packages WHERE id = $1',
        [id]
      );

      if (!existingPackage) {
        const response = createErrorResponse(404, 'Package not found');
        res.status(response.status).json(JSON.parse(response.body));
        return;
      }

      // Delete package
      await query('DELETE FROM packages WHERE id = $1', [id]);

      const response = createSuccessResponse({
        success: true,
        message: 'Package deleted successfully',
        deleted: {
          id: existingPackage.id,
          name: existingPackage.name
        }
      });

      res.status(response.status).json(JSON.parse(response.body));
      return;
    }

    // Method not allowed
    const response = createErrorResponse(405, 'Method not allowed');
    res.status(response.status).json(JSON.parse(response.body));
  } catch (error) {
    console.error('Package API error:', error);
    const response = createErrorResponse(500, 'Internal server error');
    res.status(response.status).json(JSON.parse(response.body));
  }
}

