const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.waxfxmutnpcyrembtvbh:BukuUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase!");

    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20260821000000_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Running migration...");
    await client.query(sql);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Error executing migration:", err);
  } finally {
    await client.end();
  }
}

run();
