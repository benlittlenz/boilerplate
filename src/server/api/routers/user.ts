import { type ResetPasswordRequest } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import dayjs from "dayjs";
import { sendResetPasswordEmail } from "emails/utils/email-manager";
import { forgotPasswordSchema, registerSchema } from "~/lib/validations/auth";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, passwordConfirm } = input;

      if (password !== passwordConfirm) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Passwords do not match",
        });
      }

      const hashedPassword = await hash(password);

      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        });

        return user;
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  forgotPassword: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

    const user = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.email) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const hasPreviousRequest = await ctx.prisma.resetPasswordRequest.findMany({
      where: {
        email: user.email,
        expires: {
          gt: new Date(),
        },
      },
    });

    let passwordReq: ResetPasswordRequest;

    if (hasPreviousRequest && hasPreviousRequest.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        passwordReq = hasPreviousRequest[0]!;
    } else {
        const expiry = dayjs().add(6, "hours").toDate();
        const createdResetPasswordRequest =
        await ctx.prisma.resetPasswordRequest.create({
            data: {
            email: user.email,
            expires: expiry,
            },
        });
        passwordReq = createdResetPasswordRequest;
    }
    const resetLink = `http://localhost:${
        process.env.PORT ?? 3000
    }/forgot-password/${passwordReq.id}`;

    console.log("resetLink >>> ", resetLink);
    await sendResetPasswordEmail({
      to: user.email,
      resetLink,
      name: user.name ?? "",
    });
    }),
});
