"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export const UserDropdown = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const userData = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "sem-email@exemplo.com",
    avatar: session?.user?.image || "",
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-8 h-8 rounded-[99px] justify-center items-center flex hover:bg-[hsla(0,0%,100%,0.08)] transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={userData.avatar || ""}
              alt="Avatar do usuário"
            />
            <AvatarFallback className="!bg-[#2a2a2e] text-[#fafafb] text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 !bg-[#131316] border-[#2a2a2e] text-white p-0 mr-4">
        <div className="p-4 border-b border-[#2a2a2e]">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-black">
              <AvatarImage
                src={userData.avatar || ""}
                alt={userData.name}
              />
              <AvatarFallback className="!bg-[#2a2a2e] text-[#fafafb]">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm truncate max-w-[150px]">
                {userData.name}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[150px]">
                {userData.email}
              </p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <Button
            variant="default"
            className="w-full justify-start text-sm font-normal text-red-400 hover:text-red-300 hover:bg-[hsla(0,0%,100%,0.08)] cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
