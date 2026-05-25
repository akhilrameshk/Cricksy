/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    setLoading(false);
  }, []);

  const setAdminStatus = (status: boolean) => {
    localStorage.setItem("isAdmin", status ? "true" : "false");
    setIsAdmin(status);
  };

  return { isAdmin, loading, setAdminStatus };
}
