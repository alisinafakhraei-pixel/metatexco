"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signupSchema, type SignupValues } from "@/lib/schemas";
import { useAppStore } from "@/lib/store";
import { useMounted } from "@/hooks/use-require-auth";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const mounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const role = useAppStore((s) => s.role);
  const login = useAppStore((s) => s.login);
  const justSubmitted = useRef(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", phone: "", city: "", role: "buyer" },
  });

  useEffect(() => {
    if (mounted && isLoggedIn && !justSubmitted.current) {
      router.replace(role === "seller" ? "/seller" : "/");
    }
  }, [mounted, isLoggedIn, role, router]);

  function onSubmit(values: SignupValues) {
    justSubmitted.current = true;
    login(
      { fullName: values.fullName, phone: values.phone, city: values.city },
      values.role
    );
    toast.success("حساب کاربری شما ساخته شد");
    const returnTo = searchParams.get("returnTo");
    router.push(returnTo ?? (values.role === "seller" ? "/seller" : "/"));
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader title="ساخت حساب کاربری" />
      <main className="flex-1 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً علی رضایی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره موبایل</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="09xxxxxxxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شهر</FormLabel>
                  <FormControl>
                    <Input placeholder="مثلاً اصفهان" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نقش شما</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buyer">خریدار</SelectItem>
                      <SelectItem value="seller">فروشنده</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="mt-2 h-12 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              ثبت‌نام
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/login" className="font-medium text-primary">
            ورود
          </Link>
        </p>
      </main>
    </div>
  );
}
