"use client";

"use client";

import { Suspense } from "react";
import Loading from "./loading";
function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export default Dashboard;
