require('express-async-errors');
const auth = require('./auth');
const user = require('./user');
const city = require('./city');
const store = require('./store');

// const firebaseService = require('./firebaseService');
// const role = require('./role');
// const category = require('./category');
// const statistic = require('./statistic')
// const stripe = require('./payment');
// const mail = require('./forgotPassword');

const notFoundMiddleware = require('../middlewares/not-found');
const errorHandlerMiddleware = require('../middlewares/error_handler');

const initRoutes = (app) => {
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/users', user);
    app.use('/api/v1/cities', city);
    app.use('/api/v1/stores', store);

    // app.use('/api/v1', firebaseService);
    
    // app.use('/api/v1/categories', category);
    // app.use('/api/v1/roles', role);
    // app.use('/api/v1/statistic', statistic);
    // app.use('/api/v1/stripe', stripe);
    // app.use('/api/v1/forgotpass', mail);

    app.use('/', (req, res) => {
        res.status(200).send('Hello!')
    });

    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);
}

module.exports = initRoutes;
