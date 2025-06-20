import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

import type { PrismaClient } from "@prisma/client/edge";

const typedPrisma = prisma as unknown as PrismaClient;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // Força o Google a perguntar qual conta usar
        },
      },
    }),
  ],
  callbacks: {
    // Função chamada quando o usuário se autentica
    async signIn({ user }) {
      console.log("Dados do usuário autenticado:", user);

      // Certifique-se de que está buscando o usuário pelo googleId corretamente
      const existingUser = await typedPrisma.user.findUnique({
        where: { googleId: user.id }, // Verifique se user.id é realmente o googleId
      });

      if (!existingUser) {
        console.log("Criando novo usuário:", user.id);
        await typedPrisma.user.create({
          data: {
            googleId: user.id, // Salva o googleId corretamente
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      } else {
        console.log("Usuário encontrado:", existingUser);
      }

      return true; // Permite o login
    },

    // Função chamada para gerar o JWT
    async jwt({ token, user }) {
      if (user) {
        console.log("Associando googleId ao JWT:", user.id);
        token.sub = user.id; // Salva o googleId no token
      }
      console.log("Token JWT:", token); // Verifique o conteúdo do token
      return token; // Retorna o token modificado
    },

    // Função chamada ao carregar a sessão
    async session({ session, token }) {
      console.log("Dados da sessão:", session, token); // Verifique o conteúdo da sessão e do token

      if (session?.user && token.sub) {
        const user = await typedPrisma.user.findUnique({
          where: { googleId: token.sub }, // Utilizando o googleId para buscar o usuário
        });

        if (user) {
          // Associando os dados do usuário à sessão
          session.user.id = user.id;
          session.user.email = user.email;
          session.user.name = user.name;
          session.user.image = user.image;
          console.log("Usuário encontrado e associado à sessão:", session);
        }
      }

      return session; // Retorna a sessão modificada
    },
  },
  session: {
    strategy: "jwt", // Usando JWT para a estratégia de sessão
  },
};
