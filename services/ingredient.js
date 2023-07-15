const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllIngredients = (
    { page, limit, order, ingredient_name, store_id, promotion_id, cate_detail_id, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`ingredients_${page}_${limit}_${order}_${ingredient_name}_${store_id}_${promotion_id}_${cate_detail_id}`, async (error, ingredient) => {
                if (error) console.error(error);
                if (ingredient != null && ingredient != "" && role_name != 'Admin') {
                    resolve({
                        msg: "Got ingredients",
                        ingredients: JSON.parse(ingredient),
                    });
                } else {
                    redisClient.get(`admin_ingredients_${page}_${limit}_${order}_${ingredient_name}_${store_id}_${promotion_id}_${cate_detail_id}`, async (error, adminIngredient) => {
                        if (adminIngredient != null && adminIngredient != "") {
                            resolve({
                                msg: "Got ingredients",
                                ingredients: JSON.parse(adminIngredient),
                            });
                        } else {
                            const queries = { nest: true };
                            const offset = !page || +page <= 1 ? 0 : +page - 1;
                            const flimit = +limit || +process.env.LIMIT_POST;
                            queries.offset = offset * flimit;
                            queries.limit = flimit;
                            if (order) queries.order = [order];
                            else queries.order = [['updatedAt', 'DESC']];
                            if (ingredient_name) query.ingredient_name = { [Op.substring]: ingredient_name };
                            if (store_id) query.store_id = { [Op.eq]: store_id };
                            if (promotion_id) query.promotion_id = { [Op.eq]: promotion_id };
                            if (cate_detail_id) query.cate_detail_id = { [Op.eq]: cate_detail_id };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const ingredients = await db.Ingredient.findAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["store_id", "promotion_id", "cate_detail_id"],
                                },
                                include: [
                                    {
                                        model: db.Store,
                                        as: "ingredient_store",
                                        attributes: ["store_id", "store_name", "address"],
                                        include: [
                                            {
                                                model: db.User,
                                                as: "store_user",
                                            },
                                            {
                                                model: db.City,
                                                as: "store_city",
                                            }
                                        ]
                                    },
                                    {
                                        model: db.Category_detail,
                                        as: "ingredient_cate_detail",
                                        attributes: {
                                            exclude: [
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                    },
                                    {
                                        model: db.Image,
                                        as: "ingredient_image",
                                        attributes: {
                                            exclude: [
                                                "step_id",
                                                "ingredient_id",
                                                "food_id",
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                    },
                                ],
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`ingredients_${page}_${limit}_${order}_${ingredient_name}_${store_id}_${promotion_id}_${cate_detail_id}`, 3600, JSON.stringify(ingredients));
                            } else {
                                redisClient.setEx(`admin_ingredients_${page}_${limit}_${order}_${ingredient_name}_${store_id}_${promotion_id}_${cate_detail_id}`, 3600, JSON.stringify(ingredients));
                            }
                            resolve({
                                msg: ingredients ? "Got ingredients" : "Cannot find ingredients",
                                ingredients: ingredients,
                            });
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });


const createIngredient = ({ images, ingredient_name, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {

            const ingredient = await db.Ingredient.findOrCreate({
                where: {
                    ingredient_name: ingredient_name
                },
                defaults: {
                    ingredient_name: ingredient_name,
                    ...body,
                },
            });

            const createImagePromises = images.map(async ({image}) => {
                await db.Image.create({
                    image: image,
                    ingredient_id: ingredient[0].ingredient_id,
                });
            });

            await Promise.all(createImagePromises);

            resolve({
                msg: ingredient[1]
                    ? "Create new ingredient successfully"
                    : "Cannot create new ingredient/Ingredient already exists",
            });

            redisClient.keys('*ingredients_*', (error, keys) => {
                if (error) {
                    console.error('Error retrieving keys:', error);
                    return;
                }
                // Delete each key individually
                keys.forEach((key) => {
                    redisClient.del(key, (deleteError, reply) => {
                        if (deleteError) {
                            console.error(`Error deleting key ${key}:`, deleteError);
                        } else {
                            console.log(`Key ${key} deleted successfully`);
                        }
                    });
                });
            });

        } catch (error) {
            reject(error);
        }
    });

const updateIngredient = ({ images, ingredient_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const ingredient = await db.Ingredient.findOne({
                where: {
                  ingredient_name: body?.ingredient_name,
                  ingredient_id: {
                    [Op.ne]: ingredient_id
                  }
                }
              });
              
            if (ingredient !== null) {
                resolve({
                    msg: "Ingredient name already exists"
                });
            } else {
                const ingredients = await db.Ingredient.update(body, {
                    where: { ingredient_id },
                });

                await db.Image.destroy({
                    where: {
                        ingredient_id: ingredient_id,
                    }
                });

                const createImagePromises = images.map(async ({image}) => {
                    await db.Image.create({
                        image: image,
                        ingredient_id: ingredient_id,
                    });
                });

                await Promise.all(createImagePromises);

                resolve({
                    msg:
                        ingredients[0] > 0
                            ? `${ingredients[0]} ingredient update`
                            : "Cannot update ingredient/ ingredient_id not found",
                });

                redisClient.keys('*ingredients_*', (error, keys) => {
                    if (error) {
                        console.error('Error retrieving keys:', error);
                        return;
                    }
                    // Delete each key individually
                    keys.forEach((key) => {
                        redisClient.del(key, (deleteError, reply) => {
                            if (deleteError) {
                                console.error(`Error deleting key ${key}:`, deleteError);
                            } else {
                                console.log(`Key ${key} deleted successfully`);
                            }
                        });
                    });
                });
            }
        } catch (error) {
            reject(error.message);
        }
    });


const deleteIngredient = (ingredient_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const ingredients = await db.Ingredient.update(
                { status: "Deactive" },
                {
                    where: { ingredient_id: ingredient_ids },
                }
            );
            resolve({
                msg:
                    ingredients > 0
                        ? `${ingredients} ingredient delete`
                        : "Cannot delete ingredient/ ingredient_id not found",
            });

            redisClient.keys('*ingredients_*', (error, keys) => {
                if (error) {
                    console.error('Error retrieving keys:', error);
                    return;
                }
                // Delete each key individually
                keys.forEach((key) => {
                    redisClient.del(key, (deleteError, reply) => {
                        if (deleteError) {
                            console.error(`Error deleting key ${key}:`, deleteError);
                        } else {
                            console.log(`Key ${key} deleted successfully`);
                        }
                    });
                });
            });

        } catch (error) {
            reject(error);
        }
    });

const getIngredientById = (ingredient_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const ingredient = await db.Ingredient.findOne({
                where: { ingredient_id: ingredient_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: [
                        ["store_id", "promotion_id", "cate_detail_id", "createdAt", "updatedAt"]
                    ],
                },
                include: [
                    {
                        model: db.Store,
                        as: "ingredient_store",
                        attributes: ["store_id", "store_name", "address"],
                    },
                    {
                        model: db.Category_detail,
                        as: "ingredient_cate_detail",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "status",
                            ],
                        },
                    },
                    {
                        model: db.Image,
                        as: "ingredient_image",
                        attributes: {
                            exclude: [
                                "step_id",
                                "ingredient_id",
                                "food_id",
                                "createdAt",
                                "updatedAt",
                                "status",
                            ],
                        },
                    },
                ],
            });
            resolve({
                msg: ingredient ? `Got ingredient` : "Cannot find ingredient",
                ingredient: ingredient,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateIngredient,
    deleteIngredient,
    getIngredientById,
    createIngredient,
    getAllIngredients,

};

