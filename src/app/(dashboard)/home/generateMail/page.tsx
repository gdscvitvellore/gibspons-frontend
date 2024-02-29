"use client";
import { authStore } from "@/store/auth";

export default function Home() {
  const { name, email } = authStore();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Protected route</p>
      <h1>Generate Mail</h1>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}
