-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS professional_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role_title TEXT NOT NULL,
  industry TEXT NOT NULL,
  bio TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  calendly_link TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Public can SELECT only approved profiles
CREATE POLICY "Public can view approved profiles"
  ON professional_profiles
  FOR SELECT
  USING (is_approved = true);

-- Policy: Service role can do everything (admin operations)
-- Note: This policy allows service role key to bypass RLS
-- In your app, you'll use the service role key for admin operations
CREATE POLICY "Service role can do everything"
  ON professional_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_professional_profiles_approved ON professional_profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_company ON professional_profiles(company);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_industry ON professional_profiles(industry);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_professional_profiles_updated_at
  BEFORE UPDATE ON professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create booking_requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  preferred_times TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'SCHEDULED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for booking_requests
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can INSERT booking requests
CREATE POLICY "Anyone can create booking requests"
  ON booking_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Service role can do everything (admin operations)
CREATE POLICY "Service role can do everything on booking requests"
  ON booking_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_booking_requests_professional_id ON booking_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at DESC);

-- Create trigger to automatically update updated_at for booking_requests
CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
