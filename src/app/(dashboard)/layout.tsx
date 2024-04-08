"use client";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderTabs from "@/components/HeaderTabs";
import ManageOrg from "@/components/ManageOrg";
import { authStore } from "@/store/auth";
import { useEffect, useState } from "react";

function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { organisation, is_approved } = authStore();

  const [Organisation, setOrganisation] = useState<string | null>("");
  const [Is_approved, setIsApproved] = useState(true);

  useEffect(() => {
      setOrganisation(organisation);
      setIsApproved(is_approved);
  }, [organisation, is_approved]);

  return (
    <div className="flex flex-row bg-[#ECECEC] w-full absolute h-screen">
      <Sidebar />
      <div className="flex flex-col w-full ml-[rem(60)] sm:ml-[rem(300)]">
        <HeaderTabs />
        {Organisation === null || Is_approved === false ? (
          <ManageOrg />
        ) : (
          <div className="m-4 bg-white rounded-md h-full overflow-auto p-4 relative">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProtectedRoute(Dashboard);
