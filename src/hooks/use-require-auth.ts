"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useRequireAuth(requiredRole?: Role, returnTo?: string) {
  const mounted = useMounted();
  const router = useRouter();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const role = useAppStore((s) => s.role);
  const profile = useAppStore((s) => s.profile);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) {
      const query = returnTo
        ? `?returnTo=${encodeURIComponent(returnTo)}`
        : "";
      router.replace(`/login${query}`);
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace(role === "seller" ? "/seller" : "/");
    }
  }, [mounted, isLoggedIn, role, requiredRole, router, returnTo]);

  const ready =
    mounted && isLoggedIn && (!requiredRole || role === requiredRole);

  return { ready, mounted, isLoggedIn, role, profile };
}
