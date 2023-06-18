const db = require("../models");
const createOrderDetail = (req) => new Promise(async (resolve, reject) => {
    try {
        await db.sequelize.transaction(async (transaction) => {
            const totalPrice = req.body.totalPrice;
            const cityId = req.body.cityId;
            const address = req.body.address;
            const listItem = req.body.orderDetails
            const currentDate = new Date();
            const user = await db.User.findOne({ where: { user_id: req.body.userId } })

            const order = { user_id: user.user_id, order_date: currentDate, total_price: totalPrice, city_id: cityId, address: address, status: "Active", delivery_status: "On_Going" }
            //begin to insert order 
            const createdOrder = await db.Order.create(order, { transaction })
            for (const element of listItem) {
                //checking whether quantity is available
                const ingredient = await db.Ingredient.findOne({ where: { ingredient_id: element.ingredient.ingredient_id }, transaction });
                if (!ingredient) {
                    return resolve({
                        msg: 'No ingredient found for: ' + ingredient.ingredient_name,
                        status: 400
                    })
                }
                if (ingredient.quantity < element.quantity) {
                    return resolve({
                        msg: 'Insufficient quantity for ' + ingredient.ingredient_name + '. Only ' + ingredient.quantity + ' available.',
                        status: 400
                    })
                }
                var orderDetail = {
                    order_id: createdOrder.order_id,
                    ingredient_id: element.ingredient.ingredient_id,
                    price: element.price,
                    quantity: element.quantity,
                    status: element.status
                };
                await db.Order_detail.create(orderDetail, { transaction });
                //update quantity of ingredients
                const updatedQuantity = ingredient.quantity - element.quantity;
                await db.Ingredient.update(
                    { quantity: updatedQuantity },
                    { where: { ingredient_id: element.ingredient.ingredient_id }, transaction }
                );
            }
            const transaction_setup = { price: totalPrice, order_id: createdOrder.order_id, status: "Active" }
            await db.Transaction.create(transaction_setup, { transaction })
            resolve({
                msg: "Order created",
                status: 200,
            });
        })
    } catch (error) {
        resolve({
            msg: error.message,
            status: 400,
        });
    }
});

const getOrderDetailsByOrderId = (req) => new Promise(async (resolve, reject) => {
    try {
        const orderId = req.query.orderId;
        const orderDetail = await db.Order_detail.findAll({
            where: { order_id: orderId },
            include:
            {
                model: db.Ingredient,
                as: "order_detail_ingredient",
                attributes: {
                    exclude: ["promotion_id", "createdAt", "updatedAt"]
                },
                include: {
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
                model: db.Order,
                as: "detail_order",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "city_id"]
                },
                include: {
                    model: db.City,
                    as: "order_city",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                }
            },
            attributes: {
                exclude: ["ingredient_id", "createdAt", "updatedAt", "order_id"]
            }
        });
        resolve({
            msg: orderDetail ? "Order detail found!" : "No order detail found!",
            status: orderDetail ? 200 : 400,
            orderDetails: orderDetail,
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    createOrderDetail, getOrderDetailsByOrderId
};
