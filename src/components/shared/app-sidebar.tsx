"use client";

import { Dalle, OpenAI } from "@lobehub/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import initials from "initials";
import { authClient } from "@/lib/auth/auth-client";
import { Skeleton } from "../ui/skeleton";
import { ChevronsUpDown, CreditCard, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AppSidebar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const result = authClient.useSession();
  const { isMobile } = useSidebar();

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
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="pointer-events-none">
              <div className="w-full flex justify-start items-center gap-x-2">
                <OpenAI size={20} />
                <Dalle.Text size={15} />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-normal">
            Menu Items
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="font-normal rounded-none" asChild>
                  <Link href="/">
                    <Image
                      src="/imagekit.jpeg"
                      height={16}
                      width={16}
                      alt="imagekit-logo"
                    />
                    <p className="text-neutral-600 font-light text-sm">
                      My Images
                    </p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="font-normal rounded-none" asChild>
                  <Link href="/pricing">
                    <Image
                      src="/polar.png"
                      height={16}
                      width={16}
                      alt="polar-logo"
                    />
                    <p className="text-neutral-600 font-light text-sm">
                      Pricing Page
                    </p>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {!result.data?.user ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                  <SidebarMenuButton
                    size="lg"
                    className="rounded-md bg-white border"
                  >
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        src={result.data.user?.image || ""}
                        alt="profile-image"
                      />
                      <AvatarFallback className="bg-purple-500 text-white font-light text-xs!">
                        {initials(result.data.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-normal text-neutral-600">
                        {result.data.user.name}
                      </span>
                      <span className="truncate text-xs font-light text-neutral-500">
                        {result.data.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-neutral-500" />
                  </SidebarMenuButton>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => authClient.customer.portal()}
                  >
                    <CreditCard className="text-muted-foreground" />
                    <p className="text-muted-foreground font-light">Billing</p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:bg-red-50!"
                    disabled={isLoading}
                    onClick={handleLogout}
                  >
                    <LogOut className="text-red-500" />
                    <p className="text-red-500 font-light">Logout</p>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
