const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {cate_detail_id, cate_detail_ids} = require('../helpers/joi_schema');

const getAllCategoryDetail = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllCategoryDetail(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createCategoryDetail = async (req, res) => {
    try {
        const {cate_detail_name} = req.body;
        if(!cate_detail_name) {
            throw new BadRequestError('Please provide cate_detail_name');
        }

        const response = await services.createCategoryDetail(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateCategoryDetail = async (req, res) => {
    try {
        const { error } = joi.object({cate_detail_id}).validate({cate_detail_id: req.body.cate_detail_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateCategoryDetail(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteCategoryDetail = async (req, res) => {
    try {
        const { error } = joi.object({cate_detail_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteCategoryDetail(req.query.cate_detail_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getCategoryDetailById = async (req, res) => {
    try {
        const { id: category_id } = req.params;
        const response = await services.getCategoryDetailById(category_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllCategoryDetail, createCategoryDetail, updateCategoryDetail, deleteCategoryDetail, getCategoryDetailById};
