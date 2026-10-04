"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAppStore } from "@/lib/store";
import { ORDER_STATUS_LABELS, UNIT_LABELS } from "@/lib/types";
import { formatJalaliDate, formatNumber, formatToman } from "@/lib/format";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
} as const;

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { ready } = useRequireAuth();
  const router = useRouter();
  const orders = useAppStore((s) => s.orders);
  const cancelOrder = useAppStore((s) => s.cancelOrder);

  const order = orders.find((o) => o.id === id);

  if (!ready) {
    return <ScreenSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground">این سفارش یافت نشد.</p>
      </div>
    );
  }

  function handleCancel() {
    cancelOrder(order!.id);
    toast.success("سفارش لغو شد");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background px-3 py-3 text-foreground">
        <button onClick={() => router.back()} aria-label="بازگشت">
          <ArrowRight className="size-5" />
        </button>
        <h1 className="font-bold">جزئیات سفارش</h1>
      </div>

      <main className="flex-1 space-y-4 bg-background p-4">
        <div className="flex items-center gap-3 rounded-xl border border-border p-3">
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
            <p className="truncate font-medium">{order.productTitle}</p>
            <p className="text-xs text-muted-foreground">
              فروشنده: {order.sellerName}
            </p>
          </div>
          <Badge variant={statusVariant[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <div className="space-y-2 rounded-xl border border-border p-3 text-sm">
          <Row label="مقدار" value={`${formatNumber(order.quantity)} ${UNIT_LABELS[order.unit]}`} />
          {order.unitPriceToman && (
            <Row
              label="مبلغ کل"
              value={formatToman(order.unitPriceToman * order.quantity)}
            />
          )}
          <Row label="شهر تحویل" value={order.deliveryCity} />
          {order.note && <Row label="یادداشت" value={order.note} />}
          <Row label="تاریخ ثبت" value={formatJalaliDate(order.createdAt)} />
          <Row label="شماره سفارش" value={order.id} />
        </div>

        {order.status === "pending" && (
          <Button
            variant="outline"
            className="h-12 w-full text-destructive hover:text-destructive"
            onClick={handleCancel}
          >
            لغو سفارش
          </Button>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
