import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useUser } from "@stackframe/react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useUser({ or: "return-null" });
  const location = useLocation();

  if (!user) {
    return <Navigate to="/handler/sign-in" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
