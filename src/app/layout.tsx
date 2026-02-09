import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Generation Application",
};

export default function RootLayout({ children }: child) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
