const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const {isAdminOrSeller} = require('../middlewares/verify_role');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *       properties:
 *         store_id:
 *           type: string
 *           description: The auto-generated id of the store
 *         store_name:
 *           type: string
 *           description: The store name
 *         address:
 *           type: string
 *           description: The store address
 *         user_id:
 *           type: string
 *           description: The manager of store 
 *         city_id:
 *           type: string
 *           description: The city of store 
 *         status:
 *           type: string
 *           description: The store status("Active", "Deactive")
 */

/**
 * @swagger
 * /api/v1/stores:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the stores paging
 *     tags: [store-controller]
 *     parameters:
 *       - name: store_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find store by store_name
 *       - name: user_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find store by user_id
 *       - name: city_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find store by city_id
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
 *         description: Sort by (store_name/createdAt)
 *       - name: order[1]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort ASC/DESC
 *     responses:
 *       200:
 *         description: For get the list of the stores paging
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get("/", verifyToken, controllers.getAllStores);

/**
 * @swagger
 * /api/v1/stores/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the stores by id
 *     tags: [store-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find store by store_id
 *     responses:
 *       200:
 *         description: For get the stores by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get("/:id", verifyToken, controllers.getStoreById);

/**
 * @swagger
 * /api/v1/stores:
 *   post:
 *     security: 
 *         - BearerAuth: []
 *     summary: Create new store
 *     tags: [store-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Store'
 *            example:
 *              store_name: CookyMADE
 *              address: D2 Phan Xích Long
 *              city_id: 58c10546-5d71-47a6-842e-84f5d2f72ec3
 *              user_id: 58c10546-5d71-47a6-842e-84f5d2f72ec3
 *     responses:
 *       200:
 *         description: Create new stores successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.post("/", verifyToken, isAdminOrSeller, controllers.createStore);

/**
 * @swagger
 * /api/v1/stores:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the store by id
 *     tags: [store-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Store'
 *            example:
 *              store_id: V2sSC1HSLASNtTT0RhzwqDxxwri2
 *              store_name: CookyMADE
 *              address: D2 Phan Xích Long
 *              city_id: 58c10546-5d71-47a6-842e-84f5d2f72ec3
 *              user_id: 58c10546-5d71-47a6-842e-84f5d2f72ec3
 *              status: Active
 *     responses:
 *       200:
 *         description: Update new stores successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.put("/", verifyToken, isAdminOrSeller, controllers.updateStore);

/**
 * @swagger
 * /api/v1/stores/delete:
 *   delete:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the stores by id
 *     tags: [store-controller]
 *     parameters:
 *       - name: store_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input store_id to delete
 *     responses:
 *       200:
 *         description: Delete the store by id successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.delete("/delete", verifyToken, isAdminOrSeller, controllers.deleteStore);

module.exports = router;
