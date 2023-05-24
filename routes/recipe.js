const controllers = require('../controllers');
const express = require('express');
const verifyToken = require('../middlewares/verify_token');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *       properties:
 *         recipe_id:
 *           type: string
 *           description: The auto-generated id of the recipe
 *         ingredient_description:
 *           type: string
 *           description: The recipe ingredient_description
 *         implementation_guide:
 *           type: string
 *           description: The recipe implementation_guide
 *         food_id:
 *           type: string
 *           description: The recipe of food
 *         status:
 *           type: string
 *           description: The recipe status('Active', 'Deactive')
 */

/**
 * @swagger
 * /api/v1/recipes:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the list of all the recipes
 *     tags: [recipe-controller]
 *     parameters:
 *       - name: recipe_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Find recipe by recipe_name
 *       - name: food_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Find recipe by food_id
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
 *         description: Sort by (recipe_name/createdAt)
 *       - name: order[1]
 *         in: query
 *         schema:
 *           type: string
 *         description: Sort ASC/DESC
 *     responses:
 *       200:
 *         description: Get the list of the recipes successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", verifyToken, controllers.getAllRecipes);

/**
 * @swagger
 * /api/v1/recipes/{id}:
 *   get:
 *     security: 
 *         - BearerAuth: []
 *     summary: Returns the the recipe by id
 *     tags: [recipe-controller]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: string
 *         description: Find recipe by recipe_id
 *     responses:
 *       200:
 *         description: For get the recipe by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/:id", verifyToken, controllers.getRecipeById);

/**
 * @swagger
 * /api/v1/recipes:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create new recipe
 *     tags: [recipe-controller]
 *     requestBody:
 *       content:
 *         application/json: 
 *           schema:            
 *             type: object
 *             properties:      
 *               ingredient_description:            
 *                 type: string
 *                 example: |
 *                   1. Bột Gia Vị Canh Chua Chay CookyMADE 90g 
 *                   2. Đậu Hũ Ta Vị Nguyên 280g 
 *                   3. Rau Nấu Canh Chua (Cà Chua, Đậu Bắp, Thơm, Bạc Hà, Giá, Hành Tím, Tỏi, Ngò Om, Ngò Gai, Ớt,...) 395g 
 *                   4. (Lựa chọn) +Me Chua Vắt Hộp 60g 
 *                   5. (Lựa chọn) +Bún Tươi Sợi Nhỏ Ba Khánh 500g 
 *               implementation_guide:             
 *                 type: string
 *                 format: string
 *                 example: |
 *                   Bước 1: 
 *                   Rửa sạch các nguyên liệu đã sơ chế, để ráo nước. Rau om, ngò gai cắt nhỏ, cà chua cắt múi cau.Bắp cải bào mỏng hoặc thái thành khối tùy thích. Đậu hũ trắng cắt miếng nhỏ vừa ăn. 
 *                   Bước 2: 
 *                   Bật bếp lên cho 2 thìa canh dầu ăn vào nồi, đợi dầu nóng cho thơm và cà chua vào đảo nhẹ 1 phút để lấy màu sắc cho canh. Rót 750ml nước lọc vào nồi đun sôi, sau đó cho đậu hũ vào nấu 5 - 7 phút.
 *                   Bước 3: 
 *                   Tiếp đến, thêm bắp cải, đậu bắp, bạc hà và giá vào nấu tiếp 3 - 4 phút nữa. Từ từ cho gói gia vị hoàn chỉnh món canh chua chay vào khuấy đều. Cho rau om, ngò gai, tỏi phi lên mặt, nêm nếm lại cho vừa ăn rồi tắt bếp. 
 *                   Bí quyết: Thêm nước mắm làm dậy mùi thơm và canh thêm đậm đà 
 *                   Bước 4: 
 *                   Bày món ăn ra tô và thưởng thức. Ngon hơn khi ăn nóng cùng cơm trắng, chấm kèm nước mắm ớt chay.
 *               food_id:            
 *                 type: string
 *                 format: uuid
 *                 example:
 *                   c2020fb8-de08-472d-902e-450191968513
 *     responses:
 *       200:
 *         description: Create new recipe successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.post("/", verifyToken, controllers.createRecipe);

/**
 * @swagger
 * /api/v1/recipes:
 *   put:
 *     security: 
 *         - BearerAuth: []
 *     summary: Update the recipe by id
 *     tags: [recipe-controller]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Recipe'
 *            example:
 *               recipe_id: 8c382e13-8620-460a-bd95-96b1152c1368
 *               ingredient_description: |
 *                   1. Bột Gia Vị Canh Chua Chay CookyMADE 90g 
 *                   2. Đậu Hũ Ta Vị Nguyên 280g 
 *                   3. Rau Nấu Canh Chua (Cà Chua, Đậu Bắp, Thơm, Bạc Hà, Giá, Hành Tím, Tỏi, Ngò Om, Ngò Gai, Ớt,...) 395g 
 *                   4. (Lựa chọn) +Me Chua Vắt Hộp 60g 
 *                   5. (Lựa chọn) +Bún Tươi Sợi Nhỏ Ba Khánh 500g
 *               implementation_guide: |
 *                   Bước 1:
 *                   Rửa sạch các nguyên liệu đã sơ chế, để ráo nước. Rau om, ngò gai cắt nhỏ, cà chua cắt múi cau.Bắp cải bào mỏng hoặc thái thành khối tùy thích. Đậu hũ trắng cắt miếng nhỏ vừa ăn. 
 *                   Bước 2: 
 *                   Bật bếp lên cho 2 thìa canh dầu ăn vào nồi, đợi dầu nóng cho thơm và cà chua vào đảo nhẹ 1 phút để lấy màu sắc cho canh. Rót 750ml nước lọc vào nồi đun sôi, sau đó cho đậu hũ vào nấu 5 - 7 phút. 
 *                   Bước 3: 
 *                   Tiếp đến, thêm bắp cải, đậu bắp, bạc hà và giá vào nấu tiếp 3 - 4 phút nữa. Từ từ cho gói gia vị hoàn chỉnh món canh chua chay vào khuấy đều. Cho rau om, ngò gai, tỏi phi lên mặt, nêm nếm lại cho vừa ăn rồi tắt bếp. 
 *                   Bí quyết: Thêm nước mắm làm dậy mùi thơm và canh thêm đậm đà 
 *                   Bước 4: 
 *                   Bày món ăn ra tô và thưởng thức. Ngon hơn khi ăn nóng cùng cơm trắng, chấm kèm nước mắm ớt chay.
 *               food_id: c2020fb8-de08-472d-902e-450191968513
 *               status: Active
 *     responses:
 *       200:
 *         description: For update the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.put("/", verifyToken, controllers.updateRecipe);

/**
 * @swagger
 * /api/v1/recipes/delete:
 *   delete:
 *     security: 
 *         - BearerAuth: []
 *     summary: Delete the recipes by id
 *     tags: [recipe-controller]
 *     parameters:
 *       - name: recipe_ids[0]
 *         in: query
 *         schema:
 *           type: string
 *         description: Input recipe_id to delete
 *     responses:
 *       200:
 *         description: Delete the recipes by id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.delete("/delete", verifyToken, controllers.deleteRecipe);

module.exports = router;
