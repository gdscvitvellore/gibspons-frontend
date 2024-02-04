"use client";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderTabs from "@/components/HeaderTabs";
import NavbarMinimal from "@/components/SidebarMinified";

function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row">
        <NavbarMinimal />
        <Sidebar />
      <div className="flex flex-col w-full">
        <HeaderTabs />
        {children}
      </div>
    </div>
  );
}

export default ProtectedRoute(Dashboard);
