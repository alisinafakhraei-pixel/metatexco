"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useAppStore } from "@/lib/store";
import { CATEGORIES, getCategory } from "@/lib/mock-data";
import {
  listingSchema,
  type ListingInput,
  type ListingValues,
} from "@/lib/schemas";
import type { Product, Unit } from "@/lib/types";
import { UNIT_LABELS } from "@/lib/types";
import { formatRelativeTime, formatToman } from "@/lib/format";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_IMAGES = 5;

export default function SellerPage() {
  const { ready, profile } = useRequireAuth("seller");
  const listings = useAppStore((s) => s.listings);
  const addListing = useAppStore((s) => s.addListing);

  const [images, setImages] = useState<string[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const form = useForm<ListingInput, unknown, ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      categorySlug: "",
      description: "",
      quantity: undefined,
      unit: "kg",
      isNegotiable: false,
      price: undefined,
      city: profile.city || "",
      attributes: {},
    },
  });

  const categorySlug = form.watch("categorySlug");
  const isNegotiable = form.watch("isNegotiable");
  const category = useMemo(() => getCategory(categorySlug), [categorySlug]);

  function handleImagesSelected(files: FileList | null) {
    if (!files) return;
    const next = [...images];
    for (const file of Array.from(files)) {
      if (next.length >= MAX_IMAGES) break;
      next.push(URL.createObjectURL(file));
    }
    setImages(next);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function onSubmit(values: ListingValues) {
    const attributes = Object.fromEntries(
      Object.entries(values.attributes).filter(
        (entry): entry is [string, string] => Boolean(entry[1])
      )
    );
    const product: Product = {
      id: `listing-${Date.now()}`,
      sellerId: "me",
      sellerName: profile.fullName || "فروشنده",
      title: values.title,
      categorySlug: values.categorySlug,
      description: values.description,
      images: images.length
        ? images
        : ["/images/p2.jpg"],
      quantity: values.quantity,
      unit: values.unit,
      priceToman: values.isNegotiable ? null : values.price ?? null,
      isNegotiable: values.isNegotiable,
      city: values.city,
      attributes,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    addListing(product);
    setSubmittedId(product.id);
  }

  function handlePostAnother() {
    setSubmittedId(null);
    setImages([]);
    form.reset({
      title: "",
      categorySlug: "",
      description: "",
      quantity: undefined,
      unit: "kg",
      isNegotiable: false,
      price: undefined,
      city: profile.city || "",
      attributes: {},
    });
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title="ثبت آگهی" />
        <ScreenSkeleton />
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title="ثبت آگهی" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <CheckCircle2 className="size-16 text-primary" />
          <h2 className="text-lg font-bold">آگهی شما با موفقیت ثبت شد</h2>
          <p className="text-sm text-muted-foreground">
            آگهی شما اکنون در فهرست محصولات قابل مشاهده است.
          </p>
          <div className="flex w-full flex-col gap-2">
            <Button asChild className="h-12">
              <Link href={`/product/${submittedId}`}>مشاهده آگهی</Link>
            </Button>
            <Button
              variant="outline"
              className="h-12"
              onClick={handlePostAnother}
            >
              ثبت آگهی دیگر
            </Button>
          </div>
        </main>
        <BottomNav role="seller" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader title="ثبت آگهی" />
      <main className="flex-1 space-y-6 bg-background p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <FormLabel>تصاویر (حداکثر ۵ عکس)</FormLabel>
              <div className="flex flex-wrap gap-2">
                {images.map((src, i) => (
                  <div
                    key={src}
                    className="relative size-20 overflow-hidden rounded-xl ring-1 ring-border"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute end-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground">
                    <ImagePlus className="size-5" />
                    <span className="text-[10px]">افزودن</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImagesSelected(e.target.files)}
                    />
                  </label>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان آگهی</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً نخ پنبه‌ای نمره ۲۰" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categorySlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>دسته‌بندی</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("attributes", {});
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {category?.attributes.map((attr) => (
              <FormField
                key={attr.key}
                control={form.control}
                name={`attributes.${attr.key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{attr.label}</FormLabel>
                    {attr.type === "select" ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attr.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input
                          type={attr.type === "number" ? "number" : "text"}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات (اختیاری)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>موجودی</FormLabel>
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>واحد</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
                          <SelectItem key={u} value={u}>
                            {UNIT_LABELS[u]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isNegotiable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border bg-background p-3">
                  <FormLabel>قیمت توافقی</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!isNegotiable && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت (تومان)</FormLabel>
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
            )}

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شهر</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً تهران" {...field} />
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
              ثبت آگهی
            </Button>
          </form>
        </Form>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground">
            آگهی‌های من
          </h2>
          {listings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              هنوز آگهی‌ای ثبت نکرده‌اید.
            </p>
          ) : (
            listings.map((p) => (
              <Card key={p.id}>
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
            ))
          )}
        </div>
      </main>
      <BottomNav role="seller" />
    </div>
  );
}
