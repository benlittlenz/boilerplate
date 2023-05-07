import { hash } from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";
import { type TypeOf } from "zod";
import { type resetPasswordSchema } from "@starter/api";
import { prisma } from "@starter/db";

interface ResetPasswordRequest extends NextApiRequest {
    body: TypeOf<typeof resetPasswordSchema> & {
        requestId: string;
    }
}

export default async function handler(
  req: ResetPasswordRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "" });
  }

  const result = req.body

  try {
    const rawPassword = result?.password;
    const rawConfirmPassword = result?.passwordConfirm;
    const rawRequestId = result?.requestId;

    if (rawPassword !== rawConfirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!rawPassword || !rawRequestId) {
      return res
        .status(400)
        .json({ message: "Couldn't find an account for this email" });
    }

    const maybeRequest = await prisma.resetPasswordRequest.findUnique({
      where: {
        id: rawRequestId,
      },
    });

    if (!maybeRequest) {
      return res
        .status(400)
        .json({ message: "Couldn't find an account for this email" });
    }

    const maybeUser = await prisma.user.findUnique({
      where: {
        email: maybeRequest.email,
      },
    });

    if (!maybeUser) {
      return res
        .status(400)
        .json({ message: "Couldn't find an account for this email" });
    }

    const hashedPassword = await hash(rawPassword);

    await prisma.user.update({
      where: {
        id: maybeUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Password reset." });
  } catch (reason) {
    console.error(reason);
    return res
      .status(500)
      .json({ message: "Unable to create password reset request" });
  }
}
