import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Função DELETE - Deletar um atendimento pelo ID
export async function DELETE(req: Request) {
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

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Pega o ID da URL

    if (!id) {
      return NextResponse.json(
        { error: "ID do atendimento é obrigatório." },
        { status: 400 }
      );
    }

    // Verifica se o atendimento existe e se pertence ao usuário logado
    const atendimento = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!atendimento || atendimento.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Atendimento não encontrado ou não autorizado." },
        { status: 404 }
      );
    }

    // Deleta o atendimento
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Atendimento deletado com sucesso." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao deletar atendimento:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor.", details: error.message },
      { status: 500 }
    );
  }
}

// Função PUT - Atualizar um atendimento pelo ID
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID do atendimento é obrigatório." },
        { status: 400 }
      );
    }

    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Atendimento não encontrado ou não autorizado." },
        { status: 404 }
      );
    }

    const body = await req.json();

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: body.date,
        time: body.time,
        type: body.type,
        attendant: body.attendant,
        price: body.price,
        payment: body.payment,
        status: body.status,
        image: body.image,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar atendimento:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor.", details: error.message },
      { status: 500 }
    );
  }
}

// Função GET - Buscar um atendimento pelo ID
export async function GET(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop(); 

    if (!id) {
      return NextResponse.json(
        { error: "ID do atendimento é obrigatório." },
        { status: 400 }
      );
    }

    // Busca o atendimento no banco de dados
    const atendimento = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!atendimento) {
      return NextResponse.json(
        { error: "Atendimento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(atendimento, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar atendimento:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor.", details: error.message },
      { status: 500 }
    );
  }
}
