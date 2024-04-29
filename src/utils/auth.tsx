"use client";

import { loginRes, registerRes, user } from "@/types/user";
import axios from "axios";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function handleLogin(
  email: string,
  password: string
): Promise<any> {
  try {
    const response = await axios.post(`${BaseURL}/users/login/`, {
      email: email,
      password: password,
    });
    if (response.status === 200) {
      const data = response.data.data;
      return data;
    } else {
      throw new Error(response.data.detail);
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("An error occurred while logging in.");
    }
  }
}

export async function handleRegister(
  name: string,
  email: string,
  username: string,
  password: string
): Promise<registerRes> {
  try {
    const res = await axios.post(`${BaseURL}/users/register/`, {
      name: name,
      email: email,
      username: username,
      password: password,
    });
    const data: registerRes = await res.data;
    return data;
  } catch (error: any) {
    // throw new Error("New user registration failed");
    throw new Error(error.response.data.detail);
  }
}

export async function handleJoinOrg(
  orgCode: string,
  accessToken: string | null
): Promise<loginRes> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(
      `${BaseURL}/users/joinorg/`,
      {
        invite_code: orgCode,
      },
      { headers }
    );
    const data = await response.data.message;
    return data;
  } catch (error: any) {
    if (error.response.status === 401) {
      throw new Error("Session Expired, Please login again");
    }
    throw new Error(error.response.data.detail);
  }
}

export async function handleCreateOrg(
  teamname: string,
  teamtype: string,
  location: string,
  teamlogo: string,
  accessToken: string | null
): Promise<string> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(
      `${BaseURL}/users/createorg/`,
      {
        name: teamname,
        industry: teamtype,
        location: location,
        logo: teamlogo,
      },
      { headers }
    );
    const data = await response.data.message;
    return data;
  } catch (error: any) {
    if (error.response.status === 401) {
      throw new Error("Session Expired, Please login again");
    }
    try {
      throw new Error(error.response.data.detail);
    } catch {
      throw new Error("Network Error");
    }
  }
}

export async function getUserData(accessToken: string | null): Promise<user> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      // AccessControlAllowOrigin: "*",
      // withCredentials: false,
    };
    const response = await axios.get(`${BaseURL}/users/user/`, { headers });
    const data: user = await response.data[0];
    return data;
  } catch (error: any) {
    if (error.response.status === 401) {
      throw new Error("Session Expired, Please login again");
    }
    try {
      throw new Error(error.response.data.detail);
    } catch {
      throw new Error("Network Error");
    }
  }
}

export async function updateUser({
  accessToken,
  body,
}: {
  accessToken: string | null;
  body: any;
}): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.patch(`${BaseURL}/users/user/`, body, {
      headers,
    });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function approveUser(
  accessToken: string | null,
  user: string
): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(
      `${BaseURL}/users/approve/?user=${user}`,
      { dummy: "test" },
      { headers }
    );
    const data = await response;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
}

export async function handleForgetPass(email: string): Promise<any> {
  try {
    const response = await axios.post(`${BaseURL}/users/reset_password/`, {
      email: email,
    });
    const data = await response.data;
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.detail);
  }
}

export async function handleVerifyOTP(
  code: number,
  password: string,
  email: string
): Promise<{msg?:string, error?:string}> {
  try {
    const response = await axios.post(
      `${BaseURL}/users/verify_reset_password_otp/?email=${email}`,
      {
        otp: Number(code),
        new_password: password,
      }
    );
    // const data = await response.data;
    if (response.status === 200) {
      return { msg: response.data.message };
    } else {
      return { error: response.data.detail };
    }
  } catch (error: any) {
    return { error: error.response.data.detail };
    // throw new Error(error.response.data.detail);
  }
}
