/**
 * Setup Script: Creates an admin user for the Golf Charity Platform
 * 
 * Run this AFTER you've executed schema.sql in the Supabase SQL Editor.
 * Usage: node setup-admin.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mvcjdgclywwtiopssyot.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Y2pkZ2NseXd3dGlvcHNzeW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjY4NzEsImV4cCI6MjA5MDIwMjg3MX0.1JhACLYmSqKIfPDAf4RmmZOS-wKAtPiqRq4K-RCvy20';

const ADMIN_EMAIL = 'admin@golfcharity.com';
const ADMIN_PASSWORD = 'Admin@123';

async function setupAdmin() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🔧 Creating admin user...');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('');

  // Step 1: Sign up the admin user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('⚠️  User already exists. Trying to sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      if (signInError) {
        console.error('❌ Sign in failed:', signInError.message);
        process.exit(1);
      }
      console.log('✅ Signed in as existing user:', signInData.user.id);
      
      // Update role to admin
      const { error: updateErr } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', signInData.user.id);
      
      if (updateErr) {
        console.error('❌ Failed to update role:', updateErr.message);
      } else {
        console.log('✅ Role updated to admin!');
      }
      return;
    }
    console.error('❌ Signup error:', authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  if (!userId) {
    console.error('❌ No user id returned');
    process.exit(1);
  }

  console.log(`✅ Auth user created: ${userId}`);

  // Step 2: Create the profile in users table with admin role
  const { error: profileError } = await supabase.from('users').insert({
    id: userId,
    name: 'Platform Admin',
    email: ADMIN_EMAIL,
    role: 'admin',
    subscription_status: 'active',
    subscription_type: 'yearly',
    subscription_start: new Date().toISOString(),
    renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    charity_percentage: 10,
  });

  if (profileError) {
    console.error('❌ Profile creation error:', profileError.message);
    process.exit(1);
  }

  console.log('✅ Admin profile created!');
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('   Admin Account Ready!');
  console.log('═══════════════════════════════════════');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('You can now log in at http://localhost:3001/login');
}

setupAdmin().catch(console.error);
