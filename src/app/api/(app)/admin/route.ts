import { prismaClient } from "@/lib/application/database";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, phone } = JSON.parse(await req.text());

    const userData = Validation.validate(UserValidation.ADMIN, {
      name,
      username,
      email,
      phone,
    });
    const newAdmin = await prismaClient.adminAccount.create({
      data: userData,
    });

    return Response.json({ status: 201, newAdmin });
  } catch (error) {
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }
}

export async function GET() {
  try {
    const data = await prismaClient.adminAccount.findMany();

    return Response.json({ status: 200, data });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
