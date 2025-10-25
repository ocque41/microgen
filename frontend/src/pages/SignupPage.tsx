import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { SignUp, useUser } from "@stackframe/react";

function SignupContent() {
  const user = useUser({ or: "return-null" });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <SignUp automaticRedirect />;
}

function SignupFallback() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-3/4 animate-pulse rounded-md bg-[color:rgba(244,241,234,0.08)]" />
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-[color:rgba(244,241,234,0.08)]" />
      <div className="h-10 w-full animate-pulse rounded-md bg-[color:rgba(244,241,234,0.08)]" />
      <div className="h-10 w-full animate-pulse rounded-md bg-[color:rgba(244,241,234,0.08)]" />
    </div>
  );
}

export function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171717] px-4 py-16">
      <div className="w-full max-w-md rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.78)] p-6 shadow-[0_60px_160px_-110px_rgba(0,0,0,0.9)]">
        <Suspense fallback={<SignupFallback />}>
          <SignupContent />
        </Suspense>
      </div>
    </main>
  );
}
