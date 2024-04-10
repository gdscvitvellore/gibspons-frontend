"use client";
import { authStore } from "@/store/auth";

export default function Home() {

  const { name: name, email: email } = authStore();

  return (
    <div className="h-screen">
      <h1>Dashboard</h1>
      <p>Protected route</p>
      <h1>My Team Page</h1>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}
