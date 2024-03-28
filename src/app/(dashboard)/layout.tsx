"use client";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderTabs from "@/components/HeaderTabs";

function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row bg-[#ECECEC] w-full absolute h-screen">
      <Sidebar />
      <div className="flex flex-col w-full ml-[rem(60)] sm:ml-[rem(300)]">
        <HeaderTabs />
        <div className="m-4 bg-white rounded-md h-full overflow-auto p-4 relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute(Dashboard);
