"use client";

import axios from "axios";
import { organisation } from "@/store/organisation";
import {
  membersByOrg,
  sponsByOrg,
  compResp,
  pocResp,
  sponsByEvent,
} from "@/types/org";

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
    console.log(response.data);
    return response;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function addCompany(
  accessToken: string,
  company: any
): Promise<compResp> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${BaseURL}/app/company/`, company, {
      headers,
    });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function addPoC(
  accessToken: string,
  pocData: any
): Promise<pocResp[]> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${BaseURL}/app/poc/`, pocData, {
      headers,
    });
    const data: pocResp[] = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function getSponsorsByEvent(
  accessToken: string,
  event_id: string
): Promise<sponsByEvent[]> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(
      `${BaseURL}/app/event/company/?event=${event_id}`,
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

export async function generateMail(
  accesstoken: string,
  poc_id: number,
  event_id: number,
  additional_message: string
): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${accesstoken}`,
    };
    const body = {
      poc_id: poc_id,
      event_id: event_id,
      additional_message: additional_message,
    };
    const response = await axios.post(`${BaseURL}/app/generateemail/`, body, {
      headers,
    });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}
