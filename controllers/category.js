const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {category_id, category_ids} = require('../helpers/joi_schema');

const getAllCategories = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllCategories(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createCategory = async (req, res) => {
    try {
        const {cate_name} = req.body;
        if(!cate_name) {
            throw new BadRequestError('Please provide cate_name');
        }
        const response = await services.createCategory(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateCategory = async (req, res) => {
    try {
        const { error } = joi.object({category_id}).validate({category_id: req.body.category_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateCategory(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { error } = joi.object({category_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteCategory(req.query.category_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {
            throw new BadRequestError('Please provide id');
        }
        const response = await services.getCategoryById(id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllCategories, createCategory, updateCategory, deleteCategory, getCategoryById};
