const services = require('../services');
const {BadRequestError, InternalServerError} = require('../errors');
// const joi = require('joi');
// const {refresh_token, student_id} = require('../helpers/joi_schema');

const loginGoogle = async (req, res) => {
    try {
        const {email: email} = req.user;
        if(!email) {
            throw new BadRequestError('Please provide email');
        }
        const response = await services.loginGoogle(req.user);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        // const { error } = joi.object({refresh_token}).validate(req.body);
        // if (error) {
        //     return res.status(400).json({msg: error.details[0].message});
        // }
        const {refresh_token: refresh_token} = req.body;
        if(!refresh_token) {
            throw new BadRequestError('Please provide refresh_token');
        }
        const response = await services.refreshAccessToken(req.body.refresh_token);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const logout = async (req, res) => {
    try {
        // const { error } = joi.object({student_id}).validate(req.query);
        // if (error) {
        //     return res.status(400).json({msg: error.details[0].message});
        // }
        const {user_id: user_id} = req.query;
        if(!user_id) {
            throw new BadRequestError('Please provide user_id');
        }
        const response = await services.logout(req.query.user_id);
        return res.status(200).json(response);
    } catch (error) {
        throw new InternalServerError(error);
    }
};

const register = async (req, res) => {
    try {
        const {email: email, password: password, confirm_pass: confirm_pass} = req.body;
        if(!email) {
            throw new BadRequestError('Please provide email');
        }
        if(!password) {
            throw new BadRequestError('Please provide password');
        }
        if(!confirm_pass) {
            throw new BadRequestError('Please provide confirm password');
        }
        const response = await services.register(req.body)
        return res.status(200).json(response)

    } catch (error) {
        throw new InternalServerError(error);
    }
}

const login = async (req, res) => {
    try {
        const {email: email, password: password} = req.body;
        if(!email) {
            throw new BadRequestError('Please provide email');
        }
        if(!password) {
            throw new BadRequestError('Please provide password');
        }
        const response = await services.login(req.body)
        if (response.mes == 'Not found account' || response.mes == 'Password is wrong') {
            return res.status(401).json(response)
        } else {
            return res.status(200).json(response)
        }
    } catch (error) {
        console.log(error);
        throw new InternalServerError(error);
    }
}

module.exports = {refreshAccessToken, logout, login, register, loginGoogle };
