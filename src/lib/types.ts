export type Unit = "kg" | "ton" | "meter" | "roll" | "piece";

export const UNIT_LABELS: Record<Unit, string> = {
  kg: "کیلوگرم",
  ton: "تن",
  meter: "متر",
  roll: "رول",
  piece: "عدد",
};

export type AttributeType = "select" | "text" | "number";

export type CategoryAttribute = {
  key: string;
  label: string;
  type: AttributeType;
  options?: string[];
  required?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  attributes: CategoryAttribute[];
};

export type Product = {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  categorySlug: string;
  description?: string;
  images: string[];
  quantity: number;
  unit: Unit;
  priceToman: number | null;
  isNegotiable: boolean;
  city: string;
  attributes: Record<string, string>;
  status: "active";
  createdAt: string;
};

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار",
  confirmed: "تأیید شده",
  cancelled: "لغو شده",
};

export type Order = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerName: string;
  quantity: number;
  unit: Unit;
  unitPriceToman: number | null;
  note?: string;
  deliveryCity: string;
  status: OrderStatus;
  createdAt: string;
};

export type Role = "buyer" | "seller";

export type Profile = {
  fullName: string;
  phone: string;
  city: string;
};
