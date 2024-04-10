"use client";

import { authStore } from "@/store/auth";

export default function Home({params}: {params: {id: number}}) {
  const { name, email } = authStore();

  return (
    <div className="p-4 bg-white rounded-md">
      <h1>Dashboard</h1>
      <p>Protected route</p>
      <h1>Team Dashboard</h1>
      <p>{name}</p>
      <p>{params.id}</p>
    </div>
  );
}
