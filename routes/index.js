require('express-async-errors');
const auth = require('./auth');
// const student = require('./student');
// const firebaseService = require('./firebaseService');
// const project = require('./project');
// const major = require('./major');
// const role = require('./role');
// const category = require('./category');
// const application = require('./application');
// const deliverable = require('./deliverable');
// const statistic = require('./statistic')
// const stripe = require('./payment');
// const mail = require('./forgotPassword');
const notFoundMiddleware = require('../middlewares/not-found');
const errorHandlerMiddleware = require('../middlewares/error_handler');

const initRoutes = (app) => {
    app.use('/api/v1/auth', auth);
    // app.use('/api/v1/students', student);
    // app.use('/api/v1', firebaseService);
    // app.use('/api/v1/projects', project);
    // app.use('/api/v1/majors', major);
    // app.use('/api/v1/categories', category);
    // app.use('/api/v1/roles', role);
    // app.use('/api/v1/applications', application);
    // app.use('/api/v1/deliverables', deliverable);
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
