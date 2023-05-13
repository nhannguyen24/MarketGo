const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const verifyRole = require('../middlewares/verify_role');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         user_id:
 *           type: string
 *           description: The auto-generated id of the user
 *         user_name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         avatar:
 *           type: string
 *           description: The user avatar
 *         status:
 *           type: string
 *           description: The user status("Active", "Deactive")
 *       example:
 *         user_id: V2sSC1HSLASNtTT0RhzwqDxxwri2
 *         user_name: Nhan Nguyen
 *         email: dnhan2426@gmail.com
 *         avatar: https://lh3.googleusercontent.com/a/AEdFTp4508ZdzGjVRFFIwb0ULZXYm5V5_vyRsiKq-cfA=s96-c
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the users
 *     tags: [user-controller]
 *     responses:
 *       200:
 *         description: For get the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", verifyToken, verifyRole, controllers.getAllUser);

/**
 * @swagger
 * /api/v1/users/paging:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the users paging
 *     tags: [user-controller]
 *     parameters:
 *       - name: user_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find user by user_name
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
 *         description: Sort by (user_name/createdAt)
 *       - name: order[1]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort ASC/DESC
 *     responses:
 *       200:
 *         description: For get the list of the users paging
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/paging/", verifyToken, verifyRole, controllers.getAllUserPaging);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the users by id
 *     tags: [user-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find user by user_id
 *     responses:
 *       200:
 *         description: For get the users by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/:id", verifyToken, controllers.getUserById);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Create new user
 *     tags: [user-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example:
 *              user_name: Nhan
 *              email: abc@gmail.com
 *              password: "123123"
 *              avatar: https://cdn-icons-png.flaticon.com/512/147/147144.png
 *              role_id: 58c10546-5d71-47a6-842e-84f5d2f72ec3
 *     responses:
 *       200:
 *         description: Create new users successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'

 */
router.post("/", verifyToken, verifyRole, controllers.createUser);

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the user by id
 *     tags: [user-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example:
 *              user_id: V2sSC1HSLASNtTT0RhzwqDxxwri2
 *              user_name: Nhan Nguyen
 *              avatar: https://lh3.googleusercontent.com/a/AEdFTp4508ZdzGjVRFFIwb0ULZXYm5V5_vyRsiKq-cfA=s96-c
 *              birthday: 2003-03-18 
 *              phone: "0898149847"
 *              address: 1/1 D1 HCM
 *              role_id: bd86e723-a2d5-47f5-87f2-9a4bc6fe8bb2
 *              status: Active
 *     responses:
 *       200:
 *         description: For get the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.put("/", verifyToken, verifyRole, controllers.updateUser);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the profile
 *     tags: [user-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *            example:
 *              user_id: V2sSC1HSLASNtTT0RhzwqDxxwri2
 *              user_name: Nhan Nguyen
 *              avatar: https://lh3.googleusercontent.com/a/AEdFTp4508ZdzGjVRFFIwb0ULZXYm5V5_vyRsiKq-cfA=s96-c
 *              birthday: 2003-03-18 
 *              phone: "0898149847"
 *              address: 1/1 D1 HCM
 *     responses:
 *       200:
 *         description: For get the list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.put("/profile/", verifyToken, controllers.updateProfile);

/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the users by id
 *     tags: [user-controller]
 *     parameters:
 *       - name: user_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input user_id to delete
 *     responses:
 *       200:
 *         description: Delete the user by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.delete("/delete", verifyToken, verifyRole, controllers.deleteUser);

module.exports = router;
