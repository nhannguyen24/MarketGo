const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const router = express.Router();
const {isAdminOrSeller} = require('../middlewares/verify_role');

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

/**
 * @swagger
 *  /api/v1/orders/admin:
 *      get:
 *          security: 
 *              - BearerAuth: []
 *          summary: Get orders with filter of date and store id
 *          description: Get orders for admin
 *          tags: [order-controller]
 *          parameters:
 *            - in: query
 *              name: page
 *              required: true
 *              schema:
 *                  type: integer
 *              description: Page number
 *              example:
 *                  1
 *            - in: query
 *              name: limit
 *              required: true
 *              schema:
 *                  type: integer
 *              description: Limit of orders in a page
 *              example:
 *                  15
 *            - in: query
 *              name: startDate
 *              schema:
 *                  type: string
 *              description: From Date
 *              example:
 *                  2023-06-20
 *            - in: query
 *              name: endDate
 *              schema:
 *                  type: string
 *              description: To Date
 *              example:
 *                  2023-07-01
 *            - in: query
 *              name: storeId
 *              schema:
 *                  type: string
 *              description: Store ID 
 *              example:
 *                  189b6058-6e24-439e-b14b-693b25f6a375
 *            - in: query
 *              name: sort
 *              schema:
 *                  type: string
 *              description: Sort with Ascending or Descending
 *              example:
 *                  ASC or DESC
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
router.get("/admin", verifyToken, controllers.getOrders);

module.exports = router;
