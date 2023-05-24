const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const {isAdminOrSeller} = require('../middlewares/verify_role');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *       properties:
 *         cate_id:
 *           type: string
 *           description: The auto-generated id of the category
 *         cate_name:
 *           type: string
 *           description: The category name
 *         status:
 *           type: string
 *           description: The category status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the categories
 *     tags: [category-controller]
 *     parameters:
 *       - name: cate_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find category by cate_name
 *     responses:
 *       200:
 *         description: Get the list of the categories successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", verifyToken, controllers.getAllCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the category by id
 *     tags: [category-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find category by category_id
 *     responses:
 *       200:
 *         description: Get the category by id successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/:id", verifyToken, controllers.getCategoryById);

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Create new category
 *     tags: [category-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *            example:
 *              cate_name: Thịt
 *     responses:
 *       200:
 *         description: Create new category successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'

 */
router.post("/", verifyToken, isAdminOrSeller, controllers.createCategory);

// /**
//  * @swagger
//  * /api/v1/categories:
//  *   put:
//  *     security: 
//  *         - BearerAuth: []
//  *     summary: Update the category by id
//  *     tags: [category-controller]
//  *     requestBody:
//  *        required: true
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/Category'
//  *            example:
//  *               category_id: 8c382e13-8620-460a-bd95-96b1152c1368
//  *               category_name: Hồ Chí Minh
//  *               status: Active
//  *     responses:
//  *       200:
//  *         description: Update the category successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Category'
//  */
// router.put("/", verifyToken, isAdmin, controllers.updateCategory);

// /**
//  * @swagger
//  * /api/v1/categories/delete:
//  *   put:
//  *     security: 
//  *         - BearerAuth: []
//  *     summary: Delete the categorys by id
//  *     tags: [category-controller]
//  *     parameters:
//  *       - name: category_ids[0]
//  *         in: query
//  *         schema:
//  *           type: string
//  *         description: Input category_id to delete
//  *     responses:
//  *       200:
//  *         description: Delete the categorys by id successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Category'
//  */
// router.put("/delete", verifyToken, isAdmin, controllers.deleteCategory);

module.exports = router;
