const express = require('express');
const graphRouter = express.Router();

const userController = require('../controllers/userController');
const graphController = require('../controllers/graphController');

// TODO - create new graph for user - expect from dashboard page
graphRouter.post('/:userId',
    userController.validateJWT,
    graphController.createGraph,
    (req, res, next) => {
        console.log('Reached /api/graph/:userId');
        return res.status(201).json(res.locals.user);  // return new graphId
});

// TODO - retrieve all graph names for user - expect on dashboard page load
graphRouter.get('/:userId', (req, res, next) => {
    // return all graphs in database with :userid -- expect from dashboard page
});

// TODO - save graph for user - expect from graph page 'save' button
graphRouter.post('/:userId/:graphId', (req, res, next) => {
    // save graph
    console.log('Reached /api/graph/:userId/:graphId');
});

// TODO - get specific graph for user - expect dashboard redirect to this endpoint
graphRouter.get('/:userId/:graphId', (req, res, next) => {
    // retrieve specific graph
});



module.exports = graphRouter;