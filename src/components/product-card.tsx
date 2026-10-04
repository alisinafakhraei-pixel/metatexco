import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { getCategory } from "@/lib/mock-data";
import { formatRelativeTime, formatToman } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug);
  const tags = Object.values(product.attributes).filter(Boolean).slice(0, 2);

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          unoptimized={product.images[0].startsWith("blob:")}
          className="object-cover"
        />
        <button
          type="button"
          aria-label="افزودن به علاقه‌مندی‌ها"
          className="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/70"
        >
          <Heart className="size-4 text-foreground" />
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-foreground">
            {product.title}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(product.createdAt)}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {category?.name} · {product.city}
          {tags.length > 0 ? ` · ${tags.join(" · ")}` : ""}
        </p>
        <p className="font-semibold text-foreground">
          {product.priceToman ? formatToman(product.priceToman) : "توافقی"}
        </p>
      </div>
    </Link>
  );
}
