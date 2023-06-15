const services = require('../services');

const getOrdersByUserId = async (req, res) => {
    const response = await services.getOrdersByUserId(req);
    return res.status(response.status).json(response);
};

module.exports = {
    getOrdersByUserId
}