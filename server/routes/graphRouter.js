const express = require('express');
const graphRouter = express.Router();

const userController = require('../controllers/userController');
const graphController = require('../controllers/graphController');

// TODO - retrieve all graph names for user - expect on dashboard page load
graphRouter.get('/:userId', (req, res, next) => {
    // return all graphs in database with :userid -- expect from dashboard page
});

// TODO - create new graph for user - expect from dashboard graph name modal
graphRouter.post('/:userId',
    userController.validateJWT,
    graphController.createGraph,
    (req, res, next) => {
        console.log('Reached POST /api/graph/:userId');
        // payload inclues username, user_id, graph_name, graph_id
        return res.status(201).json(res.locals.user);  // return new graphId
});

// TODO - save graph for user - expect from graph page 'save' button
graphRouter.put('/:userId/:graphId',
    userController.validateJWT,
    graphController.saveGraph,
    (req, res, next) => {
        // save updated graph
        // req.body inclues username, userId, graphName, graphId, nodes, edges
        console.log('Reached PUT /api/graph/:userId/:graphId');
        return res.status(200).json(res.locals.user);
});

// TODO - get specific graph for user - expect dashboard selection of old graph
graphRouter.get('/:userId/:graphId',
    userController.validateJWT,
    graphController.getGraph,
    (req, res, next) => {
        // retrieve specific graph
        console.log('Reached GET /api/graph/:userId/:graphId');
        // payload inclues username, userId, graphName, graphId, nodes, edges
        return res.status(200).json(res.locals.user)
});



module.exports = graphRouter;