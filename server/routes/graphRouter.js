const express = require('express');
const graphRouter = express.Router();

const graphController = require('../controllers/graphController');

// TODO - retrieve all graph names for user - expect on dashboard page load
graphRouter.get('/:userId', (req, res) => {
    // return all graphs in database with :userid -- expect from dashboard page
});

// TODO - get specific graph for user - expect dashboard redirect to this endpoint
graphRouter.get('/:userId/:graphId', (req, res) => {
    // retrieve specific graph
});

// TODO - save graph for user - expect from graph page 'save' button
graphRouter.post('/:userId/:graphId', (req, res) => {
    // save graph
    console.log('Reached /api/graph/:userId/:graphId');
});

module.exports = graphRouter;