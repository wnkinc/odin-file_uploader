const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_LOCAL_URL,
});
