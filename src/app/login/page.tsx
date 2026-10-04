"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type LoginValues } from "@/lib/schemas";
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const mounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const profile = useAppStore((s) => s.profile);
  const role = useAppStore((s) => s.role);
  const login = useAppStore((s) => s.login);
  const justSubmitted = useRef(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "" },
  });

  useEffect(() => {
    if (mounted && isLoggedIn && !justSubmitted.current) {
      router.replace(role === "seller" ? "/seller" : "/");
    }
  }, [mounted, isLoggedIn, role, router]);

  function onSubmit(values: LoginValues) {
    if (profile.phone && profile.phone === values.phone) {
      justSubmitted.current = true;
      login(profile, role);
      toast.success("خوش آمدید");
      const returnTo = searchParams.get("returnTo");
      router.push(returnTo ?? (role === "seller" ? "/seller" : "/"));
      return;
    }
    toast.error("حساب کاربری یافت نشد، لطفاً ابتدا ثبت‌نام کنید");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader title="ورود" />
      <main className="flex-1 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
            <Button
              type="submit"
              size="lg"
              className="mt-2 h-12 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              ورود
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link href="/signup" className="font-medium text-primary">
            ثبت‌نام
          </Link>
        </p>
      </main>
    </div>
  );
}
