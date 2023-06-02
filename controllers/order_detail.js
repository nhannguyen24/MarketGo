const services = require('../services');

const createOrderDetail = async (req, res) => {
    const { orderDetail } = req.body;
    const response = await services.createOrderDetail(orderDetail);
    if(!response.created){
        return res.status(400).json(response.msg);
    }
    return res.status(201).json(response);
};

module.exports = {
    createOrderDetail
}