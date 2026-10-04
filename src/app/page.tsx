"use client";

import { useMemo, useState } from "react";
import { Search, PackageSearch } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/hooks/use-require-auth";
import { CATEGORIES, SEED_PRODUCTS } from "@/lib/mock-data";
import { BottomNav } from "@/components/bottom-nav";
import { ProductCard } from "@/components/product-card";
import { ScreenSkeleton } from "@/components/screen-skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const PAGE_SIZE = 6;

export default function Home() {
  const mounted = useMounted();
  const role = useAppStore((s) => s.role);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const listings = useAppStore((s) => s.listings);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allProducts = useMemo(
    () =>
      [...listings, ...SEED_PRODUCTS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [listings]
  );

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        !activeCategory || p.categorySlug === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, search, activeCategory]);

  const visibleProducts = filtered.slice(0, visibleCount);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-1 flex-col">
        <ScreenSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background px-4 pt-[calc(env(safe-area-inset-top)+0.875rem)] pb-3">
        <div className="relative">
          <Search className="absolute end-4 top-1/2 size-4 -translate-y-1/2 text-foreground" />
          <input
            placeholder="جستجوی محصول..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="h-12 w-full rounded-full border border-border bg-background pe-11 ps-4 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-foreground/30"
          />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto bg-background px-4 py-3">
        <button
          onClick={() => {
            setActiveCategory(null);
            setVisibleCount(PAGE_SIZE);
          }}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            !activeCategory
              ? "bg-foreground text-background"
              : "bg-secondary text-foreground"
          )}
        >
          همه
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => {
              setActiveCategory(c.slug);
              setVisibleCount(PAGE_SIZE);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeCategory === c.slug
                ? "bg-foreground text-background"
                : "bg-secondary text-foreground"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <main className="flex-1 space-y-5 bg-background p-4">
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <PackageSearch className="size-10" />
            <p className="text-sm">محصولی یافت نشد.</p>
          </div>
        ) : (
          <>
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {visibleCount < filtered.length && (
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                نمایش بیشتر
              </Button>
            )}
          </>
        )}
      </main>

      <BottomNav role={isLoggedIn ? role : "buyer"} />
    </div>
  );
}
