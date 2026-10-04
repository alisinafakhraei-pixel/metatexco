"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, Product, Profile, Role } from "@/lib/types";

type AppState = {
  isLoggedIn: boolean;
  role: Role;
  profile: Profile;
  listings: Product[];
  orders: Order[];
  login: (profile: Profile, role: Role) => void;
  logout: () => void;
  addListing: (product: Product) => void;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: "buyer",
      profile: { fullName: "", phone: "", city: "" },
      listings: [],
      orders: [],
      login: (profile, role) => set({ isLoggedIn: true, profile, role }),
      logout: () =>
        set({
          isLoggedIn: false,
          profile: { fullName: "", phone: "", city: "" },
        }),
      addListing: (product) =>
        set((state) => ({ listings: [product, ...state.listings] })),
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      cancelOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId && o.status === "pending"
              ? { ...o, status: "cancelled" }
              : o
          ),
        })),
    }),
    { name: "metatexco-store" }
  )
);
