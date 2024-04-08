export interface loginRes {
  data: {
    id: number;
    name: string;
    email: string;
    username: string;
    organisation: string | null;
    is_approved: boolean;
    role: "user" | "admin" | "owner" | null;
    access_token: string;
    refresh_token: string;
  };
}

export interface user{
  id: number;
  name: string;
  email: string;
  username: string;
  organisation: string | null;
  role: "user" | "admin" | "owner" | null;
  is_approved: boolean;
}

export interface registerRes {
  id: number;
  name: string;
  email: string;
  username: string;
  organisation: null;
  role: "user";
}
