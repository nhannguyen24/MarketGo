const {UnauthenticatedError} = require('../errors');

const isAdmin = (req, res, next) => {
    const { role_name } = req.user;
    if (role_name !== 'Admin') 
    throw new UnauthenticatedError('Require role Admin');
    next();
};

module.exports = isAdmin;