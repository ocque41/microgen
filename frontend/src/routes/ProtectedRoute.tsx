import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useUser } from "@stackframe/react";

import { useBackendAuth } from "../contexts/BackendAuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useUser({ or: "return-null" });
  const { ensureAuthorization } = useBackendAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    void ensureAuthorization();
  }, [ensureAuthorization, user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
