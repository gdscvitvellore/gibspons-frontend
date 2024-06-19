"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute(Component: any) {
  return function ProtectedRoute(props: any) {
    const router  = useRouter();
    useEffect(() => {
      const user = localStorage.getItem("authStore");
      const accessToken = (user) ? JSON.parse(user).state.accessToken : null;
      if (!accessToken) {
      router.push("/login");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Component {...props} />;
  };
}
