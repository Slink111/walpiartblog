// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://ctnuznfvwazswxewniko.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bnV6bmZ2d2F6c3d4ZXduaWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjgzOTIsImV4cCI6MjA5MDIwNDM5Mn0.LNMFTyIyqhtwQ3tMh700vHCNvXg5r1JDkP5xyErkkqU';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin credentials
const ADMIN_USERNAME = 'tojowalpiuser';

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase, ADMIN_USERNAME };
}
