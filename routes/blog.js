const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
// const {isAdminOrSeller} = require('../middlewares/verify_role');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *       properties:
 *         blog_id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The blog title
 *         content:
 *           type: string
 *           description: The blog content
 *         image:
 *           type: string
 *           description: The blog image
 *         user_id:
 *           type: string
 *           description: The user who creates blog 
 *         status:
 *           type: string
 *           description: The blog status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the blogs
 *     tags: [blog-controller]
 *     parameters:
 *       - name: blog_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find blog by blog_name
 *       - name: user_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find blog by user_id
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
 *         description: Sort by (blog_name/createdAt)
 *       - name: order[1]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort ASC/DESC
 *     responses:
 *       200:
 *         description: Get the list of the blogs successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.get("/", verifyToken, controllers.getAllBlogs);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the blog by id
 *     tags: [blog-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find blog by blog_id
 *     responses:
 *       200:
 *         description: For get the blog by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.get("/:id", verifyToken, controllers.getBlogById);

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create new blog
 *     tags: [blog-controller]
 *     requestBody:
 *       content:
 *          application/json:
 *            schema:                     
 *                  example:
 *                    title: Tổng hợp Các loại bánh gạo Hàn Quốc ngon nhất
 *                    content: Bánh gạo Hàn Quốc là món ăn vặt truyền thống lâu đời của người Hàn Quốc. Loại bánh gạo mà chúng mình nói tới ở đây là tokbokki hay còn gọi tteokbokki. Hãy cùng Beemart tìm hiểu xem có bao nhiêu loại bánh gạo đang phổ biến ở Việt Nam được nhiều bạn trẻ yêu thích nhé!
 *                    image: https://s23209.pcdn.co/wp-content/uploads/2023/02/Honey-Fried-Chicken-and-Waffles_442-1024x1536.jpg
 *                    user_id: 7f1ea894-a12f-4ca0-b816-e4b0f28f6895
 *     responses:
 *       200:
 *         description: Create new blog successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.post("/", verifyToken, controllers.createBlog);

/**
 * @swagger
 * /api/v1/blogs:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the blog by id
 *     tags: [blog-controller]
 *     requestBody:
 *       content:
 *          application/json:
 *            schema:                     
 *                  example:
 *                    blog_id: 8c382e13-8620-460a-bd95-96b1152c1368
 *                    title: Tổng hợp Các loại bánh gạo Hàn Quốc ngon nhất
 *                    content: Bánh gạo Hàn Quốc là món ăn vặt truyền thống lâu đời của người Hàn Quốc. Loại bánh gạo mà chúng mình nói tới ở đây là tokbokki hay còn gọi tteokbokki. Hãy cùng Beemart tìm hiểu xem có bao nhiêu loại bánh gạo đang phổ biến ở Việt Nam được nhiều bạn trẻ yêu thích nhé!
 *                    image: https://s23209.pcdn.co/wp-content/uploads/2023/02/Honey-Fried-Chicken-and-Waffles_442-1024x1536.jpg
 *                    user_id: c5aca043-dfd6-47ae-a8ad-5fbf830c295e
 *     responses:
 *       200:
 *         description: For update the blog
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.put("/", verifyToken, controllers.updateBlog);

/**
 * @swagger
 * /api/v1/blogs/delete:
 *   delete:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the blogs by id
 *     tags: [blog-controller]
 *     parameters:
 *       - name: blog_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input blog_id to delete
 *     responses:
 *       200:
 *         description: Delete the blogs by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.delete("/delete", verifyToken, controllers.deleteBlog);

module.exports = router;
