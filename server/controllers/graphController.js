const db = require('../models/userModels');

const graphController = {};

graphController.createGraph = async (req, res, next) => {
    // create new graph in database
    const { user_id, graph_name } = req.body;
    // console.log('user_id:', user_id);
    // console.log('graph_name:', graph_name);
    const nodes_string = '', edges_string = '';  // initialize as empty

    const params = [user_id, graph_name, nodes_string, edges_string];
    const query = `
        INSERT INTO graphs(user_id, graph_name, nodes, edges)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
    try {
        const newGraph = await db.query(query, params);
        // success
        res.locals.user.graph_id = newGraph.rows[0].graph_id;
        res.locals.user.graph_name = newGraph.rows[0].graph_name;
        return next();
    } catch (err) {
        // fail
        console.log(err);
        return next({
            log: 'Error in graphController.createGraph',
            message: `Unable to create new graph for user ${res.locals.user.username} and graph name ${graphName}`,
            status: 409,
        });
    }
}


module.exports = graphController
