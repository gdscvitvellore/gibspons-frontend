"use client";

import axios from "axios";
import { Event } from "@/types/org";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getEvents(
  accessToken: string,
  org_id: number,
  event_id: number | null
): Promise<Event[]> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(`${BaseURL}/app/event/display/`, {
      params: {
        org: org_id,
        id: event_id,
      },
      headers,
    });
    const data: Event[] = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function createEvent(
  accessToken: string,
  event: any
): Promise<Event> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(`${BaseURL}/app/event/`, event, {
      headers,
    });
    if (response.status !== 200) {
      const data = await response.data;
      throw new Error(data);
    }
    const data = await response.data;
    return data;
  } catch (error: any) {
    return error;
  }
}

export async function updateEvent(
  accessToken: string,
  event: any,
  event_id: number
): Promise<Event> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.patch(
      `${BaseURL}/app/event/${event_id}/`,
      event,
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

export async function getPieChart(
  accessToken: string,
  event_id: number
): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(
      `${BaseURL}/app/piechart/?event=${event_id}`,
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
