const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllCategories = (
    { cate_name, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`categories_${cate_name}`, async (error, category) => {
                if (error) console.error(error);
                if (category != null && category != "") {
                    resolve({
                        msg: "Got categories",
                        categories: JSON.parse(category),
                    });
                } else {
                    redisClient.get(`admin_categories_${cate_name}`, async (error, adminCategory) => {
                        if (adminCategory != null && adminCategory != "") {
                            resolve({
                                msg: "Got categories",
                                categories: JSON.parse(adminCategory),
                            });
                        } else {
                            const queries = { raw: true, nest: true };
                            queries.order = [['updatedAt', 'DESC']];
                            if (cate_name)
                                query.cate_name = { [Op.substring]: cate_name };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const categories = await db.Category.findAndCountAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"],
                                },
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`categories_${cate_name}`, 3600, JSON.stringify(categories));
                            } else {
                                redisClient.setEx(`admin_categories_${cate_name}`, 3600, JSON.stringify(categories));
                            }
                            resolve({
                                msg: categories ? "Got categories" : "Cannot find categories",
                                categories: categories,
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


const createCategory = (body) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findOrCreate({
                where: { cate_name: body?.cate_name },
                defaults: {
                    ...body,
                },
            });
            resolve({
                msg: category[1]
                    ? "Create new category successfully"
                    : "Cannot create new category/Category name already exists",
            });

            redisClient.keys('*categories_*', (error, keys) => {
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

const updateCategory = ({ cate_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findAll({
                where: { 
                    cate_name: body?.cate_name,
                    cate_id: {
                        [Op.ne]: cate_id
                    }
                }
            })
            if (category) {
                resolve({
                    msg: "Category name already exists"
                });
            } else {
                const categories = await db.Category.update(body, {
                    where: { cate_id },
                });
                resolve({
                    msg:
                        categories[0] > 0
                            ? `${categories[0]} category update`
                            : "Cannot update category/ cate_id not found",
                });

                redisClient.keys('*categories_*', (error, keys) => {
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


const deleteCategory = (cate_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const categories = await db.Category.update(
                { status: "Deactive" },
                {
                    where: { cate_id: cate_ids },
                }
            );
            resolve({
                msg:
                    categories > 0
                        ? `${categories} category delete`
                        : "Cannot delete category/ cate_id not found",
            });
            redisClient.keys('*categories_*', (error, keys) => {
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

const getCategoryById = (cate_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findOne({
                where: { cate_id: cate_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                    ],
                },
            });
            resolve({
                msg: category ? "Got category" : `Cannot find category with id ${cate_id}`,
                category: category,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateCategory,
    deleteCategory,
    getCategoryById,
    createCategory,
    getAllCategories,

};

