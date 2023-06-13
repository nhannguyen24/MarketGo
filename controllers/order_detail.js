const services = require('../services');

const createOrderDetail = async (req, res) => {
    const response = await services.createOrderDetail(req);
    return res.status(response.status).json(response);
};

const getOrderDetailByOrderId = async (req, res) => {
    const response = await services.getOrderDetailByOrderId(req);
    return res.status(response.status).json(response);
};


module.exports = {
    createOrderDetail, getOrderDetailByOrderId,
}