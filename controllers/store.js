const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {store_id, store_ids} = require('../helpers/joi_schema');

const getAllStores = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllStores(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createStore = async (req, res) => {
    try {
        const {store_name, address} = req.body;
        if(!store_name) {
            throw new BadRequestError('Please provide store_name');
        }
        if(!address) {
            throw new BadRequestError('Please provide address');
        }
        const response = await services.createStore(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateStore = async (req, res) => {
    try {
        const { error } = joi.object({store_id}).validate({store_id: req.body.store_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateStore(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteStore = async (req, res) => {
    try {
        const { error } = joi.object({store_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteStore(req.query.store_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getStoreById = async (req, res) => {
    try {
        const { id: store_id } = req.params;
        const response = await services.getStoreById(store_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllStores, createStore, updateStore, deleteStore, getStoreById};
