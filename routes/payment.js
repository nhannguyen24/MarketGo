require("dotenv").config();
const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const router = express.Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      Deliverable_stripe:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            example: "Project File Submition"
 *          price:
 *            type: integer
 *            example: 200000
 */

/**
 * @swagger
 * /api/v1/stripe/create-checkout-session:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Payment
 *     tags: [payment-controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_details:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Deliverable_stripe'
 *     responses:
 *       '200':
 *         description: Payment successfully
 *       '400':
 *         description: Invalid request data
 */
router.post('/create-checkout-session', controllers.payment);


module.exports = router;