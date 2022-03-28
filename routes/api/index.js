// this files collects all the api routes and packages them up for us.
const router = require('express').Router();

const userRoutes = require('./user-routes');

router.use('/users', userRoutes);

module.exports = router;