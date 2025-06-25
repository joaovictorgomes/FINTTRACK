import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
// import type { PrismaClient } from "@prisma/client/edge";

// const prisma = prisma as unknown as PrismaClient;

export async function POST(req: Request) {
  try {
    // Obter a sessão do usuário
    const session = await getServerSession(authOptions);

    // Verifique se a sessão existe e se o usuário está autenticado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      date,
      time,
      type,
      attendant,
      price,
      payment,
      status,
      image,
      notes,
    } = body;

    if (
      !date ||
      !time ||
      !type ||
      !attendant ||
      typeof price !== "number" ||
      !payment ||
      !status
    ) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando ou inválidos." },
        { status: 400 }
      );
    }

    const novoAtendimento = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        type,
        attendant,
        price,
        payment,
        status,
        image,
        notes,
        userId: session.user.id,
      },
    });

    return NextResponse.json(novoAtendimento, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar atendimento:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Obter a sessão do usuário
    const session = await getServerSession(authOptions);

    // Verifique se a sessão existe e se o usuário está autenticado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const atendimentos = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(atendimentos, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao obter atendimentos:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor.", details: error.message },
      { status: 500 }
    );
  }
}
