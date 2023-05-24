const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {recipe_id, recipe_ids} = require('../helpers/joi_schema');

const getAllRecipes = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllRecipes(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createRecipe = async (req, res) => {
    try {
        const {ingredient_description, implementation_guide} = req.body;
        console.log(ingredient_description);
        if(!ingredient_description) {
            throw new BadRequestError('Please provide ingredient_description');
        }
        if(!implementation_guide) {
            throw new BadRequestError('Please provide implementation_guide');
        }
        const response = await services.createRecipe(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateRecipe = async (req, res) => {
    try {
        const { error } = joi.object({recipe_id}).validate({recipe_id: req.body.recipe_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateRecipe(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const { error } = joi.object({recipe_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteRecipe(req.query.recipe_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getRecipeById = async (req, res) => {
    try {
        const { id: recipe_id } = req.params;
        const response = await services.getRecipeById(recipe_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllRecipes, createRecipe, updateRecipe, deleteRecipe, getRecipeById};
