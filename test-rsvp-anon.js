const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://waxfxmutnpcyrembtvbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheGZ4bXV0bnBjeXJlbWJ0dmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgxMjEsImV4cCI6MjEwMjg2NDEyMX0.5od78ccMfKaKqvhNUuwyeKJFXReVtzzkgmzC0BvcrbA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRsvp() {
  // Use the Dedi project
  const projectId = 'c8aca1ac-4ab5-4ce9-89b9-c5434a8b666f';
  const uniqueToken = 'test-token-123';
  
  console.log("Inserting guest...");
  const { data: newGuest, error: guestError } = await supabase
    .from('guests')
    .insert([{ project_id: projectId, name: "Test Anon", unique_token: uniqueToken }])
    .select()
    .single();

  if (guestError) {
    console.error("Guest error:", guestError);
    return;
  }
  
  console.log("Guest inserted:", newGuest);
  
  console.log("Inserting rsvp...");
  const { error: rsvpError } = await supabase.from('rsvps').insert([
    {
      project_id: projectId,
      guest_id: newGuest.id,
      status: "Hadir",
      message: "Hello world"
    }
  ]);
  
  if (rsvpError) {
    console.error("RSVP error:", rsvpError);
  } else {
    console.log("RSVP successful");
  }
}

testRsvp();
