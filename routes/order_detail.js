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
 *           type: integer
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
 *     summary: Create cart order
 *     description: Create a new cart order 
 *     tags: [order-detail-controller]
 *     responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                  application/json:
 *                      schema:
 *                              type: object
 *     requestBody:
 *        required: true
 *        description: User email and List of Order Details
 *        content:
 *          application/json: 
 *            schema:
 *              properties:
 *                  userId:
 *                      type: string
 *                      format: uuid
 *                  totalPrice:
 *                      type: double
 *                  orderDetails:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/OrderDetail'
 *  
 *            example:
 *              {
 *                  "userId": "3a767297-1bf9-4734-8e60-668331e02672",
 *                  "totalPrice": 152000.0,
 *                  "orderDetails": [
 *                      {
 *                          order_detail_id: "",
 *                          order: {},
 *                          ingredient: {
 *                              ingredient_id:  "937a3a3d-ccc1-4155-a2c6-956b5c5dca48",
 *                              ingredient_name: "Cá mú",
 *                              description: "Đồ tươi",
 *                              price: 20000,
 *                              quantitative: "200 g",
 *                              quantity: 20,
 *                              store: {},
 *                              promotion: {},
 *                              cate_detail: {},
 *                              status: "Active",
 *                          },
 *                          price: 32000,
 *                          quantity: 1,
 *                          status: "Active"
 *                      },
 *                      {
 *                          order_detail_id: "",
 *                          order: {},
 *                          ingredient: {
 *                              ingredient_id:  "77a76f11-1649-4c84-ad69-bab1cdc6161f",
 *                              ingredient_name: "Cà chua",
 *                              description: "Đồ tươi",
 *                              price: 20000,
 *                              quantitative: "200 g",
 *                              quantity: 20,
 *                              store: {},
 *                              promotion: {},
 *                              cate_detail: {},
 *                              status: "Active",
 *                          },
 *                          price: 15000,
 *                          quantity: 1,
 *                          status: "Active"
 *                      }
 *                  ] 
 *              }
 */
router.post("/", verifyToken, controllers.createOrderDetail);


/**
 * @swagger
 *  /api/v1/order-detail:
 *      get:
 *          security: 
 *              - BearerAuth: []
 *          summary: Get order detail with order id
 *          description: Return an array of OrderDetail of orderId
 *          tags: [order-detail-controller]
 *          parameters:
 *            - in: query
 *              name: orderId
 *              schema:
 *                  type: string
 *              required: true
 *              description: Order ID
 *              example:
 *                  b1c7fff4-4cc5-413e-aaa0-8c0641a0a327
 *          responses:
 *              200:
 *                  description: Order detail found!
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/OrderDetail'
 * */
router.get("/", verifyToken, controllers.getOrderDetailsByOrderId);


module.exports = router;