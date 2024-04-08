"use client";

import { loginRes, registerRes, user } from "@/types/user";
import axios, { AxiosError } from "axios";

const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(BaseURL);

export async function handleLogin(
  email: string,
  password: string
): Promise<loginRes> {
  try {
    console.log("inside handleLogin");
    console.log(BaseURL);
    const response = await axios.post(`${BaseURL}/users/login/`, {
      email: email,
      password: password,
    });
    console.log(response);
    const data: loginRes = await response.data;
    console.log(data);
    return data;
  } catch (error: any) {
    try{
      throw new Error(error.response.data.detail);
    } catch {
      throw new Error("Network Error")
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
    }
    console.log("accessToken ", accessToken);
    const response = await axios.post(`${BaseURL}/users/joinorg/`, {
      invite_code: orgCode,
    }, { headers });
    const data = await response.data.message;
    return data;
  } catch (error: any) {
    if(error.response.status === 401) {
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
    }
    const response = await axios.post(`${BaseURL}/users/createorg/`, {
      name: teamname,
      industry: teamtype,
      location: location,
      logo: teamlogo,
    }, { headers });
    const data = await response.data.message;
    return data;
  } catch (error: any) {
    if(error.response.status === 401) {
      throw new Error("Session Expired, Please login again");
    }
    try {
      throw new Error(error.response.data.detail);
    } catch {
      throw new Error("Network Error")
    }
  }
}

export async function handleRefreshData(accessToken: string | null): Promise<user> {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    const response = await axios.get(`${BaseURL}/users/user/`, { headers });
    const data: user = await response.data[0];
    console.log(data);
    return data;
  }
  catch (error: any) {
    if(error.response.status === 401) {
      throw new Error("Session Expired, Please login again");
    }
    try {
      throw new Error(error.response.data.detail);
    } catch {
      throw new Error("Network Error")
    }
  }
}