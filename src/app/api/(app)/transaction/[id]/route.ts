import { prismaClient } from "@/lib/application/database";
import { logger } from "@/lib/application/logging";
import { TransactionValidation } from "@/lib/validation/transaction-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const transaction = await prismaClient.transaction.findFirst({
      where: { id },
    });
    if (!transaction) {
      return new Response("Transaction not found", { status: 404 });
    }
    return Response.json({ status: 200, transaction });
  } catch (error) {
    logger.error(error);
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const { amount, paymentMethod, payer, payee, description } = JSON.parse(
      await req.text()
    );

    const data = Validation.validate(TransactionValidation.UPDATE, {
      amount,
      paymentMethod,
      payer,
      payee,
      description,
    });

    const updatedTrasactions = await prismaClient.transaction.update({
      where: { id },
      data,
    });

    if (!updatedTrasactions)
      return new Response(
        "Error updating transaction : transaction not found",
        { status: 404 }
      );

    return Response.json({ status: 200, updatedTrasactions });
  } catch (error) {
    logger.error(error);
    return new Response(`Error updating transaction : ${error}`, {
      status: 400,
    });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const deletedTransaction = await prismaClient.transaction.delete({
      where: { id },
    });

    if (!deletedTransaction.success)
      return new Response("Error deleting transaction", { status: 404 });

    return Response.json({ status: 200, deletedTransaction });
  } catch (error) {
    logger.error(error);
    return new Response(`Error deleting transaction : ${error}`, {
      status: 400,
    });
  }
};
