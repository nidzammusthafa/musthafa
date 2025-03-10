import { prismaClient } from "@/lib/application/database";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, phone } = JSON.parse(await req.text());

    const data = Validation.validate(UserValidation.MEMBER, {
      name,
      username,
      email,
      phone,
    });

    const isMemberExist = await prismaClient.member.findFirst({
      where: { username: data.username },
    });

    if (isMemberExist) {
      return new Response(`Register error : Member already exist`, {
        status: 400,
      });
    }

    const newMember = await prismaClient.member.create({
      data,
    });

    return Response.json({
      status: 201,
      newMember,
    });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    const skip = Number(limit) * (Number(page) - 1);

    const members = await prismaClient.member.findMany({
      skip,
      take: Number(limit),
    });
    return Response.json({ status: 200, members });
  } catch (error) {
    return new Response(`Database error: ${error}`, {
      status: 500,
    });
  }
}
