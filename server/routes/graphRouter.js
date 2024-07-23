const express = require('express');
const graphRouter = express.Router();
const graphController = require('../controllers/graphController');

// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;  
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Retrieve all graph names for user - expect on dashboard page load
graphRouter.get('/:userId', 
  ensureAuthenticated,
  graphController.getGraphList,
  (req, res) => {
    console.log('Reached GET /api/graph/:userId');
    return res.status(200).json(res.locals.user);
  }
);

// Create new graph for user - expect from dashboard graph name modal
graphRouter.post('/:userId', 
  ensureAuthenticated,
  graphController.createGraph,
  (req, res) => {
    console.log('Reached POST /api/graph/:userId');
    return res.status(201).json(res.locals.user);  // return new graphId
  }
);

// Save graph for user - expect from graph page 'save' button
graphRouter.put('/:userId/:graphId', 
  ensureAuthenticated,
  graphController.saveGraph,
  (req, res) => {
    console.log('Reached PUT /api/graph/:userId/:graphId');
    return res.status(200).json(res.locals.user);
  }
);

// Get specific graph for user - expect dashboard selection of old graph
graphRouter.get('/:userId/:graphId', 
  ensureAuthenticated,
  graphController.getGraph,
  (req, res) => {
    console.log('Reached GET /api/graph/:userId/:graphId');
    return res.status(200).json(res.locals.user);
  }
);

module.exports = graphRouter;