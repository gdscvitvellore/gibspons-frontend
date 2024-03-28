"use client";

import { loginRes, registerRes } from "@/types/user";
import axios from "axios";

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
  } catch (error) {
    window.alert(error);
    console.log(error);
    throw new Error("Login failed");
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
  } catch (error) {
    window.alert(error);
    console.log(error);
    throw new Error("New user registration failed");
  }
}
