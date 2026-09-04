const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.waxfxmutnpcyrembtvbh:BuatUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  await client.connect();
  const res = await client.query(`SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'rsvps_status_check';`);
  console.log(res.rows);
  await client.end();
}
check();
