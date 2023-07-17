const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const {isAdmin} = require('../middlewares/verify_role');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *       properties:
 *         role_id:
 *           type: string
 *           description: The auto-generated id of the role
 *         role_name:
 *           type: string
 *           description: The role name
 *         status:
 *           type: string
 *           description: The role status("Active", "Deactive")
 */

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the roles
 *     tags: [role-controller]
 *     parameters:
 *       - name: role_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find role by role_name
 *     responses:
 *       200:
 *         description: Get the list of the roles successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get("/", controllers.getAllRoles);

module.exports = router;
