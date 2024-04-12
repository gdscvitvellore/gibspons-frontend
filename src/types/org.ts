export interface membersByOrg {
  id: number;
  name: string;
  email: string;
  username: string;
  organisation: number;
  role: string;
  is_approved: boolean | null;
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
