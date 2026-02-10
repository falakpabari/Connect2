# Connect2

A clean, invite-only networking marketplace MVP connecting students with top professionals from leading companies.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel-ready

## Features

- 🔒 **Invite-only**: Professionals cannot self-sign-up
- 👨‍💼 **Admin-managed**: Only admins can create/edit/approve professional profiles
- 🔍 **Public directory**: Browse approved professionals with search and filters
- 💼 **Professional profiles**: Detailed profiles with booking integration
- 🔐 **Magic link auth**: Secure admin authentication via email
- 📱 **Responsive design**: Beautiful UI that works on all devices

## Local Setup

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### Step 1: Clone and Install

```bash
cd Connect2
npm install
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (takes ~2 minutes)

### Step 3: Run Database Migrations

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Create a new query and paste the contents of `supabase/schema.sql`
3. Click **Run** to create the tables and policies
4. Create another new query and paste the contents of `supabase/seed.sql`
5. Click **Run** to seed the database with 15 sample professionals

### Step 4: Configure Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your project URL and keys
3. Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Configuration (comma-separated emails)
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

⚠️ **Important**: Replace the placeholder values with your actual Supabase credentials and admin email(s).

### Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Public Pages

- **Landing page**: `/` - Hero section with CTA
- **Directory**: `/professionals` - Browse and filter professionals
- **Profile**: `/professionals/[id]` - View individual professional profiles

### Admin Pages

1. Go to `/admin/login`
2. Enter your admin email (must be in `ADMIN_EMAILS` env var)
3. Check your email for the magic link
4. Click the link to access `/admin/professionals`
5. Create, edit, approve/unapprove, or delete professional profiles

### How to Add a New Professional (Admin)

1. Log in as admin at `/admin/login`
2. Click **"+ Add Professional"**
3. Fill in the form:
   - **Name**: Professional's full name
   - **Company**: Their current company
   - **Role Title**: Their job title
   - **Industry**: e.g., "Management Consulting", "Technology", "Finance"
   - **Bio**: A compelling description of their background and what they can help with
   - **Price (in cents)**: e.g., 25000 = $250/session
   - **Calendly Link**: (Optional) Their Calendly scheduling link
   - **Approved**: Check to make visible to public immediately
4. Click **"Create Profile"**

## Project Structure

```
Connect2/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout with header/footer
│   ├── globals.css                   # Global styles
│   ├── professionals/
│   │   ├── page.tsx                  # Directory with filters
│   │   └── [id]/page.tsx             # Individual profile page
│   ├── admin/
│   │   ├── login/page.tsx            # Admin login
│   │   └── professionals/page.tsx    # Admin CRUD interface
│   └── api/
│       └── admin/
│           ├── check/route.ts        # Check admin status
│           └── professionals/
│               ├── route.ts          # GET all, POST new
│               └── [id]/route.ts     # PUT update, DELETE
├── components/
│   └── ProfessionalCard.tsx          # Reusable profile card
├── lib/
│   ├── types.ts                      # TypeScript interfaces
│   ├── utils.ts                      # Utility functions
│   ├── auth.ts                       # Admin auth helpers
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client
├── supabase/
│   ├── schema.sql                    # Database schema + RLS policies
│   └── seed.sql                      # Sample data (15 profiles)
└── README.md
```

## Database Schema

### professional_profiles

| Column         | Type      | Description                          |
|----------------|-----------|--------------------------------------|
| id             | uuid      | Primary key                          |
| name           | text      | Professional's name                  |
| company        | text      | Current company                      |
| role_title     | text      | Job title                            |
| industry       | text      | Industry category                    |
| bio            | text      | Professional bio                     |
| price_cents    | integer   | Session price in cents               |
| calendly_link  | text      | Optional Calendly URL                |
| is_approved    | boolean   | Visibility flag (default: false)     |
| created_at     | timestamp | Creation timestamp                   |
| updated_at     | timestamp | Last update timestamp                |

### Row Level Security (RLS)

- **Public**: Can SELECT only where `is_approved = true`
- **Service Role**: Full access (used by admin API routes)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the environment variables from `.env.local`
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Security Notes

- Admin emails are checked server-side via environment variables
- Service role key is only used in server-side API routes
- Row Level Security (RLS) ensures public users only see approved profiles
- Magic link authentication provides secure, passwordless admin access

## Support

For issues or questions, please open an issue on GitHub.

## License

See LICENSE file for details.
