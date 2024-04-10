"use client";

import axios from "axios";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getEvents(accessToken: string, org_id: number) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(
      `${BaseURL}/app/event/display/?org=${org_id}`,
      { headers }
    );
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}
