import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectPostgres = async () => {
  try {
    await pool.connect();
    console.log("✅ PostgreSQL connected");
  } catch (err) {
    console.error("Postgres Error:", err);
    process.exit(1);
  }
};

export { pool };