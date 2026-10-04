"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Heart, MapPin, Share2, Store, X } from "lucide-react";
import { cn } from "cn";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/hooks/use-require-auth";
import { SEED_PRODUCTS, getCategory } from "@/lib/mock-data";
import { orderSchema, type OrderInput, type OrderValues } from "@/lib/schemas";
import { UNIT_LABELS, type Order } from "@/lib/types";
import { formatNumber, formatToman } from "@/lib/format";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  const router = useRouter();

  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const listings = useAppStore((s) => s.listings);
  const addOrder = useAppStore((s) => s.addOrder);

  const product = useMemo(
    () => [...listings, ...SEED_PRODUCTS].find((p) => p.id === id),
    [listings, id]
  );
  const category = product ? getCategory(product.categorySlug) : undefined;

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const form = useForm<OrderInput, unknown, OrderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: undefined, note: "", deliveryCity: "" },
  });

  if (!mounted) {
    return <ScreenSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground">این آگهی یافت نشد.</p>
        <Link href="/" className="font-medium text-primary">
          بازگشت به خانه
        </Link>
      </div>
    );
  }

  const heroImages = product.images.slice(0, 4);
  const tags = Object.values(product.attributes).filter(Boolean);

  function handlePlaceOrderClick() {
    if (!isLoggedIn) {
      router.push(`/login?returnTo=${encodeURIComponent(`/product/${id}`)}`);
      return;
    }
    setSheetOpen(true);
  }

  function onSubmit(values: OrderValues) {
    if (!product) return;
    if (values.quantity > product.quantity) {
      form.setError("quantity", {
        message: `حداکثر موجودی ${formatNumber(product.quantity)} ${
          UNIT_LABELS[product.unit]
        } است`,
      });
      return;
    }
    const order: Order = {
      id: `order-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      sellerName: product.sellerName,
      quantity: values.quantity,
      unit: product.unit,
      unitPriceToman: product.priceToman,
      note: values.note,
      deliveryCity: values.deliveryCity,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    setLastOrderId(order.id);
    setSheetOpen(false);
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col pb-24">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <button
            onClick={() => router.back()}
            aria-label="بازگشت"
            className="flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm"
          >
            <ArrowRight className="size-4 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <button
              aria-label="اشتراک‌گذاری"
              className="flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm"
            >
              <Share2 className="size-4 text-foreground" />
            </button>
            <button
              aria-label="افزودن به علاقه‌مندی‌ها"
              className="flex size-9 items-center justify-center rounded-full bg-background/90 shadow-sm"
            >
              <Heart className="size-4 text-foreground" />
            </button>
          </div>
        </div>

        {heroImages.length <= 1 ? (
          <button
            className="block aspect-[4/3] w-full bg-muted"
            onClick={() => setGalleryOpen(true)}
          >
            <div className="relative h-full w-full">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                unoptimized={product.images[0].startsWith("blob:")}
                className="object-cover"
              />
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-0.5 bg-muted">
            {heroImages.map((src, i) => {
              const isLastOdd =
                heroImages.length % 2 === 1 && i === heroImages.length - 1;
              return (
                <button
                  key={i}
                  onClick={() => setGalleryOpen(true)}
                  className={cn(
                    "relative aspect-square",
                    isLastOdd && "col-span-2 aspect-[2/1]"
                  )}
                >
                  <Image
                    src={src}
                    alt={product.title}
                    fill
                    unoptimized={src.startsWith("blob:")}
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4 p-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {product.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {category?.name} · {product.city}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((v, i) => (
              <span
                key={i}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
              >
                {v}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">موجودی</span>
          <span className="font-medium text-foreground">
            {formatNumber(product.quantity)} {UNIT_LABELS[product.unit]}
          </span>
        </div>

        <p className="text-lg font-bold text-foreground">
          {product.priceToman ? formatToman(product.priceToman) : "توافقی"}
        </p>

        {product.description && (
          <>
            <div className="h-px bg-border" />
            <p className="text-sm leading-7 text-foreground/90">
              {product.description}
            </p>
          </>
        )}

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Store className="size-4 text-foreground" />
            <span>{product.sellerName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span>{product.city}</span>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-border bg-background p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <Button
          size="lg"
          className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handlePlaceOrderClick}
        >
          ثبت سفارش
        </Button>
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col bg-background">
          <div className="flex items-center justify-end p-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
            <button
              onClick={() => setGalleryOpen(false)}
              aria-label="بستن"
              className="flex size-9 items-center justify-center rounded-full bg-secondary"
            >
              <X className="size-4 text-foreground" />
            </button>
          </div>
          <Carousel dir="rtl" className="w-full flex-1">
            <CarouselContent>
              {product.images.map((src, i) => (
                <CarouselItem key={i}>
                  <div className="relative aspect-square w-full bg-muted">
                    <Image
                      src={src}
                      alt={product.title}
                      fill
                      unoptimized={src.startsWith("blob:")}
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.images.length > 1 && (
              <>
                <CarouselPrevious className="end-2 start-auto" />
                <CarouselNext className="start-2 end-auto" />
              </>
            )}
          </Carousel>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>ثبت سفارش</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 px-4 pb-6"
            >
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      مقدار ({UNIT_LABELS[product.unit]}) — حداکثر{" "}
                      {formatNumber(product.quantity)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        {...field}
                        value={(field.value as number | string | undefined) ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شهر تحویل</FormLabel>
                    <FormControl>
                      <Input placeholder="مثلاً تهران" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>یادداشت (اختیاری)</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                تأیید سفارش
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <Sheet open={submitted} onOpenChange={setSubmitted}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>سفارش شما ثبت شد</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 pb-6 text-center">
            <p className="text-sm text-muted-foreground">
              شماره سفارش: {lastOrderId}
            </p>
            <Button asChild className="h-12">
              <Link href="/orders">مشاهده سفارش‌های من</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
