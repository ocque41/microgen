import { Navigate } from "react-router-dom";
import { SignUp, useUser } from "@stackframe/react";

export function SignupPage() {
  const user = useUser({ or: "return-null" });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171717] px-4 py-16">
      <div className="w-full max-w-md rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.78)] p-6 shadow-[0_60px_160px_-110px_rgba(0,0,0,0.9)]">
        <SignUp automaticRedirect />
      </div>
    </main>
  );
}
