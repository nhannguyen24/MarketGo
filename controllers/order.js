const services = require('../services');

const createOrder = async (req, res) => {
    const { order } = req.body;
    const response = await services.newOrder(order);
    if(!response.created){
        return res.status(400).json(response.msg);
    }
    return res.status(201).json(response);
};

module.exports = {
    createOrder
}