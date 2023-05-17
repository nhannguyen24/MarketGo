const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');

const getAllRoles = async (req, res) => {
    try {
        const response = await services.getAllRoles(req.query);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

module.exports = { getAllRoles }