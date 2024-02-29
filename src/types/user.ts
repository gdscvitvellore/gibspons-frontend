export interface loginRes {
  data: {
    id: number;
    name: string;
    email: string;
    username: string;
    organisation: number | null;
    role: "user" | "admin" | null;
    access_token: string;
    refresh_token: string;
  };
}

export interface registerRes {
  id: number;
  name: string;
  email: string;
  username: string;
  organisation: number | null;
  role: "user" | "admin" | null;
}
