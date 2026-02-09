import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/backend/client";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Generation Application",
};

export default function RootLayout({ children }: child) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <TRPCReactProvider>
          <main className="w-full">
            {children}
            <Toaster />
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
