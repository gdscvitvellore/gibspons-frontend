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
  name: string;
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
}

export interface compResp {
  id: number;
  name: string;
  website: string;
  industry: string;
  linkedin: string;
  status: "No Reply" | "Accepted" | "Rejected" | "In Progress" | "None";
  event: number;
}

export interface pocResp {
  id: number;
  name: string;
  designation: string;
  company: number;
  email: string;
  linkedin: string;
  phone: string;
}

export interface sponsByEvent {
  updated_at: string;
  company_name: string;
  name: string;
  added_by: string;
  status: "No Reply" | "Accepted" | "Rejected" | "In Progress" | "None";
}