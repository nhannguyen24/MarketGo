const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllRecipes = (
    { page, limit, order, recipe_name, food_id, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`recipes_${page}_${limit}_${order}_${recipe_name}_${food_id}`, async (error, recipe) => {
                if (error) console.error(error);
                if (recipe != null && recipe != "") {
                    resolve({
                        msg: "Got recipes",
                        recipes: JSON.parse(recipe),
                    });
                } else {
                    redisClient.get(`admin_recipes_${page}_${limit}_${order}_${recipe_name}_${food_id}`, async (error, adminRecipe) => {
                        if (adminRecipe != null && adminRecipe != "") {
                            resolve({
                                msg: "Got recipes",
                                recipes: JSON.parse(adminRecipe),
                            });
                        } else {
                            const queries = { raw: true, nest: true };
                            const offset = !page || +page <= 1 ? 0 : +page - 1;
                            const flimit = +limit || +process.env.LIMIT_POST;
                            queries.offset = offset * flimit;
                            queries.limit = flimit;
                            if (order) queries.order = [order];
                            if (recipe_name) query.recipe_name = { [Op.substring]: recipe_name };
                            queries.order = [['updatedAt', 'DESC']];
                            if (food_id) query.store_id = { [Op.eq]: store_id };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const recipes = await db.Recipe.findAndCountAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["food_id", "createdAt", "updatedAt"],
                                },
                                include: [
                                    {
                                        model: db.Foods,
                                        as: "recipe_food",
                                        attributes: {
                                            exclude: [
                                                "createAt",
                                                "updateAt",
                                            ],
                                        },
                                    },
                                ],
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`recipes_${page}_${limit}_${order}_${recipe_name}_${food_id}`, 3600, JSON.stringify(recipes));
                            } else {
                                redisClient.setEx(`admin_recipes_${page}_${limit}_${order}_${recipe_name}_${food_id}`, 3600, JSON.stringify(recipes));
                            }
                            resolve({
                                msg: recipes ? "Got recipes" : "Cannot find recipes",
                                recipes: recipes,
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

const createRecipe = (body) =>
    new Promise(async (resolve, reject) => {
        try {
            const recipe = await db.Recipe.create(body);

            console.log(recipe);
            resolve({
                msg: recipe
                    ? "Create new recipe successfully"
                    : "Cannot create new recipe/Recipe already exists",
            });

            redisClient.keys('*recipes_*', (error, keys) => {
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

const updateRecipe = ({ recipe_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const recipes = await db.Recipe.update(body, {
                where: { recipe_id },
            });
            resolve({
                msg:
                    recipes[0] > 0
                        ? `${recipes[0]} recipe update`
                        : "Cannot update recipe/ recipe_id not found",
            });

            redisClient.keys('*recipes_*', (error, keys) => {
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
            reject(error.message);
        }
    });


const deleteRecipe = (recipe_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const recipes = await db.Recipe.update(
                { status: "Deactive" },
                {
                    where: { recipe_id: recipe_ids },
                }
            );
            resolve({
                msg:
                    recipes > 0
                        ? `${recipes} recipe delete`
                        : "Cannot delete recipe/ recipe_id not found",
            });

            redisClient.keys('*recipes_*', (error, keys) => {
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

const getRecipeById = (recipe_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const recipe = await db.Recipe.findOne({
                where: { recipe_id: recipe_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: ["food_id", "cate_detail_id", "createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.Foods,
                        as: "recipe_food",
                        attributes: {
                            exclude: [
                                "createAt",
                                "updateAt",
                            ],
                        },
                    },
                ],
            });
            resolve({
                msg: recipe ? "Got recipe" : "Cannot find recipe",
                recipe: recipe,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    createRecipe,
    getAllRecipes,

};

