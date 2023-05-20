const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {food_id, food_ids} = require('../helpers/joi_schema');

const getAllFoods = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllFoods(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createFood = async (req, res) => {
    try {
        const fileData = req.file_image;
        const {food_name, quantitative} = req.body;
        if(!food_name) {
            throw new BadRequestError('Please provide food_name');
        }
        if(!quantitative) {
            throw new BadRequestError('Please provide quantitative');
        }
        const response = await services.createFood(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateFood = async (req, res) => {
    try {
        const { error } = joi.object({food_id}).validate({food_id: req.body.food_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateFood(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteFood = async (req, res) => {
    try {
        const { error } = joi.object({food_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteFood(req.query.food_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getFoodById = async (req, res) => {
    try {
        const { id: food_id } = req.params;
        const response = await services.getFoodById(food_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllFoods, createFood, updateFood, deleteFood, getFoodById};
