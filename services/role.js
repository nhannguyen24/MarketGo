const db = require('../models');
const { Op } = require('sequelize');

const getAllRoles = ({role_name, ...query}) => new Promise( async (resolve, reject) => {
    try {
        const queries = {raw: true, nest: true};
        if(role_name) query.role_name = {[Op.substring]: role_name}

        const roles = await db.Role.findAndCountAll({
            where: query,
            ...queries,
        });
        resolve({
            msg: roles ? `Got role` : 'Cannot find role',
            roles: roles
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = { getAllRoles };
