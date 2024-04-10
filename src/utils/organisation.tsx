"use client";

import axios from "axios";
import { organisation } from "@/store/organisation";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getOrganisation(accessToken: string | null):Promise<organisation> {
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
