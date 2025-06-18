"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/google-login-button";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  console.log("Sessão não encontrada, redirecionando para login", session), session;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 sm:px-6 lg:px-8">
      {/* Novo fundo com formas abstratas */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos e formas decorativas */}
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-gray-800 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-gray-700 opacity-15 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-gray-800 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gray-700 opacity-20 blur-3xl"></div>

        {/* Linhas sutis */}
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-20"></div>
        <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-gray-800 to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-20"></div>

        {/* Efeito de ruído sutil (simulado com uma imagem SVG) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-gray-800 bg-black/50 p-8 shadow-xl backdrop-blur-xl">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-bold text-white">Bem-vindo</h1>
            <p className="text-lg text-gray-400">Acesse sua conta facilmente</p>
          </div>

          <GoogleLoginButton />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Ao continuar, você concorda com nossos</p>
            <p className="mt-1">
              <a
                href="#"
                className="font-medium text-gray-300 hover:text-white"
              >
                Termos de Serviço
              </a>
              {" & "}
              <a
                href="#"
                className="font-medium text-gray-300 hover:text-white"
              >
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} FinTrack. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
