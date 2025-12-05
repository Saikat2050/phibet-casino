"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useMaintenanceStore from "@/store/useMaintenanceStore";

export default function MaintenanceGuard({ children }) {
  const { maintenanceMode } = useMaintenanceStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (maintenanceMode && pathname !== "/maintenance") {
      router.replace("/maintenance");
    }
    if (!maintenanceMode && pathname === "/maintenance") {
      router.replace("/");
    }
  }, [maintenanceMode, pathname, router]);

  // Optionally, render nothing if redirecting
  if (maintenanceMode && pathname !== "/maintenance") return null;
  if (!maintenanceMode && pathname === "/maintenance") return null;

  return children;
} 