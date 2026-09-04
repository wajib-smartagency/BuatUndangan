const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.waxfxmutnpcyrembtvbh:BuatUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect().then(() => {
  return client.query(`CREATE POLICY "Anyone can insert guest" ON guests FOR INSERT WITH CHECK (true);`);
}).then(() => console.log('Policy added')).catch(e => console.log(e.message)).finally(() => client.end());
