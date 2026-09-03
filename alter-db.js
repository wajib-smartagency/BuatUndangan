const { Client } = require('pg');

const connectionString = 'postgresql://postgres.waxfxmutnpcyrembtvbh:BukuUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    // Add content column if it doesn't exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='content') THEN
          ALTER TABLE public.projects ADD COLUMN content jsonb DEFAULT '{}'::jsonb;
        END IF;
      END
      $$;
    `);
    console.log("Successfully added 'content' column to 'projects' table.");
  } catch (err) {
    console.error("Error altering table:", err);
  } finally {
    await client.end();
  }
}
run();
