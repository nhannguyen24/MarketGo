const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
const joi = require('joi');
const {city_id, city_ids} = require('../helpers/joi_schema');

const getAllCities = async (req, res) => {
    try {
        const { role_name } = req.user;
        const response = await services.getAllCities(req.query, role_name);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const createCity = async (req, res) => {
    try {
        const {city_name} = req.body;
        if(!city_name) {
            throw new BadRequestError('Please provide city_name');
        }

        const response = await services.createCity(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const updateCity = async (req, res) => {
    try {
        const { error } = joi.object({city_id}).validate({city_id: req.body.city_id});
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.updateCity(req.body);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const deleteCity = async (req, res) => {
    try {
        const { error } = joi.object({city_ids}).validate(req.query);
        if (error) throw new BadRequestError(error.details[0].message);
        const response = await services.deleteCity(req.query.city_ids);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
};

const getCityById = async (req, res) => {
    try {
        const { id: city_id } = req.params;
        const response = await services.getCityById(city_id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error.message);
    }
};

module.exports = {getAllCities, createCity, updateCity, deleteCity, getCityById};
