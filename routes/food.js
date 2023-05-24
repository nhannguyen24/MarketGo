const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const {uploadFile} = require('../middlewares/firebase_service')
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Food:
 *       type: object
 *       required:
 *       properties:
 *         food_id:
 *           type: string
 *           description: The auto-generated id of the food
 *         food_name:
 *           type: string
 *           description: The food name
 *         description:
 *           type: string
 *           description: The food description
 *         image:
 *           type: string
 *           description: The food image
 *         price:
 *           type: number
 *           description: The food price
 *         quantity:
 *           type: number
 *           description: The food quantity
 *         quantitative:
 *           type: number
 *           description: The food quantitative
 *         store_id:
 *           type: string
 *           description: The store which has food 
 *         promotion_id:
 *           type: string
 *           description: The food promotion
 *         cate_detail_id:
 *           type: string
 *           description: The food category
 *         status:
 *           type: string
 *           description: The food status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/foods:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the foods
 *     tags: [food-controller]
 *     parameters:
 *       - name: food_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find food by food_name
 *       - name: store_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find food by store_id
 *       - name: promotion_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find food by promotion_id
 *       - name: cate_detail_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find food by cate_detail_id
 *       - name: page
 *         in: query
 *         schema:
 *           type: int
 *         description: Paging page number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: int
 *         description: Paging limit row to get in 1 page
 *       - name: order[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort by (food_name/createdAt)
 *       - name: order[1]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort ASC/DESC
 *     responses:
 *       200:
 *         description: Get the list of the foods successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.get("/", verifyToken, controllers.getAllFoods);

/**
 * @swagger
 * /api/v1/foods/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the food by id
 *     tags: [food-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find food by food_id
 *     responses:
 *       200:
 *         description: For get the food by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.get("/:id", verifyToken, controllers.getFoodById);

/**
 * @swagger
 * /api/v1/foods:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create new food
 *     tags: [food-controller]
 *     requestBody:
 *       content:
 *         multipart/form-data: 
 *           schema:            
 *             type: object
 *             properties:      
 *               food_name:            
 *                 type: string
 *                 example:
 *                   Cà chua
 *               description:             
 *                 type: string
 *                 format: string
 *                 example:
 *                   Đồ tươi
 *               price:            
 *                 type: number
 *                 format: number
 *                 example:
 *                   20000
 *               quantity:            
 *                 type: number
 *                 format: number
 *                 example:
 *                   20
 *               quantitative:            
 *                 type: string
 *                 format: string
 *                 example:
 *                   2 người
 *               store_id:            
 *                 type: string
 *                 format: uuid
 *                 example:
 *                   c5aca043-dfd6-47ae-a8ad-5fbf830c295e
 *               promotion_id:            
 *                 type: string
 *                 format: uuid
 *                 example:
 *                   9a3dbef2-a705-45aa-9dcd-b23b3d7c12f9
 *               cate_detail_id:            
 *                 type: string
 *                 format: uuid
 *                 example:
 *                   9a3dbef2-a705-45aa-9dcd-b23b3d7c12f9
 *               files:  
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: Create new food successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.post("/", uploadFile, controllers.createFood);

/**
 * @swagger
 * /api/v1/foods:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the food by id
 *     tags: [food-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Food'
 *            example:
 *               food_id: 8c382e13-8620-460a-bd95-96b1152c1368
 *               food_name: Football Field Booking Management System
 *               description: The system to manage field of the field owner and the field booking schedule of customer in Ho Chi Minh city
 *               price: 20000
 *               quantity: 10
 *               quantitative: 2 người
 *               store_id: b84a02a8-1b39-4ebf-bc5b-4255df846818
 *               promotion_id: 9a3dbef2-a705-45aa-9dcd-b23b3d7c12f9
 *               cate_detail_id: 9a3dbef2-a705-45aa-9dcd-b23b3d7c12f9
 *               status: Active
 *     responses:
 *       200:
 *         description: For update the list of the foods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.put("/", verifyToken, controllers.updateFood);

/**
 * @swagger
 * /api/v1/foods/delete:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the foods by id
 *     tags: [food-controller]
 *     parameters:
 *       - name: food_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input food_id to delete
 *     responses:
 *       200:
 *         description: Delete the foods by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.put("/delete", verifyToken, controllers.deleteFood);

module.exports = router;
