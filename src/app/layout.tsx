import SessionProviderClient from "@/components/session-provider-client";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Metadata } from "next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintrack",
  description: "Aplicativo para gerenciamento de atendimentos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderClient>
          {children}
          <Toaster />
        </SessionProviderClient>
      </body>
    </html>
  );
}
