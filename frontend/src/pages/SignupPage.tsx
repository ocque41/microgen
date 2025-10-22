import { Navigate } from "react-router-dom";
import { useUser } from "@stackframe/react";

export function SignupPage() {
  const user = useUser({ or: "return-null" });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/handler/sign-up" replace />;
}
