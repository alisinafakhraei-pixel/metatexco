"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  ListOrdered,
  User,
  PlusCircle,
  Package,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const buyerItems: NavItem[] = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/orders", label: "سفارش‌های من", icon: ListOrdered },
  { href: "/account", label: "حساب کاربری", icon: User },
];

const sellerItems: NavItem[] = [
  { href: "/seller", label: "ثبت آگهی", icon: PlusCircle },
  { href: "/seller/listings", label: "آگهی‌های من", icon: Package },
  { href: "/account", label: "حساب کاربری", icon: User },
];

export function BottomNav({ role }: { role: "buyer" | "seller" }) {
  const pathname = usePathname();
  const items = role === "seller" ? sellerItems : buyerItems;

  return (
    <nav className="sticky bottom-0 z-40 flex h-16 w-full items-stretch border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
