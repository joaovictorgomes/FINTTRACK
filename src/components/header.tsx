"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { data: session } = useSession();

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Normalmente esses dados viriam de um contexto de autenticação
  const userData = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "sem-email@exemplo.com",
    avatar: session?.user?.image || "",
  };

  return (
    <header className="w-full flex justify-center">
      <div className="h-10 px-1.5 bg-[#131316] rounded-[99px] shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.20)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.20)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] flex items-center justify-between overflow-hidden z-10 w-full max-w-md">
        <button
          onClick={handleGoBack}
          className="w-8 h-8 rounded-[99px] justify-center items-center flex hover:bg-[hsla(0,0%,100%,0.08)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[#fafafb]" />
          <span className="sr-only">Voltar</span>
        </button>

        <div className="text-[#fafafb] font-medium text-sm">FinTrack</div>

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
                variant="ghost"
                className="w-full justify-start text-sm font-normal text-red-400 hover:text-red-300 hover:bg-[hsla(0,0%,100%,0.08)]"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
