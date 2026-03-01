import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Initialize the database connection pool using the provided URL
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default pool;
