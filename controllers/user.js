const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {user_id, user_ids, user_name, email, avatar, role_id, password} = require('../helpers/joi_schema');

// const getAllUser = async (req, res) => {
//     try {
//         const response = await services.getAllUser();
//         return res.status(200).json(response);
//     } catch (error) {
//         console.log(error);
//         throw new InternalServerError(error);
//     }
// };

const getAllUsers = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllUsers(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const createUser = async (req, res) => {
    try {
        const { error } = joi.object({user_name, email, avatar, role_id, password}).validate(req.body);
        if (error) {
            return res.status(400).json({msg: error.details[0].message});
        }
        const response = await services.createUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const { error } = joi.object({user_id}).validate({user_id: req.body.user_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateUser(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateProfile = async (req, res) => {
    try {
        // const { error } = joi.object({user_id}).validate({user_id: req.body.user_id});
        // if (error) throw new BadRequestError(error.details[0].message);
        const {user_id} = req.user;
        const response = await services.updateProfile(req.body, user_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const {user_id} = req.user;
        const { error } = joi.object({user_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteUser(req.query.user_ids, user_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const { id: user_id } = req.params;
        const response = await services.getUserById(user_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {updateUser, deleteUser, getUserById, createUser, getAllUsers, updateProfile};