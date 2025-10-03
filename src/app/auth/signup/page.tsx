"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import FormFieldElement from "./form-field-element";
import { useState } from "react";
import { registerUser } from "@/lib/actions/auth";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    // console.log(data);
    setError(null);
    form.clearErrors();

    try {
      const res = await registerUser(data);

      if (!res?.success) {
        setError(res?.error || "An error occurred while signing up");
        return;
      }

      router.push("/auth/signin");
    } catch (error) {
      console.error("Registration error", error);
      setError("An error occurred while signing up");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              sing in instead
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormFieldElement
                control={form.control}
                name="name"
                placeholder="Enter your name"
              />
              <FormFieldElement
                control={form.control}
                name="email"
                placeholder="Enter your email"
              />
              <FormFieldElement
                control={form.control}
                name="password"
                placeholder="Enter your password"
                type="password"
              />
              <FormFieldElement
                control={form.control}
                name="confirmPassword"
                placeholder="Confirm your password"
                type="password"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
