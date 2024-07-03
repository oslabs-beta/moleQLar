const { Pool } = require('pg');

const PG_URI =
'postgresql://postgres.cysmoheuclhnggrbjhqy:codesmithgroup1@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

// CREATE TABLE Users ( 
//   id SERIAL PRIMARY KEY, 
//   username VARCHAR(255) UNIQUE NOT NULL, 
//   firstname VARCHAR(255),
//   lastname VARCHAR(255), 
//   email VARCHAR(255), 
//   password VARCHAR(255) NOT NULL,
//   role VARCHAR(255) ); 

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
      await pool.query('SELECT 1');
      console.log('Successfully connected to the database');
    } catch (err) {
      console.error('Error connecting to the database', err);
    }
  },
};
