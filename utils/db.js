import pg from 'pg';
import dotenv from 'dotenv';

const db= new pg.Client({
    user: process.env.DB_USER_NAME,
    host: 'localhost',
    database: process.env.DB_DATABASE_NAME,
    password: String(process.env.DB_PASSWORD),
    port: 5432,
});

export default db;