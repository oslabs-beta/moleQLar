const { Pool } = require("pg");
require("dotenv").config();

const PG_URI = process.env.SQL_DATABASE_URI;

const pool = new Pool({
  connectionString: PG_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

// export an object with query property that returns an invocation of pool.query
// require it in controller to be the access point to our database
module.exports = {
  query: (text, params, callback) => {
    // console.log('executed query', text);
    return pool.query(text, params, callback);
  },
  testConnection: async () => {
    try {
      await pool.query("SELECT 1");
      console.log("Successfully connected to the database");
    } catch (err) {
      console.error("Error connecting to the database", err);
    }
  },
};
