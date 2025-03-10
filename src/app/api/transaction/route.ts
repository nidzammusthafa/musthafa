import { prismaClient } from "@/lib/application/database";
import { logger } from "@/lib/application/logging";
import { TransactionValidation } from "@/lib/validation/transaction-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { username, amount, paymentMethod, payer, payee, description } =
      JSON.parse(await req.text());

    const data = Validation.validate(TransactionValidation.CREATE, {
      username,
      amount,
      paymentMethod,
      payer,
      payee,
      description,
    });

    const newTransaction = await prismaClient.transaction.create({
      data: {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        payer: data.payer,
        payee: data.payee,
        description: data.description,
        admin: { connect: { username: "nidzam" } },
        member: { connect: { username } },
      },
    });

    return new NextResponse(JSON.stringify({ status: 201, newTransaction }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    logger.error(error);
    return new NextResponse(`Error creating transaction : ${error}`, {
      status: 400,
    });
  }
};

export const GET = async () => {
  try {
    const transactions = await prismaClient.transaction.findMany({
      include: {
        admin: true,
        member: true,
      },
    });

    return new NextResponse(JSON.stringify({ status: 200, transactions }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    logger.error(error);
    return new NextResponse(`Database error: ${error}`, {
      status: 500,
    });
  }
};
