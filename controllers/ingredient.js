const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {ingredient_id, ingredient_ids} = require('../helpers/joi_schema');

const getAllIngredients = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllIngredients(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createIngredient = async (req, res) => {
    try {
        const fileData = req.file_image;
        const {ingredient_name, price, quantity, quantitative} = req.body;
        if(!ingredient_name) {
            throw new BadRequestError('Please provide ingredient_name');
        }
        if(!price) {
            throw new BadRequestError('Please provide price');
        }
        if(!quantity) {
            throw new BadRequestError('Please provide quantity');
        }
        if(!quantitative) {
            throw new BadRequestError('Please provide quantitative');
        }
        const response = await services.createIngredient(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateIngredient = async (req, res) => {
    try {
        const { error } = joi.object({ingredient_id}).validate({ingredient_id: req.body.ingredient_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateIngredient(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteIngredient = async (req, res) => {
    try {
        const { error } = joi.object({ingredient_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteIngredient(req.query.ingredient_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getIngredientById = async (req, res) => {
    try {
        const { id: ingredient_id } = req.params;
        const response = await services.getIngredientById(ingredient_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllIngredients, createIngredient, updateIngredient, deleteIngredient, getIngredientById};
