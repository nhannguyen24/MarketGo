const db = require("../models");
const { Op } = require("sequelize");
const services = require('../services');

const createOrderDetail = (orderDetail) => new Promise(async (resolve, reject) => {
    try {
        services.createOrder(orderDetail).then(async (createdOrder) => {
            for(const [key, value] of orderDetail.entries){
                orderDetail.Order = createdOrder;
                await db.Order_detail.create(orderDetail);
            }
        })

        
        resolve({
            msg: createOrderDetail ? "Order created" : "Order failed to create",
            created: createOrderDetail ? true : false,
            createOrderDetail: createOrderDetail,
        });
    } catch (error) {
        reject(error);
    }
});



module.exports = {
    createOrderDetail,
};