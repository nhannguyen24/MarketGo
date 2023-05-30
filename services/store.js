const db = require("../models");
const { Op } = require("sequelize");
const redisClient = require("../config/redis_config");

const getAllStores = (
    { page, limit, order, store_name, user_id, city_id, ...query },
    role_name
) =>
    new Promise(async (resolve, reject) => {
        try {
            redisClient.get(`stores_${page}_${limit}_${order}_${store_name}_${user_id}_${city_id}`, async (error, store) => {
                if (error) console.error(error);
                if (store != null && store != "") {
                    resolve({
                        msg: "Got stores",
                        stores: JSON.parse(store),
                    });
                } else {
                    redisClient.get(`admin_stores_${page}_${limit}_${order}_${store_name}_${user_id}_${city_id}`, async (error, adminStore) => {
                        if (adminStore != null && adminStore != "") {
                            resolve({
                                msg: "Got stores",
                                stores: JSON.parse(adminStore),
                            });
                        } else {
                            const queries = { raw: true, nest: true };
                            const offset = !page || +page <= 1 ? 0 : +page - 1;
                            const flimit = +limit || +process.env.LIMIT_POST;
                            queries.offset = offset * flimit;
                            queries.limit = flimit;
                            if (order) queries.order = [order];
                            else queries.order = [['updatedAt', 'DESC']];
                            if (store_name) query.store_name = { [Op.substring]: store_name };
                            if (user_id) query.user_id = { [Op.eq]: user_id };
                            if (city_id) query.city_id = { [Op.eq]: city_id };
                            if (role_name !== "Admin") {
                                query.status = { [Op.notIn]: ['Deactive'] };
                            }
                            const stores = await db.Store.findAndCountAll({
                                where: query,
                                ...queries,
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"],
                                },
                                include: [
                                    {
                                        model: db.City,
                                        as: "store_city",
                                        attributes: ["city_id", "city_name"],
                                    },
                                    {
                                        model: db.User,
                                        as: "store_user",
                                        attributes: ["user_id", "user_name", "email", "address", "phone", "role_id"],
                                    },
                                ],
                            });

                            if (role_name !== "Admin") {
                                redisClient.setEx(`stores_${page}_${limit}_${order}_${store_name}_${user_id}_${city_id}`, 3600, JSON.stringify(stores));
                            } else {
                                redisClient.setEx(`admin_stores_${page}_${limit}_${order}_${store_name}_${user_id}_${city_id}`, 3600, JSON.stringify(stores));
                            }
                            resolve({
                                msg: stores ? `Got stores` : "Cannot find stores",
                                stores: stores,
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


const createStore = (body) =>
    new Promise(async (resolve, reject) => {
        try {
            const store = await db.Store.findOrCreate({
                where: { store_name: body?.store_name },
                defaults: {
                    ...body,
                },
            });
            resolve({
                msg: store[1]
                    ? "Create new store successfully"
                    : "Cannot create new store/Store name already exists",
            });

            redisClient.keys('*stores_*', (error, keys) => {
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

const updateStore = ({ store_id, ...body }) =>
    new Promise(async (resolve, reject) => {
        try {
            const store = await db.Store.findAll({
                where: { 
                    store_name: body?.store_name,
                    store_id: {
                        [Op.ne]: user_id
                    }
                }
            })
            if (store) {
                resolve({
                    msg: "Store name already exists"
                });
            } else {
                const stores = await db.Store.update(body, {
                    where: { store_id },
                });
                resolve({
                    msg:
                        stores[0] > 0
                            ? `${stores[0]} store update`
                            : "Cannot update store/ store_id not found",
                });

                redisClient.keys('*stores_*', (error, keys) => {
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


const deleteStore = (store_ids) =>
    new Promise(async (resolve, reject) => {
        try {
            const stores = await db.Store.update(
                { status: "Deactive" },
                {
                    where: { store_id: store_ids },
                }
            );
            resolve({
                msg:
                    stores > 0
                        ? `${stores} store delete`
                        : "Cannot delete store/ store_id not found",
            });

            redisClient.keys('*stores_*', (error, keys) => {
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

const getStoreById = (store_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const store = await db.Store.findOne({
                where: { store_id: store_id },
                raw: true,
                nest: true,
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                    ],
                },
                include: [
                    {
                        model: db.City,
                        as: "store_city",
                        attributes: ["city_id", "city_name"],
                    },
                    {
                        model: db.User,
                        as: "store_user",
                        attributes: ["user_id", "user_name", "email", "address", "phone", "role_id"],
                    },
                ],
            });
            resolve({
                msg: store ? "Got store" : `Cannot find store with id ${store_id}`,
                store: store,
            });
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    updateStore,
    deleteStore,
    getStoreById,
    createStore,
    getAllStores,

};

