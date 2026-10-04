"use client";

import { useRouter } from "next/navigation";
import { LogOut, Phone, MapPin, UserRound } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAppStore } from "@/lib/store";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function AccountPage() {
  const { ready, role, profile } = useRequireAuth();
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title="حساب کاربری" />
        <ScreenSkeleton />
      </div>
    );
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader title="حساب کاربری" />
      <main className="flex-1 space-y-4 bg-background p-4">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-primary" />
              <span>{profile.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-primary" />
              <span dir="ltr">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-primary" />
              <span>{profile.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">نقش:</span>
              <span className="text-sm font-medium">
                {role === "seller" ? "فروشنده" : "خریدار"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="h-12 w-full gap-2 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          خروج از حساب کاربری
        </Button>
      </main>
      <BottomNav role={role} />
    </div>
  );
}
