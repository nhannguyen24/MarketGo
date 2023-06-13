const db = require("../models");
const { Op } = require("sequelize");

const getOrdersByUserId = (req) => new Promise(async (resolve, reject) => {
    try {
        const userId = req.query.userId;
        const orders = await db.Order.findAll({
            where: { user_id: userId },
            order: [['order_date', 'DESC']]
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



module.exports = {
    getOrdersByUserId,
};