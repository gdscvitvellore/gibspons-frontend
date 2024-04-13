"use client";

import axios from "axios";
import { organisation } from "@/store/organisation";
import { membersByOrg, sponsByOrg } from "@/types/org";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getOrganisation(
  accessToken: string | null
): Promise<organisation> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(`${BaseURL}/app/organisation/`, {
      headers,
    });
    const data: organisation = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function getMembersByOrg(
  accessToken: string,
  org_id: number
): Promise<membersByOrg[]> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(
      `${BaseURL}/users/displayall/?org=${org_id}`,
      {
        headers,
      }
    );
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function fetchAllSponsors(
  accessToken: string,
  org_id: number
): Promise<sponsByOrg[]> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(`${BaseURL}/app/company/?org=${org_id}`, {
      headers,
    });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function changeUserRole(
  accessToken: string,
  user_id: number,
  role: string
) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const body = {
      id: user_id,
      role: role,
      is_approved: true,
    };
    const response = await axios.post(`${BaseURL}/users/changerole/`, body, {
      headers,
    });
    console.log(response.data);;
    return response;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}
