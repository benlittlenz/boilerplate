import { type Metadata, type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AuthContainer from "~/components/auth-container";
import { Form } from "~/components/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/form/input";
import { type ILogin, loginSchema } from "~/lib/validations/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => {
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  return (
    <AuthContainer title="Sign in to your account">
      {error && (
        <p className="mb-2 text-sm font-semibold text-red-500">{error}</p>
      )}
      <Form<ILogin, typeof loginSchema>
        id="login-form"
        onSubmit={async (values) => {
          const res = await signIn("credentials", {
            ...values,
            redirect: false,
          });
          console.log("RES", res)
          if (res?.ok) {
            void router.push("/dashboard");
          } else {
            setError("Credentials do not match our records");
          }
        }}
        schema={loginSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              label="Email"
              type="email"
              name="email"
              registration={register("email")}
              error={formState.errors.email}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              registration={register("password")}
              error={formState.errors.password}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </>
        )}
      </Form>
      <div className="pt-2">
        <span className="text-sm font-medium text-gray-900">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          href="/register"
          className="text-sm font-semibold text-gray-900 hover:underline"
        >
          Create an account
        </Link>
      </div>
    </AuthContainer>
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
    props: {
        session,
    },
  };
}

export default LoginPage;
