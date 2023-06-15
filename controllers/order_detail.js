const services = require('../services');

const createOrderDetail = async (req, res) => {
    const response = await services.createOrderDetail(req);
    return res.status(response.status).json(response);
};

const getOrderDetailsByOrderId = async (req, res) => {
    const response = await services.getOrderDetailsByOrderId(req);
    return res.status(response.status).json(response);
};


module.exports = {
    createOrderDetail, getOrderDetailsByOrderId,
}