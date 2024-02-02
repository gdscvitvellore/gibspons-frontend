"use client";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

function NavbarSimple({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Sidebar />
      {children}
    </>
  );
}

export default ProtectedRoute(NavbarSimple);
