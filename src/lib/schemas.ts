import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی را کامل وارد کنید"),
  phone: z
    .string()
    .min(10, "شماره موبایل معتبر نیست")
    .regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
  city: z.string().min(2, "شهر را وارد کنید"),
  role: z.enum(["buyer", "seller"]),
});

export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "شماره موبایل معتبر نیست")
    .regex(/^0?9\d{9}$/, "شماره موبایل معتبر نیست"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const listingSchema = z
  .object({
    title: z.string().min(3, "عنوان را کامل وارد کنید"),
    categorySlug: z.string().min(1, "دسته‌بندی را انتخاب کنید"),
    description: z.string().optional(),
    quantity: z.coerce.number().positive("مقدار باید بزرگ‌تر از صفر باشد"),
    unit: z.enum(["kg", "ton", "meter", "roll", "piece"]),
    isNegotiable: z.boolean(),
    price: z.coerce.number().nonnegative().optional(),
    city: z.string().min(2, "شهر را وارد کنید"),
    attributes: z.record(z.string(), z.string().optional()).default({}),
  })
  .refine((data) => data.isNegotiable || (data.price ?? 0) > 0, {
    message: "قیمت را وارد کنید یا گزینه توافقی را فعال کنید",
    path: ["price"],
  });

export type ListingValues = z.infer<typeof listingSchema>;
export type ListingInput = z.input<typeof listingSchema>;

export const orderSchema = z.object({
  quantity: z.coerce.number().positive("مقدار باید بزرگ‌تر از صفر باشد"),
  note: z.string().optional(),
  deliveryCity: z.string().min(2, "شهر تحویل را وارد کنید"),
});

export type OrderValues = z.infer<typeof orderSchema>;
export type OrderInput = z.input<typeof orderSchema>;
