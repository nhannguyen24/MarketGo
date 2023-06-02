const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetail:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         order_detail_id:
 *           type: string
 *           description: The auto-generated id of the user
 *         order:
 *           type: object
 *           description: The Order Object
 *         ingredient:
 *           type: object
 *           description: The Ingredient Object
 *         price:
 *           type: double
 *           description: The price
 *         quantity:
 *           type: integer
 *           description: The quantity
 *         status:
 *           type: string
 *           enum:
 *              - Active
 *              - Deactive
 *           description: The order detail status("Active", "Deactive")
 */

/**
 * @swagger
 * /api/v1/order-detail:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Create order
 *     description: Create a new order with a map of order details
 *     tags: [order-detail-controller]
 *     requestBody:
 *        required: true
 *        description: Map of order details
 *        content:
 *          application/json: 
 *            schema:
 *              properties:
 *                  email:
 *                      type: string
 *                  OrderDetails:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/OrderDetail'
 *  
 *            example:
 *              {
 *                  "OrderDetails": [
 *                      {
 *                          order_detail_id: "",
 *                          order: {},
 *                          ingredient: {},
 *                          price: 32000,
 *                          quantity: 10,
 *                          status: "Active"
 *                      },
 *                  ] 
 *              }
 */
router.post("/", verifyToken, controllers.createOrderDetail);

module.exports = router;