export interface membersByOrg {
  id: number;
  name: string;
  email: string;
  username: string;
  organisation: number;
  role: string;
  is_approved: boolean | null;
  created_at: string;
}

export interface sponsByOrg {
  id: number;
  name: string
  website: string;
  industry: string;
  linkedin: string;
  status: string;
  event: number;
}

export interface Event {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  expected_reg: number;
  description: string;
  brochure: string | null;
  logo: string | null;
};