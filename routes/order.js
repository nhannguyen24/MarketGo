const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         order_id:
 *           type: string
 *           description: The auto-generated id of the user
 *         total_price:
 *           type: integer
 *           description: The total price
 *         order_date:
 *           type: string
 *           format: date
 *           description: The order date
 *         user_id:
 *           type: string
 *           description: The user id of order
 *         status:
 *           type: string
 *           enum:
 *              - Active
 *              - Deactive
 *           description: The order detail status("Active", "Deactive")
 */

/**
 * @swagger
 *  /api/v1/orders:
 *      get:
 *          security: 
 *              - BearerAuth: []
 *          summary: Get orders by user ID
 *          description: Get orders with user ID
 *          tags: [order-controller]
 *          parameters:
 *            - in: query
 *              name: userId
 *              schema:
 *                  type: string
 *              required: true
 *              description: User ID
 *              example:
 *                  3a767297-1bf9-4734-8e60-668331e02672
 *          responses:
 *              200:
 *                  description: Orders found!
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Order'
 * */
router.get("/", verifyToken, controllers.getOrdersByUserId);

module.exports = router;
