"use client";

import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAppStore } from "@/lib/store";
import { formatRelativeTime, formatToman } from "@/lib/format";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SellerListingsPage() {
  const { ready } = useRequireAuth("seller");
  const listings = useAppStore((s) => s.listings);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title="آگهی‌های من" />
        <ScreenSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader title="آگهی‌های من" />
      <main className="flex-1 space-y-2 bg-background p-4">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <PackageOpen className="size-10" />
            <p className="text-sm">هنوز آگهی‌ای ثبت نکرده‌اید.</p>
            <Link href="/seller" className="text-sm font-medium text-primary">
              ثبت آگهی جدید
            </Link>
          </div>
        ) : (
          listings.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <Card>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(p.createdAt)} ·{" "}
                      {p.priceToman ? formatToman(p.priceToman) : "توافقی"}
                    </p>
                  </div>
                  <Badge variant="secondary">فعال</Badge>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </main>
      <BottomNav role="seller" />
    </div>
  );
}
