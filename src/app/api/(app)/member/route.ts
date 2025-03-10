import { prismaClient } from "@/lib/application/database";
import { NextRequest } from "next/server";

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
