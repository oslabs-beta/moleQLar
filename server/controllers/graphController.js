const db = require('../models/userModels');

const graphController = {};

graphController.createGraph = async (req, res, next) => {
    const { userId, graphName } = req.body;
    if (!userId || !graphName) {
        return res.status(422).json({ error: 'Missing required parameters' });
    }
    const nodeString = '', edgeString = '';

    const params = [userId, graphName, nodeString, edgeString];
    const query = `
        INSERT INTO graphs(user_id, graph_name, nodes, edges)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
    try {
        const newGraph = await db.query(query, params);
        res.locals.user = { 
            graphId: newGraph.rows[0].graph_id,
            graphName: newGraph.rows[0].graph_name,
            userId: userId
        };
        return next();
    } catch (err) {
        console.log(err);
        return next({
            log: 'Error in graphController.createGraph',
            message: `Unable to create new graph for user ${userId} and graph name ${graphName}`,
            status: 409,
        });
    }
};

graphController.getGraph = async (req, res, next) => {
    const { userId, graphId } = req.params;
    if (!userId || !graphId) {
        return res.status(422).json({ error: 'Missing required parameters' });
    }

    const params = [graphId, userId];
    const query = `SELECT * FROM graphs WHERE graph_id = $1 AND user_id = $2`
    try {
        const graph = await db.query(query, params);
        res.locals.user.graphId = graph.rows[0].graph_id;
        res.locals.user.graphName = graph.rows[0].graph_name;
        res.locals.user.nodes = graph.rows[0].nodes;
        res.locals.user.edges = graph.rows[0].edges;
        return next();
    } catch (err) {
        console.log(err);
        return next({
            log: 'Error in graphController.getGraph',
            message: 'Unable to retrieve graph from database',
            status: 500,
        })
    }
}


graphController.getGraphList = async (req, res, next) => {
    if (!res.locals.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const { userId } = res.locals.user;

    const params = [userId];
    const query = `SELECT * FROM graphs WHERE user_id = $1`;

    try {
        const dbResponse = await db.query(query, params);
        const graphList = [];
        for (let i = 0; i < dbResponse.rows.length; i++) {
            const row = dbResponse.rows[i];
            graphList.push({
                graph_id: row['graph_id'],
                graph_name: row['graph_name'],
            });
        }
        res.locals.user.graphList = graphList;
        return next();
    } catch (err) {
        console.log(err);
        return next({
            log: 'Error in graphController.getGraphList',
            message: `Unable to pull graph list for userId: ${userId}`,
            status: 500,
        });
    }
};

graphController.saveGraph = async (req, res, next) => {
    const { userId, graphName, graphId, nodes, edges } = req.body;
    if (!userId || !graphName || !graphId || !nodes || !edges) {
        return res.status(422).json({ error: 'Missing required parameters' });
    }

    const params = [graphName, nodes, edges, graphId, userId];
const query = `
    UPDATE graphs
    SET graph_name = $1, nodes = $2, edges = $3
    WHERE graph_id = $4 AND user_id = $5
    RETURNING *`;

try {
    const updatedGraph = await db.query(query, params);
    res.locals.user.userId = updatedGraph.rows[0].user_id;
    res.locals.user.graphName = updatedGraph.rows[0].graph_name;
    res.locals.user.graphId = updatedGraph.rows[0].graph_id;
    res.locals.user.nodes = updatedGraph.rows[0].nodes;
    res.locals.user.edges = updatedGraph.rows[0].edges;
    return next();
} catch (err) {
    console.log(err);
    return next({
        log: 'Error in graphController.saveGraph',
        message: 'Unable to update graph in database',
        status: 500,
    });
}
}

module.exports = graphController;