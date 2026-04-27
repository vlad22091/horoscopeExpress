import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS horoscope (
    id SERIAL PRIMARY KEY,
    sign TEXT,
    month TEXT,
    text TEXT,
    reaction VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (month)
)`;

pool.query(createTableQuery)

export default pool;
