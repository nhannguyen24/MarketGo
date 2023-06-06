const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Guild_step:
 *       type: object
 *       required:
 *       properties:
 *         step_id:
 *           type: string
 *           description: The auto-generated id of the step
 *         implement_guild:
 *           type: string
 *           description: The step guild
 *         food_id:
 *           type: string
 *           description: The step to cook food
 *         status:
 *           type: string
 *           description: The step status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/steps:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create new step
 *     tags: [step-controller]
 *     requestBody:
 *       content:
 *          application/json:
 *            schema:                     
 *                  example:
 *                    step:
 *                      - implementation_guide: Đậu hũ cắt miếng chiên vàng các mặt. Nấm thái mỏng. Cà tím thái miếng mỏng vừa rồi nướng chín.
 *                        images:
 *                          - image: string
 *                          - image: string
 *                        food_id: bf7b9c01-a840-4c2e-9b2b-3071ff6ede92
 *     responses:
 *       200:
 *         description: Create new step successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 */
router.post("/", verifyToken, controllers.createStep);

/**
 * @swagger
 * /api/v1/steps:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the step by id
 *     tags: [step-controller]
 *     requestBody:
 *       content:
 *          application/json:
 *            schema:                     
 *                  example:
 *                    step_id: 6f77daee-a808-41b2-b65a-7e652c6cdc3e
 *                    implementation_guide: Đậu hũ cắt miếng chiên vàng các mặt. Nấm thái mỏng. Cà tím thái miếng mỏng vừa rồi nướng chín.
 *                    images:
 *                          - image: string
 *                          - image: string
 *                    food_id: bf7b9c01-a840-4c2e-9b2b-3071ff6ede92
 *                    status: Active
 *     responses:
 *       200:
 *         description: For update the step
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 */
router.put("/", verifyToken, controllers.updateStep);

/**
 * @swagger
 * /api/v1/steps/delete:
 *   delete:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the steps by id
 *     tags: [step-controller]
 *     parameters:
 *       - name: step_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input step_id to delete
 *     responses:
 *       200:
 *         description: Delete the steps by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 */
router.delete("/delete", verifyToken, controllers.deleteStep);

module.exports = router;
