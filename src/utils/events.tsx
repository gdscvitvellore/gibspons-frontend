import { Event, respType } from "@/types/org";
import { postRequest, getRequest, patchRequest } from "./axiosFunctions";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

type getEventsType = {
  respType: respType;
  results: Event[];
}

export async function getEvents(
  event_id: number | null
): Promise<getEventsType> {
  try {
    return await getRequest(`${BaseURL}/app/event/`, {
      id: event_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function createEvent(
  event: any
): Promise<Event> {
  try {
    return await postRequest(`${BaseURL}/app/event/`, event);
  } catch (error: any) {
    throw error;
  }
}

export async function updateEvent(
  event: any,
  event_id: number
): Promise<Event> {
  try {
    return await patchRequest(
      `${BaseURL}/app/event/${event_id}/`,
      event
    );
  } catch (error: any) {
    throw error;
  }
}

export async function getPieChart(
  event_id: number
): Promise<any> {
  try {
    return await getRequest(`${BaseURL}/app/piechart/`, {
      event: event_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getLeaderBoard(
  event_id: number
): Promise<any> {
  try {
    return await getRequest(`${BaseURL}/app/leaderboard/`, {
      event: event_id,
    });
  } catch (error: any) {
    throw error;
  }
}