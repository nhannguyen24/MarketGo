const db = require("../models");
const { Op } = require("sequelize");

const getOrdersByUserId = (req) => new Promise(async (resolve, reject) => {
    try {
        const userId = req.query.userId;
        const orders = await db.Order.findAll({
            where: { user_id: userId },
            order: [['order_date', 'DESC']],
            attributes: {
                exclude: ["createdAt", "updatedAt", "city_id", "user_id"]
            },
            include: [
                {
                    model: db.City,
                    as: "order_city",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },
                {
                    model: db.User,
                    as: "order_user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                },

            ]

        });
        resolve({
            msg: orders ? "Orders found!" : "Not orders found!",
            status: orders ? 200 : 400,
            orders: orders,
        });
    } catch (error) {
        reject(error);
    }
});

const getOrders = (req) => new Promise(async (resolve, reject) => {
    try {
        let page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const storeId = req.query.storeId;
        const sort = req.query.sort;
        const where = {};
        //Paging set up 
        const offset = (page - 1) * limit;
        if (page < 1) {
            page = 1;
        }
        if (limit < 1) {
            limit = 10;
        }
        //Where config with sort, date, storeId
        let order = [['order_date', 'DESC']]
        if (sort === 'ASC') {
            order = [['order_date', 'ASC']];
        }
        if (startDate && endDate) {
            where.order_date = {
                [Op.between]: [startDate, new Date(endDate).setHours(23, 59, 0, 0)],
            };
        }
        let totalCount = await db.Order.count({ where });
        let pageCount = Math.ceil(totalCount / limit);
        if (storeId) {
            order = [[
                { model: db.Order, as: 'detail_order' },
                'order_date',
                'DESC'
            ]];
            if (sort === 'ASC') {
                order = [[
                    { model: db.Order, as: 'detail_order' },
                    'order_date',
                    'ASC'
                ]];
            }
            const orders = await db.Order_detail.findAll({
                limit,
                offset,
                order: order,
                include: [
                    {
                        model: db.Ingredient,
                        as: 'order_detail_ingredient',
                        where: {
                            store_id: storeId,
                        },
                        attributes: [],
                    },
                    {
                        model: db.Order,
                        as: 'detail_order',
                        where: where,
                        include: [
                            {
                            model: db.City,
                            as: "order_city",
                            attributes: {
                                exclude: ["createdAt", "updatedAt"]
                            },
                        },
                        {
                            model: db.User,
                            as: "order_user",
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "password", "refresh_token", "accessChangePassword"]
                            },
                        },
                        ],
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "city_id", "user_id"]
                        },
                    },
                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt", "order_id", "price", "quantity", "ingredient_id", "order_detail_id", "status"]
                },
                distinct: true,
            })
            const processedOrders = orders.map((order) => order.detail_order);
            totalCount = processedOrders.length
            pageCount = Math.ceil(totalCount / limit);
            resolve({
                msg: orders ? "Orders found!" : "Not orders found!",
                status: orders ? 200 : 400,
                pagination: {
                    totalCount,
                    pageCount,
                    currentPage: page,
                },
                orders: processedOrders,
            });
        }

        const orders = await db.Order.findAll({
            where,
            order,
            limit,
            offset,
            include:
            {
                model: db.City,
                as: "order_city",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "city_id"]
            },
        });

        resolve({
            msg: orders ? "Orders found!" : "No orders found!",
            status: orders ? 200 : 400,
            pagination: {
                totalCount,
                pageCount,
                currentPage: page,
            },
            orders: orders,

        });
    } catch (error) {
        reject(error)
    }
});


module.exports = {
    getOrdersByUserId,
    getOrders,
};