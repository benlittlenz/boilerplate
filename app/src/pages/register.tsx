import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import AuthContainer from "~/components/auth-container";
import { Form } from "~/components/form";
import { Button } from "@starter/ui";
import { Input } from "@starter/ui";
import { type IRegister, registerSchema } from "@starter/api";
import { api } from "~/utils/api";

const Success = () => {
  return (
    <div className="space-y-6">
      <div className="pb-6">
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Account successfully created
        </h2>
        <p className="text-md mt-2 text-center font-normal text-gray-400">
          Click the link below to login
        </p>
      </div>
      <Button className="mx-auto">
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
};

const RegisterPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<null | string>(null);

  const { isLoading, status, mutateAsync } = api.user.register.useMutation();

  return (
    <div>
      {status !== "success" && (
        <AuthContainer title="Register an account">
          {error && (
            <p className="mb-2 text-sm font-semibold text-red-500">{error}</p>
          )}
          <Form<IRegister, typeof registerSchema>
            onSubmit={async (values) => {
              const result = await mutateAsync(values);

              console.log("RESULT >>>> ", result);
            }}
            schema={registerSchema}
          >
            {({ register, formState }) => (
              <>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  registration={register("name")}
                  error={formState.errors["name"]}
                />
                <Input
                  label="Email"
                  type="text"
                  name="email"
                  registration={register("email")}
                  error={formState.errors["email"]}
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  registration={register("password")}
                  error={formState.errors["password"]}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  name="passwordConfirm"
                  registration={register("passwordConfirm")}
                  error={formState.errors["passwordConfirm"]}
                />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Register
                </Button>
              </>
            )}
          </Form>
          <div className="pt-2">
            <span className="text-sm font-medium text-gray-900">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-900 hover:underline"
            >
              Login here
            </Link>
          </div>
        </AuthContainer>
      )}
      {status === "success" && (
        <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="mx-2 space-y-6 rounded-lg bg-white px-4 py-8 shadow sm:px-10">
              <Success />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req } = ctx;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default RegisterPage;
