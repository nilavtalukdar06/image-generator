"use client";

import { Key } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(8, { message: "Password length is too short" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await authClient.signUp.email(
      {
        name: values.fullName,
        email: values.email,
        password: values.password,
        image: "https://github.com/shadcn.png",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Welcome to DALL-E");
          setIsLoading(false);
          form.reset();
          router.replace("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="w-full">
      <Card className="py-5 rounded-none shadow-none">
        <CardHeader className="px-5">
          <CardTitle className="font-normal text-neutral-700">
            Register
          </CardTitle>
          <CardDescription className="font-light text-neutral-500">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="font-normal text-neutral-600"
                      htmlFor="fullName"
                    >
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your name"
                      className="rounded-none bg-white shadow-none font-light placeholder:font-light border-neutral-200"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="font-light"
                      />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="font-normal text-neutral-600"
                      htmlFor="email"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      className="rounded-none bg-white shadow-none font-light placeholder:font-light border-neutral-200"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="font-light"
                      />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="font-normal text-neutral-600"
                      htmlFor="password"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      className="rounded-none bg-white shadow-none font-light placeholder:font-light border-neutral-200"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="font-light"
                      />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="shadow-none rounded-none font-normal w-full"
                >
                  {isLoading ? <Spinner /> : <Key />}
                  {isLoading ? "Loading" : "Create Account"}
                </Button>
                <FieldDescription className="text-center font-light">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
