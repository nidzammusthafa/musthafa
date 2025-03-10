import { prismaClient } from "@/lib/application/database";
import { logger } from "@/lib/application/logging";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { username, name, password, email, phone } = JSON.parse(
      await req.text()
    );

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Implement authentication logic here
    const data = Validation.validate(UserValidation.MEMBER, {
      username,
      name,
      password: hashedPassword,
      email,
      phone,
    });

    const isUserExist = await prismaClient.member.findFirst({
      where: { username },
    });

    if (isUserExist)
      return new Response(`${username} already exists`, { status: 400 });
    const newUser = await prismaClient.member.create({
      data,
    });

    return Response.json({ status: 201, newUser });
  } catch (error) {
    logger.error(error);
    return new Response(`Validation error: ${error}`, { status: 400 });
  }
};
