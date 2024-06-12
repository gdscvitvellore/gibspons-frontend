import axios from "axios";
import { organisation } from "@/store/organisation";
import {
  membersByOrg,
  sponsByOrg,
  pocResp,
  sponsByEvent,
  companyByOrg,
  sponsorships,
} from "@/types/org";
import { getRequest, postRequest, patchRequest } from "./axiosFunctions";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getOrganisation(): Promise<any> {
  try {
    return await getRequest(`${BaseURL}/app/organisation/`);
  } catch (error: any) {
    throw error;
  }
}

export async function getMembersByOrg(org_id: number): Promise<membersByOrg[]> {
  try {
    return await getRequest(`${BaseURL}/users/user/`, {
      org: org_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function fetchAllCompanies(
  org_id: number
): Promise<companyByOrg[]> {
  try {
    return await getRequest(`${BaseURL}/app/company/`, {
      org: org_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getSponsorsByOrg(
): Promise<sponsByOrg[]> {
  try {
    return await getRequest(`${BaseURL}/app/sponsors/`);
  } catch (error: any) {
    throw error;
  }
}

export async function changeUserRole(user_id: number, role: string) {
  try {
    return await postRequest(`${BaseURL}/users/changerole/`, {
      id: user_id,
      role,
      is_approved: true,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function addCompany(company: any): Promise<any> {
  try {
    return await postRequest(`${BaseURL}/app/company/`, company);
  } catch (error: any) {
    throw error;
  }
}

export async function addPoC(pocData: any): Promise<pocResp[]> {
  try {
    return await postRequest(`${BaseURL}/app/poc/`, pocData);
  } catch (error: any) {
    throw error;
  }
}

export async function getSponsorsByEvent(
  event_id: string
): Promise<sponsByEvent> {
  try {
    return await getRequest(`${BaseURL}/app/sponsors/`, {
      event: event_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getSponsorsByUser(): Promise<sponsorships[]> {
  try {
    return await getRequest(`${BaseURL}/app/usercompany/`);
  } catch (error: any) {
    throw error;
  }
}

export async function generateMail(
  poc_id: number,
  event_id: number,
  additional_message: string | null
): Promise<any> {
  try {
    return await postRequest(`${BaseURL}/app/generateemail/`, {
      poc_id,
      event_id,
      additional: additional_message,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function generateLinkedin(
  poc_id: number,
  event_id: number,
  additional_message: string | null
): Promise<any> {
  try {
    return await postRequest(`${BaseURL}/app/generatelinkedin/`, {
      poc_id,
      event_id,
      additional: additional_message,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getCompanyByID(
  org_id: number,
  company_id: number
): Promise<companyByOrg> {
  try {
    return await getRequest(`${BaseURL}/app/company/`, {
      org: org_id,
      id: company_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getPoCByCompany(company_id: number): Promise<pocResp[]> {
  try {
    return await getRequest(`${BaseURL}/app/poc/`, {
      company: company_id,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function updateSponsorship(
  data: any,
  org_id: number
) {
  try {
    return await patchRequest(
      `${BaseURL}/app/sponsor/${org_id}/`,
      data
    );
  } catch (error: any) {
    throw error;
  }
}

export async function updateCompany(
  data: any,
  comp_id: number
) {
  try {
    return await patchRequest(
      `${BaseURL}/app/company/${comp_id}/`,
      data
    );
  } catch (error: any) {
    throw error;
  }
}
