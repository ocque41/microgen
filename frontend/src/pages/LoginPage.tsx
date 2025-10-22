import { Navigate } from "react-router-dom";
import { useUser } from "@stackframe/react";

export function LoginPage() {
  const user = useUser({ or: "return-null" });

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return <Navigate to="/handler/sign-in" replace />;
}
