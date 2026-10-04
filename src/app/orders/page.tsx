"use client";

import Link from "next/link";
import Image from "next/image";
import { PackageSearch } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAppStore } from "@/lib/store";
import { ORDER_STATUS_LABELS, UNIT_LABELS } from "@/lib/types";
import { formatJalaliDate, formatNumber, formatToman } from "@/lib/format";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
} as const;

export default function OrdersPage() {
  const { ready } = useRequireAuth();
  const orders = useAppStore((s) => s.orders);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title="سفارش‌های من" />
        <ScreenSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader title="سفارش‌های من" />
      <main className="flex-1 space-y-2 bg-background p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <PackageSearch className="size-10" />
            <p className="text-sm">هنوز سفارشی ثبت نکرده‌اید.</p>
            <Link href="/" className="text-sm font-medium text-primary">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={order.productImage}
                      alt={order.productTitle}
                      fill
                      unoptimized={order.productImage.startsWith("blob:")}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {order.productTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(order.quantity)} {UNIT_LABELS[order.unit]}
                      {order.unitPriceToman
                        ? ` · ${formatToman(
                            order.unitPriceToman * order.quantity
                          )}`
                        : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatJalaliDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[order.status]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </main>
      <BottomNav role="buyer" />
    </div>
  );
}
