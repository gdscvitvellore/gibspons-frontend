'use client'

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute(Component: any) {
  return function ProtectedRoute(props: any) {
    useEffect(() => {
      if (!localStorage.getItem("accessToken")) {
        redirect("/login");
      }
    }, []);

    // if(!localStorage.getItem("email")) return null;

    return <Component {...props} />;
  };
}
