const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const {uploadFile} = require('../middlewares/firebase_service');
const {isAdminOrSeller} = require('../middlewares/verify_role');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *       properties:
 *         ingredient_id:
 *           type: string
 *           description: The auto-generated id of the ingredient
 *         ingredient_name:
 *           type: string
 *           description: The ingredient name
 *         description:
 *           type: string
 *           description: The ingredient description
 *         image:
 *           type: string
 *           description: The ingredient image
 *         price:
 *           type: number
 *           description: The ingredient price
 *         quantity:
 *           type: number
 *           description: The ingredient quantity
 *         quantitative:
 *           type: number
 *           description: The ingredient quantitative
 *         store_id:
 *           type: string
 *           description: The store which has ingredient 
 *         promotion_id:
 *           type: string
 *           description: The ingredient promotion
 *         cate_detail_id:
 *           type: string
 *           description: The ingredient category
 *         status:
 *           type: string
 *           description: The ingredient status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/ingredients:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the ingredients
 *     tags: [ingredient-controller]
 *     parameters:
 *       - name: ingredient_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find ingredient by ingredient_name
 *       - name: store_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find ingredient by store_id
 *       - name: promotion_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find ingredient by promotion_id
 *       - name: cate_detail_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find ingredient by cate_detail_id
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
 *         description: Sort by (ingredient_name/createdAt)
 *       - name: order[1]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort ASC/DESC
 *     responses:
 *       200:
 *         description: Get the list of the ingredients successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.get("/", verifyToken, controllers.getAllIngredients);

/**
 * @swagger
 * /api/v1/ingredients/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the ingredient by id
 *     tags: [ingredient-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find ingredient by ingredient_id
 *     responses:
 *       200:
 *         description: For get the ingredient by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.get("/:id", verifyToken, controllers.getIngredientById);

/**
 * @swagger
 * /api/v1/ingredients:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create new ingredient
 *     tags: [ingredient-controller]
 *     requestBody:
 *       content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:   
 *                ingredient_name:            
 *                  type: string
 *                  format: string
 *                  example: Cà chua
 *                description:             
 *                  type: string
 *                  format: string
 *                  example: Đồ tươi
 *                price:            
 *                  type: number
 *                  format: number
 *                  example: 20000
 *                quantity:            
 *                  type: number
 *                  format: number
 *                  example: 20
 *                quantitative:            
 *                  type: string
 *                  format: string
 *                  example: 200 g
 *                store_id:            
 *                  type: string
 *                  format: uuid
 *                  example: c5aca043-dfd6-47ae-a8ad-5fbf830c295e
 *                cate_detail_id:            
 *                  type: string
 *                  format: uuid
 *                  example: d45e5fd1-cdc6-4b83-8365-d3cab24b0e10
 *                images:
 *                  type: array
 *                  items:
 *                    type: string
 *     responses:
 *       200:
 *         description: Create new ingredient successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.post("/", verifyToken, isAdminOrSeller, controllers.createIngredient);

/**
 * @swagger
 * /api/v1/ingredients:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the ingredient by id
 *     tags: [ingredient-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Ingredient'
 *            example:
 *               ingredient_id: 8c382e13-8620-460a-bd95-96b1152c1368
 *               ingredient_name: Football Field Booking Management System
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
 *         description: For update the ingredient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.put("/", verifyToken, isAdminOrSeller, controllers.updateIngredient);

/**
 * @swagger
 * /api/v1/ingredients/delete:
 *   delete:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the ingredients by id
 *     tags: [ingredient-controller]
 *     parameters:
 *       - name: ingredient_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input ingredient_id to delete
 *     responses:
 *       200:
 *         description: Delete the ingredients by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.delete("/delete", verifyToken, isAdminOrSeller, controllers.deleteIngredient);

module.exports = router;
