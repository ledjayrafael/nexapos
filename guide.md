NexaPOS Deployment Guide (Supabase & Vercel)
Follow these steps to deploy your multi-tenant POS application from local development to production.

Part 1: Supabase Configuration
1. Create a New Project
Log in to Supabase Dashboard.
Click New Project and select your organization.
Name your project (e.g., NexaPOS), set a database password, and choose a region close to your users.
Wait for the database to provision.
2. Initialize the Database
In your project dashboard, go to the SQL Editor in the left sidebar.
Click New Query.
Copy the entire content of your local migration file: 
nexapos/supabase/migrations/20260305143606_schema_and_rls.sql
.
Paste it into the editor and click Run.
This sets up all tables, RLS policies, and the stock reduction trigger.
3. Configure Storage
Go to Storage in the left sidebar.
Ensure a bucket named product-images exists (the SQL script should have created it).
Check the settings for product-images. It should be Public so images can be viewed by anyone with the link.
Verify that the RLS policies for storage allow authenticated users to upload items.

Part 2: GitHub Repository
1. Initialize Git & Identify Yourself
Buka terminal dan masuk ke folder nexapos:
cd nexapos

Jika muncul error "Author identity unknown", jalankan ini dulu:
git config --global user.email "email@anda.com"
git config --global user.name "Nama Anda"

Lalu inisialisasi dan commit:
git init
git add .
git commit -m "initial commit: NexaPOS complete"

Catatan: Folder node_modules, .next, dan file .env.local akan otomatis diabaikan (TIDAK diupload) karena sudah ada file .gitignore. Ini sudah benar.

2. Push ke GitHub
Buat repo baru di GitHub, lalu ikuti instruksi "push an existing repository" di sana.

Part 3: Vercel Deployment
1. Import Project
Log in to Vercel.
Click Add New > Project.
Import your NexaPOS repository from GitHub.
2. Configure Environment Variables
In the Environment Variables section, add the following (get these from your Supabase Dashboard > Project Settings > API):

Key	Value
NEXT_PUBLIC_SUPABASE_URL	Your Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY	Your Supabase Anon Key
SUPABASE_SERVICE_ROLE_KEY	Your Supabase Service Role Key
IMPORTANT

The SUPABASE_SERVICE_ROLE_KEY is required for the Developer role to create cashier accounts through the Supabase Admin API.

3. Deploy
Click Deploy.
Once finished, visit your production URL!

Part 4: Post-Deployment Steps
Register as Developer: Go to your production URL's /login page and click Sign Up. The first user created always becomes the Developer for a new store.
Access Developer Panel: Log in and navigate to /developer to start managing your cashiers.
Verify RLS: Data entered by one store's users will not be visible to users of another store, thanks to the RLS policies tied to the store_id.