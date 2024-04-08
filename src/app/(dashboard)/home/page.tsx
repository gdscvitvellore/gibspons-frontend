"use client";
import { authStore } from "@/store/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const { name, email } = authStore();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    setUser({ name, email });
  }, [name, email]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Protected route</p>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
}
