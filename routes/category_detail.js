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
 *         cate_detail_id:
 *           type: string
 *           description: The auto-generated id of the category_detail
 *         cate_detail_name:
 *           type: string
 *           description: The category_detail name
 *         cate_id:
 *           type: string
 *           description: The cate_id that category_detail belong to
 *         status:
 *           type: string
 *           description: The category_detail status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/categories_detail:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the categories
 *     tags: [category-detail-controller]
 *     parameters:
 *       - name: cate_detail_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find category_detail by cate_detail_name
 *       - name: cate_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find category_detail by cate_id
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
router.get("/", verifyToken, controllers.getAllCategoryDetail);

/**
 * @swagger
 * /api/v1/categories_detail/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the category_detail by id
 *     tags: [category-detail-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find category_detail by cate_detail_id
 *     responses:
 *       200:
 *         description: Get the category_detail by id successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/:id", verifyToken, controllers.getCategoryDetailById);

/**
 * @swagger
 * /api/v1/categories_detail:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Create new category_detail
 *     tags: [category-detail-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *            example:
 *              cate_detail_name: Ức
 *              cate_id: 7c3c3ba4-db32-4d33-937a-35d6b4ed4560
 *     responses:
 *       200:
 *         description: Create new category_detail successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'

 */
router.post("/", verifyToken, isAdminOrSeller, controllers.createCategoryDetail);

// /**
//  * @swagger
//  * /api/v1/categories_detail:
//  *   put:
//  *     security: 
//  *         - BearerAuth: []
//  *     summary: Update the category_detail by id
//  *     tags: [category-detail-controller]
//  *     requestBody:
//  *        required: true
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/Category'
//  *            example:
//  *               cate_detail_id: 8c382e13-8620-460a-bd95-96b1152c1368
//  *               cate_detail_name: Hồ Chí Minh
//  *               status: Active
//  *     responses:
//  *       200:
//  *         description: Update the category_detail successfully
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
//  * /api/v1/categories_detail/delete:
//  *   put:
//  *     security: 
//  *         - BearerAuth: []
//  *     summary: Delete the category_details by id
//  *     tags: [category-detail-controller]
//  *     parameters:
//  *       - name: cate_detail_ids[0]
//  *         in: query
//  *         schema:
//  *           type: string
//  *         description: Input cate_detail_id to delete
//  *     responses:
//  *       200:
//  *         description: Delete the category_details by id successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Category'
//  */
// router.put("/delete", verifyToken, isAdmin, controllers.deleteCategory);

module.exports = router;
