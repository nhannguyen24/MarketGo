require('express-async-errors');
const auth = require('./auth');
const user = require('./user');
const city = require('./city');
const store = require('./store');
const role = require('./role');
const ingredient = require('./ingredient');
const food = require('./food');
const category = require('./category');
const step = require('./guild_step');
const category_detail = require('./category_detail');
const order_detail = require('./order_detail');
const upload_image = require('./uploadFile');

// const firebaseService = require('./firebaseService');
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
    app.use('/api/v1/roles', role);
    app.use('/api/v1/ingredients', ingredient);
    app.use('/api/v1/foods', food);
    app.use('/api/v1/steps', step);
    app.use('/api/v1/categories', category);
    app.use('/api/v1/categories-detail', category_detail);
    app.use('/api/v1/order-detail', order_detail);
    app.use('/api/v1/categories_detail', category_detail);
    app.use('/api/v1/upload-image', upload_image);

    // app.use('/api/v1', firebaseService);
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
