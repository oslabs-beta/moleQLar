const { Pool } = require('pg');
require('dotenv').config();

const PG_URI = process.env.SQL_DATABASE_URI;

const pool = new Pool({
  connectionString: PG_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = {}

db.query = (text, params, callback) => {
  console.log('Executed query:', text);
  return pool.query(text, params, callback);
}

db.testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Successfully connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
}

// for GraphQL resolvers
db.queryUser = async (userId) => {
  const params = [userId];
  const query = 'SELECT * FROM users WHERE user_id = $1';
  const response = await db.query(query, params);
  const user = {
    userId: response.rows[0].user_id,
    username: response.rows[0].username,
    email: response.rows[0].email,
    password: response.rows[0].password,
    role: response.rows[0].role,
  }
  return user;
}

db.queryGraph = async (graphId) => {
  const params = [graphId];
  const query = 'SELECT * FROM graphs WHERE graph_id = $1';
  const response = await db.query(query, params);
  const graph = {
    graphId: response.rows[0].graph_id,
    userId: response.rows[0].user_id,
    graphName: response.rows[0].graph_name,
    nodes: response.rows[0].nodes,
    edges: response.rows[0].edges,
  }
  return graph;
}

db.queryGraphs = async (userId) => {
  const params = [userId];
  const query = 'SELECT * FROM graphs WHERE user_id = $1';
  const response = await db.query(query, params);
  const graphs = [];
  for (let i = 0; i < response.rows.length; i++) {
    graphs.push({
      graphId: response.rows[i].graph_id,
      userId: response.rows[i].user_id,
      graphName: response.rows[i].graph_name,
      nodes: response.rows[i].nodes,
      edges: response.rows[i].edges,
    })
  }
  return graphs;
}

// export an object with query property that returns an invocation of pool.query
// require it in controller to be the access point to our database
module.exports = db;