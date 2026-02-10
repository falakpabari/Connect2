export interface ProfessionalProfile {
  id: string;
  name: string;
  company: string;
  role_title: string;
  industry: string;
  bio: string;
  price_cents: number;
  calendly_link: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfileInsert {
  name: string;
  company: string;
  role_title: string;
  industry: string;
  bio: string;
  price_cents: number;
  calendly_link?: string | null;
  is_approved?: boolean;
}

export interface ProfessionalProfileUpdate {
  name?: string;
  company?: string;
  role_title?: string;
  industry?: string;
  bio?: string;
  price_cents?: number;
  calendly_link?: string | null;
  is_approved?: boolean;
}
