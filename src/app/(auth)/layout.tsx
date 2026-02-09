import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children }: child) {
  const result = await auth.api.getSession({
    headers: await headers(),
  });
  if (result?.session) {
    redirect("/");
  }
  return <React.Fragment>{children}</React.Fragment>;
}
