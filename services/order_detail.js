const db = require("../models");
const createOrderDetail = (req) => new Promise(async (resolve, reject) => {
    try {
        await db.sequelize.transaction(async (transaction) => {
            const total_price = req.body.total_price
            const listItem = req.body.OrderDetails
            const user = await db.User.findOne({ where: { email: req.body.email } })

            const order = { user_id: user.user_id, total_price: total_price, status: "Active" }
            //begin to insert order 
            const createdOrder = await db.Order.create(order, { transaction })
            for (const element of listItem) {
                //checking whether quantity is available
                const ingredient = await db.Ingredient.findOne({ where: { ingredient_id: element.ingredient.ingredient_id }, transaction });
                if(!ingredient){
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
                    { quantity: updatedQuantity},
                    { where: { ingredient_id: element.ingredient.ingredient_id }, transaction }
                );
            }        
            const transaction_setup = {price: total_price, order_id: createdOrder.order_id, status: "Active" }
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


module.exports = {
    createOrderDetail,
};