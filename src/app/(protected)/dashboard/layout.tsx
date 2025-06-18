"use client"

import { FloatingActionButtons } from "@/components/floating-action-buttons";
import { Header } from "@/components/header";
import HeaderWeb from "@/components/header-web";
import { MenuBar } from "@/components/menu-bar";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultOptions } from "date-fns";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="hidden md:block">
        <HeaderWeb />
      </div>
      <div className="px-4 pt-5">
        <div className="pb-24 lg:max-w-7xl lg:mx-auto lg:px-4">
          <div className="flex md:hidden mb-8">
            <Header />
          </div>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </div>
        <div className="block lg:hidden">
          <FloatingActionButtons>
            <MenuBar />
          </FloatingActionButtons>
        </div>
      </div>
    </div>
  );
}
