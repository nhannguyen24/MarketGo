const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllCategoryDetail = (
    { cate_detail_name, cate_id, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`categories_detail_${cate_detail_name}_${cate_id}`, async (error, category) => {
                if (error) console.error(error);
                if (category != null && category != "") {
                    resolve({
                        msg: "Got categories",
                        categories: JSON.parse(category),
                    });
                } else {
                    redisClient.get(`admin_categories_detail_${cate_detail_name}_${cate_id}`, async (error, adminCategory) => {
                        if (adminCategory != null && adminCategory != "") {
                            resolve({
                                msg: "Got categories",
                                categories: JSON.parse(adminCategory),
                            });
                        } else {
                            const queries = { raw: true, nest: true };
                            queries.order = [['updatedAt', 'DESC']];
                            if (cate_detail_name)
                                query.cate_detail_name = { [Op.substring]: cate_detail_name };
                            if (cate_id)
                                query.cate_id = { [Op.eq]: cate_id };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const categories_detail = await db.Category_detail.findAndCountAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["cate_id", "createdAt", "updatedAt"],
                                },
                                include: [
                                    {
                                        model: db.Category,
                                        as: "detail_cate",
                                        attributes: {
                                            exclude: [
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                    },
                                ],
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`categories_detail_${cate_detail_name}_${cate_id}`, 3600, JSON.stringify(categories_detail));
                            } else {
                                redisClient.setEx(`admin_categories_detail_${cate_detail_name}_${cate_id}`, 3600, JSON.stringify(categories_detail));
                            }
                            resolve({
                                msg: categories_detail ? "Got categories_detail" : "Cannot find categories_detail",
                                categories_detail: categories_detail,
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


const createCategoryDetail = (body) =>
    new Promise(async (resolve, reject) => {
        try {
            const cate_detail = await db.Category_detail.findOrCreate({
                where: { cate_detail_name: body?.cate_detail_name },
                defaults: {
                    ...body,
                },
            });
            resolve({
                msg: cate_detail[1]
                    ? "Create new cate_detail successfully"
                    : "Cannot create new cate_detail/Category_detail name already exists",
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

const updateCategoryDetail = ({ cate_detail_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const cate_detail = await db.Category_detail.findAll({
                where: { 
                    cate_detail_name: body?.cate_detail_name,
                    cate_detail_id: {
                        [Op.ne]: cate_detail_id
                    }
                }
            })
            if (cate_detail) {
                resolve({
                    msg: "Category_detail name already exists"
                });
            } else {
                const categories_detail = await db.Category_detail.update(body, {
                    where: { cate_detail_id },
                });
                resolve({
                    msg:
                        categories_detail[0] > 0
                            ? `${categories_detail[0]} cate_detail update`
                            : "Cannot update cate_detail/ cate_detail_id not found",
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


const deleteCategoryDetail = (cate_detail_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const categories_detail = await db.Category_detail.update(
                { status: "Deactive" },
                {
                    where: { cate_detail_id: cate_detail_ids },
                }
            );
            resolve({
                msg:
                    categories_detail > 0
                        ? `${categories_detail} cate_detail delete`
                        : "Cannot delete cate_detail/ cate_detail_id not found",
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

const getCategoryDetailById = (cate_detail_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const cate_detail = await db.Category_detail.findOne({
                where: { cate_detail_id: cate_detail_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: [
                        "cate_id",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                include: [
                    {
                        model: db.Category,
                        as: "detail_cate",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "status",
                            ],
                        },
                    },
                ],
            });
            resolve({
                msg: cate_detail ? "Got cate_detail" : `Cannot find cate_detail with id ${cate_detail_id}`,
                cate_detail: cate_detail,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateCategoryDetail,
    deleteCategoryDetail,
    getCategoryDetailById,
    createCategoryDetail,
    getAllCategoryDetail,

};

