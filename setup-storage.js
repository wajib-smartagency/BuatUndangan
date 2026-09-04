const { Client } = require('pg');

const connectionString = 'postgresql://postgres.waxfxmutnpcyrembtvbh:BuatUndangan%23123@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function setupStorage() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log("Connected to DB...");

    // Create bucket if not exists
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('invitations', 'invitations', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log("Bucket 'invitations' ready.");

    // Setup policies for public access & inserts
    const policies = `
      -- Allow public viewing
      CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'invitations');
      
      -- Allow authenticated users to insert
      CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'invitations' AND auth.role() = 'authenticated');
      
      -- Allow authenticated users to update their own
      CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'invitations' AND auth.role() = 'authenticated');
      
      -- Allow authenticated users to delete their own
      CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'invitations' AND auth.role() = 'authenticated');
    `;
    
    try {
      await client.query(policies);
      console.log("Storage policies created.");
    } catch (err) {
      console.log("Policies might already exist:", err.message);
    }
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

setupStorage();
