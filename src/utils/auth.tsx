import { loginRes, registerRes, user } from "@/types/user";
import { postRequest, getRequest, patchRequest } from "./axiosFunctions";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function handleLogin(
  email: string,
  password: string
): Promise<any> {
  try {
    return await postRequest(`${BaseURL}/users/login/`, { email, password });
  } catch (error: any) {
    throw error;
  }
}

export async function handleRegister(
  name: string,
  email: string,
  username: string,
  password: string
): Promise<registerRes> {
  try {
    return await postRequest(`${BaseURL}/users/register/`, {
      name,
      email,
      username,
      password,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function handleJoinOrg(orgCode: string): Promise<loginRes> {
  try {
    return await postRequest(`${BaseURL}/users/joinorg/`, { invite_code: orgCode });
  } catch (error: any) {
    throw error;
  }
}

export async function handleCreateOrg(
  teamname: string,
  teamtype: string,
  location: string,
  teamlogo: string
): Promise<string> {
  try {
    return await postRequest(`${BaseURL}/users/createorg/`, {
      teamname,
      teamtype,
      location,
      teamlogo,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function getUserData(): Promise<user[]> {
  try {
    return getRequest(`${BaseURL}/users/user/`);
  } catch (error: any) {
    throw error;
  }
}

export async function updateUser({
  body,
}: {
  body: any;
}): Promise<any> {
  try {
    return patchRequest(`${BaseURL}/users/user/`, body);
  } catch (error: any) {
    throw error;
  }
}

export async function approveUser(user: string): Promise<any> {
  try {
    return postRequest(`${BaseURL}/users/approve/`,null, { user });
  } catch (error: any) {
    throw error;
  }
}

export async function handleForgetPass(email: string): Promise<any> {
  try {
    return postRequest(`${BaseURL}/users/reset_password_otp/`, { email });
  } catch (error: any) {
    throw error;
  }
}

export async function handleVerifyOTP(
  code: number,
  password: string,
  email: string
): Promise<{ msg?: string; error?: string }> {
  try {
    return postRequest(`${BaseURL}/users/verify_otp/`, {
      code,
      password,
      email,
    });
  } catch (error: any) {
    throw error;
  }
}
