const db = require("../models");
const { Op } = require("sequelize");


const createOrder = (order) => new Promise(async (resolve, reject) => {
    try {
        const createOrder = await db.Order.create(order);
        resolve({
            msg: createOrder ? "Order created" : "Order failed to create",
            created: createOrder ? true : false,
            createOrder: createOrder,
        });
    } catch (error) {
        reject(error);
    }
});



module.exports = {
    createOrder,
};