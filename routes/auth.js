const controllers = require('../controllers');
const express = require('express');
const firebase_auth = require('../middlewares/verify_firebase_token');
const router = express.Router();
const verifyToken = require('../middlewares/verify_token');

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         refresh_token:
 *           type: String
 *           description: The auto-generated token
 */

/**
 * @swagger
 * /api/v1/auth/login-google:
 *   post:
 *     summary: For login with google returns the token
 *     security: 
 *         - BearerAuth: []
 *     tags: [auth-controller]
 *     responses:
 *       200:
 *         description: For login with google returns the token
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/login-google', firebase_auth, controllers.loginGoogle);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: For refresh new token
 *     security: 
 *         - BearerAuth: []
 *     tags: [auth-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Token'
 *            example:
 *              refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50X2lkIjoiVjJzU0MxSFNMQVNOdFRUMFJoendxRHh4d3JpMiIsImlhdCI6MTY3NjgyOTMzMiwiZXhwIjoxNjc3MjYxMzMyfQ.8LfwVJoW5hPcw1rR9-sOWlhQBT83xhQAYJXFUAE2Z9k
 *     responses:
 *       200:
 *         description: For refresh new token
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/refresh-token', controllers.refreshAccessToken);


/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: For logout
 *     security: 
 *         - BearerAuth: []
 *     tags: [auth-controller]
 *     parameters:
 *       - name: user_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Input user_id to logout
 *     responses:
 *       200:
 *         description: For logout
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/logout', verifyToken, controllers.logout);

/**
 * @swagger
 * components:
 *   schemas:
 *     User-login:
 *       type: object
 *       properties:
 *         email:
 *           type: String
 *           description: User email
 *         password:
 *           type: String
 *           description: User password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User-register:
 *       type: object
 *       properties:
 *         email:
 *           type: String
 *           description: User email
 *         password:
 *           type: String
 *           description: User password
 *         confirm_pass:
 *           type: String
 *           description: User confirm_pass
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: For login 
 *     tags: [auth-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User-login'
 *            example:
 *              email: a@gmail.com
 *              password: "1"
 *     responses:
 *       200:
 *         description: For login 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/login', controllers.login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: For register new account
 *     tags: [auth-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User-register'
 *            example:
 *              email: dnhan2426@gmail.com
 *              password: "123456"
 *              confirm_pass: "123456"
 *              role_id: 58c10546-5d71-47a6-842e-84f5d2f72ec3
 *     responses:
 *       200:
 *         description: For register new account
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post('/register', controllers.register);

module.exports = router;
