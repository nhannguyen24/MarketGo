const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllFoods = (
    { page, limit, order, food_name, user_id, cate_detail_id, min_price, max_price, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`foods_${page}_${limit}_${order}_${food_name}_${user_id}_${cate_detail_id}_${min_price}_${max_price}`, async (error, food) => {
                if (error) console.error(error);
                if (food != null && food != ""  && role_name != 'Admin') {
                    resolve({
                        msg: "Got foods",
                        foods: JSON.parse(food),
                    });
                } else {
                    redisClient.get(`admin_foods_${page}_${limit}_${order}_${food_name}_${user_id}_${cate_detail_id}`, async (error, adminFood) => {
                        if (adminFood != null && adminFood != "") {
                            resolve({
                                msg: "Got foods",
                                foods: JSON.parse(adminFood),
                            });
                        } else {
                            const queries = { nest: true };
                            const offset = !page || +page <= 1 ? 0 : +page - 1;
                            const flimit = +limit || +process.env.LIMIT_POST;
                            queries.offset = offset * flimit;
                            queries.limit = flimit;
                            if (min_price && max_price) {
                                query.price = {
                                  [Op.between]: [min_price, max_price]
                                };
                              } else if (min_price) {
                                query.price = {
                                  [Op.gte]: min_price
                                };
                              } else if (max_price) {
                                query.price = {
                                  [Op.lte]: max_price
                                };
                              }
                            if (order) queries.order = [order]
                            else {
                                queries.order = [
                                    ['updatedAt', 'DESC'],
                                    [{ model: db.Guild_step, as: 'food_step' }, 'step', 'ASC']
                                  ];
                            }
                            if (food_name) query.food_name = { [Op.substring]: food_name };
                            if (user_id) query.user_id = { [Op.eq]: user_id };
                            if (cate_detail_id) query.cate_detail_id = { [Op.eq]: cate_detail_id };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const foods = await db.Foods.findAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["user_id", "cate_detail_id"],
                                },
                                include: [
                                    {
                                        model: db.User,
                                        as: "food_user",
                                        attributes: ["user_id", "user_name", "email" ],
                                    },
                                    {
                                        model: db.Category_detail,
                                        as: "food_cate_detail",
                                        attributes: {
                                            exclude: [
                                                "cate_id",
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                    },
                                    {
                                        model: db.Image,
                                        as: "food_image",
                                        attributes: {
                                            exclude: [
                                                "ingredient_id",
                                                "food_id",
                                                "step_id",
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                    },
                                    {
                                        model: db.Guild_step,
                                        as: "food_step",
                                        attributes: {
                                            exclude: [
                                                "food_id",
                                                "createdAt",
                                                "updatedAt",
                                                "status",
                                            ],
                                        },
                                        include: [
                                            {
                                                model: db.Image,
                                                as: "step_image",
                                                attributes: {
                                                    exclude: [
                                                        "ingredient_id",
                                                        "food_id",
                                                        "step_id",
                                                        "createdAt",
                                                        "updatedAt",
                                                        "status",
                                                    ],
                                                },
                                            },
                                        ]
                                    },
                                ],
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`foods_${page}_${limit}_${order}_${food_name}_${user_id}_${cate_detail_id}`, 3600, JSON.stringify(foods));
                            } else {
                                redisClient.setEx(`admin_foods_${page}_${limit}_${order}_${food_name}_${user_id}_${cate_detail_id}`, 3600, JSON.stringify(foods));
                            }
                            resolve({
                                msg: foods ? "Got foods" : "Cannot find foods",
                                foods: foods,
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


const createFood = ({images, food_name, ...body}) =>
    new Promise(async (resolve, reject) => {
        try {

            const createFood = await db.Foods.findOrCreate({
                where: {
                    food_name: food_name
                },
                defaults: {
                    food_name: food_name,
                    ...body,
                },
            });

            const createImagePromises = images.map(async ({image}) => {
                await db.Image.create({
                    image: image,
                    food_id: createFood[0].food_id,
                });
            });

            await Promise.all(createImagePromises);

            const food = await db.Foods.findOne({
                where: {
                    food_id: createFood[0].food_id
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            })

            resolve({
                msg: createFood[1]
                    ? "Create new food successfully"
                    : "Cannot create new food/Food already exists",
                food: createFood[1] ? food : null,
            });

            redisClient.keys('*foods_*', (error, keys) => {
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

const updateFood = ({ images, food_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {

            const food = await db.Foods.findOne({
                where: { 
                    food_name: body?.food_name,
                    food_id: {
                        [Op.ne]: food_id
                    }
                }
            })

            if (food !== null) {
                resolve({
                    msg: "Food name already exists"
                });
            } else {
                const foods = await db.Foods.update(body, {
                    where: { food_id },
                });

                await db.Image.destroy({
                    where: {
                        food_id: food_id,
                    }
                });

                const createImagePromises = images.map(async ({image}) => {
                    await db.Image.create({
                        image: image,
                        food_id: food_id,
                    });
                });
    
                await Promise.all(createImagePromises);

                resolve({
                    msg:
                        foods[0] > 0
                            ? `${foods[0]} food update`
                            : "Cannot update food/ food_id not found",
                });

                redisClient.keys('*foods_*', (error, keys) => {
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


const deleteFood = (food_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const foods = await db.Foods.update(
                { status: "Deactive" },
                {
                    where: { food_id: food_ids },
                }
            );
            resolve({
                msg:
                    foods > 0
                        ? `${foods} food delete`
                        : "Cannot delete food/ food_id not found",
            });

            redisClient.keys('*foods_*', (error, keys) => {
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

const getFoodById = (food_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const food = await db.Foods.findOne({
                where: { food_id: food_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: ["user_id", "cate_detail_id", "createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.User,
                        as: "food_user",
                        attributes: {
                            exclude: [
                                "role_id",
                                "createAt",
                                "updateAt",
                                "refresh_token",
                                "status",
                            ],
                        },
                    },
                    {
                        model: db.Category_detail,
                        as: "food_cate_detail",
                        attributes: {
                            exclude: [
                                "cate_id",
                                "createdAt",
                                "updatedAt",
                                "status",
                            ],
                        },
                    },
                ],
            });
            resolve({
                msg: food ? "Got food" : "Cannot find food",
                food: food,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateFood,
    deleteFood,
    getFoodById,
    createFood,
    getAllFoods,

};

