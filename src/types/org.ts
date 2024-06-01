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

export interface companyByOrg {
  id: number;
  name: string;
  website: string;
  industry: string;
  linkedin: string;
  status: string;
  event: number;
}

export interface sponsByOrg {
  id: number;
  company: number;
  poc: null | pocResp[];
  event: number;
  event_name: string;
  contacted_by: number;
  user_name: string;
  status: "No Reply" | "Accepted" | "Rejected" | "In Progress" | "Not Contacted";
  type_of_sponsorship: null | string;
  money_donated: number;
  additional: null | string;
  company_name: string;
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
  money_raised: number;
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

export interface sponsorships {
  id: number;
  company: number;
  poc: null | number;
  poc_name: string;
  event: number;
  event_name: string;
  contacted_by: number;
  updated_at: string;
  user_name: string;
  status: string;
  type_of_sponsorship: string;
  money_donated: number;
  additional: string;
  remarks: string;
  company_name: string;
}

export interface sponsByEvent {
  event: Event;
  sponsorships: sponsorships[];
  total_money_raised: number;
}
