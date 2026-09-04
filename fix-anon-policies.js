const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.waxfxmutnpcyrembtvbh:BuatUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixPolicies() {
  await client.connect();
  console.log("Connected to DB...");

  const queries = [
    `CREATE POLICY "Anon update guest" ON guests FOR UPDATE USING (true);`,
    `CREATE POLICY "Anon insert rsvp" ON rsvps FOR INSERT WITH CHECK (true);`,
    `CREATE POLICY "Anon select guest" ON guests FOR SELECT USING (true);`,
    `CREATE POLICY "Anon select rsvp" ON rsvps FOR SELECT USING (true);`
  ];

  for (const q of queries) {
    try {
      await client.query(q);
      console.log("Executed: ", q);
    } catch(e) {
      console.log("Error or already exists: ", e.message);
    }
  }

  await client.end();
}

fixPolicies();
