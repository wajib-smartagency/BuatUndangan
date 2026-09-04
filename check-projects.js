const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.waxfxmutnpcyrembtvbh:BuatUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } });
async function check() {
  await client.connect();
  const res = await client.query(`SELECT id, title, slug FROM projects;`);
  console.log(res.rows);
  await client.end();
}
check();
