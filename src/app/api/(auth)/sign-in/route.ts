import { prismaClient } from "@/lib/application/database";
import { logger } from "@/lib/application/logging";
import { UserValidation } from "@/lib/validation/user-validation";
import { Validation } from "@/lib/validation/validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { username, email, password } = JSON.parse(await req.text());

    const data = Validation.validate(UserValidation.LOGIN, {
      username,
      email,
      password,
    });

    const isUserExist = username
      ? await prismaClient.member.findUnique({
          where: {
            username: data.username,
          },
        })
      : await prismaClient.member.findUnique({
          where: {
            email: data.email,
          },
        });

    if (!isUserExist)
      return new Response(`${username ? username : email} does not exist`, {
        status: 404,
      });

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordValid)
      return new Response("username or email or password is wrong", {
        status: 400,
      });

    const token = jwt.sign(
      { username: isUserExist.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" /* kadarluarsa dalam 1 jam */ }
    );

    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return Response.json({ status: 200, token });
  } catch (error) {
    logger.error(error);
    return new Response("Error login", { status: 500 });
  }
};
