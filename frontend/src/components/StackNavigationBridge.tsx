import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setStackNavigate } from "@/stack";

export function StackNavigationBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    setStackNavigate((to) => navigate(to));
    return () => {
      setStackNavigate(undefined);
    };
  }, [navigate]);

  return null;
}
