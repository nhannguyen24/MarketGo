const services = require('../services');
var msg = "OK"
const createOrderDetail = async (req, res) => {
    const response = await services.createOrderDetail(req);
    return res.status(response.status).json(response);
};

const test = async (req, res) => {
    return res.status(200).json(msg);
}

module.exports = {
    createOrderDetail,
    test
}