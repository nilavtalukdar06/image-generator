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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="w-full">
      <Card className="py-5 rounded-none shadow-none border-0">
        <CardHeader className="px-5">
          <CardTitle className="font-normal text-neutral-700">Login</CardTitle>
          <CardDescription className="font-light text-neutral-500">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel className="font-normal text-neutral-600">
                  Email
                </FieldLabel>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="rounded-none bg-white shadow-none font-light placeholder:font-light border-neutral-200"
                />
              </Field>
              <Field>
                <FieldLabel className="font-normal text-neutral-600">
                  Password
                </FieldLabel>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  className="rounded-none bg-white shadow-none font-light placeholder:font-light border-neutral-200"
                />
              </Field>
              <Field>
                <Button className="shadow-none rounded-none font-normal">
                  <Key />
                  Login Now
                </Button>
                <FieldDescription className="text-center font-light">
                  Don&apos;t have an account?{" "}
                  <Link href="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
