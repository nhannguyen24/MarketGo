const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const {isAdmin} = require('../middlewares/verify_role');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         city_id:
 *           type: string
 *           description: The auto-generated id of the city
 *         city_name:
 *           type: string
 *           description: The city name
 *         status:
 *           type: string
 *           description: The city status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/cities:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the citys
 *     tags: [city-controller]
 *     parameters:
 *       - name: city_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find city by city_name
 *     responses:
 *       200:
 *         description: Get the list of the citys successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
router.get("/", verifyToken, controllers.getAllCities);

/**
 * @swagger
 * /api/v1/cities/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the city by id
 *     tags: [city-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find city by city_id
 *     responses:
 *       200:
 *         description: Get the city by id successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
router.get("/:id", verifyToken, controllers.getCityById);

/**
 * @swagger
 * /api/v1/cities:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Create new city
 *     tags: [city-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/City'
 *            example:
 *              city_name: Hồ Chí Minh
 *     responses:
 *       200:
 *         description: Create new city successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'

 */
router.post("/", verifyToken, isAdmin, controllers.createCity);

/**
 * @swagger
 * /api/v1/cities:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the city by id
 *     tags: [city-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/City'
 *            example:
 *               city_id: 8c382e13-8620-460a-bd95-96b1152c1368
 *               city_name: Hồ Chí Minh
 *               status: Active
 *     responses:
 *       200:
 *         description: Update the city successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
router.put("/", verifyToken, isAdmin, controllers.updateCity);

/**
 * @swagger
 * /api/v1/cities/delete:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the citys by id
 *     tags: [city-controller]
 *     parameters:
 *       - name: city_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input city_id to delete
 *     responses:
 *       200:
 *         description: Delete the citys by id successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
router.put("/delete", verifyToken, isAdmin, controllers.deleteCity);

module.exports = router;
