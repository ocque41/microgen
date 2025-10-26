import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setStackNavigate } from "@/stack";
import { navigateWithViewTransition } from "@/lib/viewTransitions";

export function StackNavigationBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    setStackNavigate((to) => navigateWithViewTransition(navigate, to));
    return () => {
      setStackNavigate(undefined);
    };
  }, [navigate]);

  return null;
}
