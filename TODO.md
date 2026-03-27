# Golf Charity Platform TODO

## Current Task: Fix RLS Infinite Recursion Error ✓ FIXED VIA SQL SCRIPT

**✅ Complete**:
- [x] Analysis & root cause: users table policy recursion
- [x] Generated `supabase/fix-rls-recursion.sql` 
- [x] Generated `supabase/schema-fixed.sql` for future
- [x] Updated TODO.md

**Final Steps** (User):
1. Supabase Dashboard → SQL Editor → Run `fix-rls-recursion.sql`
2. `cd golf-charity-platform && npx next dev`
3. Test http://localhost:3000/signup → Charities load without error!

**Next Features**:
- JWT admin roles implementation
- Full test suite

