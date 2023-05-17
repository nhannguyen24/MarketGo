const {UnauthenticatedError} = require('../errors');

const isAdmin = (req, res, next) => {
    const { role_name } = req.user;
    if (role_name !== 'Admin') 
    throw new UnauthenticatedError('Require role Admin');
    next();
};

const isSeller = (req, res, next) => {
    const { role_name } = req.user;
    if (role_name !== 'Seller') 
    throw new UnauthenticatedError('Require role Seller');
    next();
};

const isAdminOrSeller = (req, res, next) => {
    const { role_name } = req.user;
    if (role_name !== 'Admin' && role_name !== 'Seller') {
      throw new UnauthenticatedError('Require role Admin or Seller');
    }
    next();
  };

module.exports = {isAdmin, isSeller, isAdminOrSeller};