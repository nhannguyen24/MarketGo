const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {step_id, step_ids} = require('../helpers/joi_schema');

const createStep = async (req, res) => {
    try {
        const response = await services.createStep(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateStep = async (req, res) => {
    try {
        const { error } = joi.object({step_id}).validate({step_id: req.body.step_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateStep(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteStep = async (req, res) => {
    try {
        const { error } = joi.object({step_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteStep(req.query.step_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};


module.exports = {createStep, updateStep, deleteStep};
