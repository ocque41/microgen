import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useUser } from "@stackframe/react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useUser({ or: "return-null" });

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
