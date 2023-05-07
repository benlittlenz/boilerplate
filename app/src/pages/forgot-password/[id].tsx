/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { type ResetPasswordRequest } from "@starter/db";
import dayjs from "dayjs";
import { getCsrfToken } from "next-auth/react";

import { resetPasswordSchema, type IResetPassword } from "@starter/api";
import { prisma } from "@starter/db";
import { Button, Input } from "@starter/ui";

import { Form } from "~/components/form";
import useDebounce from "~/hooks/use-debounce";


interface ResetPasswordProps {
  resetToken: string;
  resetPasswordRequest: ResetPasswordRequest;
  csrfToken: string;
}

const ResetPasswordPage = ({
  resetToken,
  resetPasswordRequest,
  csrfToken,
}: ResetPasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<{ message: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const submitChangePassword = async ({
    password,
    requestId,
  }: {
    password: string;
    requestId: string;
  }) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ requestId: requestId, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setError({ message: "Failed to reset password" });
      } else {
        setSuccess(true);
      }


      return json;
    } catch (reason) {
      setError({ message: "Unexpected error, please try again" });
    } finally {
      setLoading(false);
    }
  };
  const debouncedChangePassword = useDebounce(submitChangePassword, 250);

  const Success = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password has been successfully reset
          </h2>
        </div>
        <Button>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  };

  const Expired = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Something went wrong.
          </h2>
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Request has expired.
          </h2>
        </div>
        <p>Please submit a new request to reset your password</p>
        <Button href="/forgot-password">Try again</Button>
      </div>
    );
  };

  const isRequestExpired = useMemo(() => {
    const now = dayjs();
    return dayjs(resetPasswordRequest.expires).isBefore(now);
  }, [resetPasswordRequest]);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-2 space-y-6 rounded-lg bg-white px-4 py-8 shadow sm:px-10">
          {isRequestExpired && <Expired />}
          {!isRequestExpired && status !== "success" && (
            <>
              <div className="space-y-6">
                <h2 className="font-cal mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Reset Password
                </h2>
                <p>Enter a new password</p>
                {/* {error && <p className="text-red-600">{error.message}</p>} */}
              </div>
              <Form<IResetPassword, typeof resetPasswordSchema>
                onSubmit={(values) => {
                  console.log("VALUES HERE", values);
                }}
                schema={resetPasswordSchema}
                options={{
                  shouldUnregister: true,
                }}
              >
                {({ register, formState }) => {
                  console.log("ERROR >>> ", formState);
                  return (
                    <>
                      <input type="hidden" hidden defaultValue={csrfToken} />
                      <Input
                        label="Password"
                        type="password"
                        name="password"
                        registration={register("password")}
                      />
                      <Input
                        label="Confirm password"
                        type="password"
                        name="passwordConfirm"
                        registration={register("passwordConfirm")}
                      />
                      <Button type="submit">Register</Button>
                    </>
                  );
                }}
              </Form>
            </>
          )}
          {!isRequestExpired && status === "success" && (
            <>
              <Success />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;
  try {
    const resetPasswordRequest = await prisma.resetPasswordRequest.findUnique({
      rejectOnNotFound: true,
      where: {
        id,
      },
      select: {
        id: true,
        expires: true,
      },
    });

    return {
      props: {
        resetPasswordRequest: {
          ...resetPasswordRequest,
          expires: resetPasswordRequest.expires.toString(),
        },
        resetToken: id,
        csrfToken: await getCsrfToken({ req: context.req }),
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default ResetPasswordPage;
