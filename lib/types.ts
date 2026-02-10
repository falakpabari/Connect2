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

export interface BookingRequest {
  id: string;
  professional_id: string;
  student_name: string;
  student_email: string;
  preferred_times: string;
  note: string | null;
  status: 'NEW' | 'CONTACTED' | 'SCHEDULED';
  created_at: string;
  updated_at: string;
}

export interface BookingRequestInsert {
  professional_id: string;
  student_name: string;
  student_email: string;
  preferred_times: string;
  note?: string;
}

export interface BookingRequestWithProfessional extends BookingRequest {
  professional_name: string;
  professional_company: string;
}
