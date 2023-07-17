const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {blog_id, blog_ids} = require('../helpers/joi_schema');

const getAllBlogs = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllBlogs(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createBlog = async (req, res) => {
    try {
        const {title, content} = req.body;
        if(!title) {
            throw new BadRequestError('Please provide title');
        }
        if(!content) {
            throw new BadRequestError('Please provide content');
        }
        const response = await services.createBlog(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateBlog = async (req, res) => {
    try {
        const { error } = joi.object({blog_id}).validate({blog_id: req.body.blog_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateBlog(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { error } = joi.object({blog_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteBlog(req.query.blog_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getBlogById = async (req, res) => {
    try {
        const { id: blog_id } = req.params;
        const response = await services.getBlogById(blog_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllBlogs, createBlog, updateBlog, deleteBlog, getBlogById};
