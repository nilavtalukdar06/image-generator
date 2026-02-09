"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Logged Out Successfully");
          setIsLoading(false);
          router.replace("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      },
    });
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-none shadow-none font-normal"
      variant="destructive"
    >
      {isLoading ? <Spinner /> : <LogOutIcon />}
      {isLoading ? "Loading" : "Logout"}
    </Button>
  );
}
