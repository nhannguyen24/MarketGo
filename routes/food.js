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
 *         quantitative:
 *           type: number
 *           description: The food quantitative
 *         user_id:
 *           type: string
 *           description: The user which has food 
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
 *       - name: user_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find food by user_id
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
 *                   Canh Chua Chay
 *               description:             
 *                 type: string
 *                 format: string
 *                 example:
 *                   Đã bao giờ bạn chờ mong đến ngày rằm hằng tháng, ghé qua chùa ăn bữa cơm chay với tô Canh chua nóng hổi nghi ngút khói? Ắt hẳn tuổi thơ bạn đã từng ít nhất một lần như thế đúng không. Thôi thì, ăn "chùa" mãi cũng ngại, hay là, mình thử đặt hàng Pack nguyên liệu sơ chế Canh chua chay về trổ tài chiêu đãi cả nhà, sẵn dịp ôn lại tí kỷ niệm xưa nhé.
 *               quantitative:            
 *                 type: string
 *                 format: string
 *                 example:
 *                   2 người
 *               user_id:            
 *                 type: string
 *                 format: uuid
 *                 example:
 *                   c2020fb8-de08-472d-902e-450191968513
 *               cate_detail_id:            
 *                 type: string
 *                 format: uuid
 *                 example:
 *                   d45e5fd1-cdc6-4b83-8365-d3cab24b0e10
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
router.post("/", verifyToken, uploadFile, controllers.createFood);

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
 *               food_name: Canh Chua Chay
 *               description: Đã bao giờ bạn chờ mong đến ngày rằm hằng tháng, ghé qua chùa ăn bữa cơm chay với tô Canh chua nóng hổi nghi ngút khói? Ắt hẳn tuổi thơ bạn đã từng ít nhất một lần như thế đúng không. Thôi thì, ăn "chùa" mãi cũng ngại, hay là, mình thử đặt hàng Pack nguyên liệu sơ chế Canh chua chay về trổ tài chiêu đãi cả nhà, sẵn dịp ôn lại tí kỷ niệm xưa nhé.
 *               quantitative: 2 người
 *               user_id: c2020fb8-de08-472d-902e-450191968513
 *               cate_detail_id: d45e5fd1-cdc6-4b83-8365-d3cab24b0e10
 *               status: Active
 *     responses:
 *       200:
 *         description: For update the food
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
 *   delete:
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
router.delete("/delete", verifyToken, controllers.deleteFood);

module.exports = router;
