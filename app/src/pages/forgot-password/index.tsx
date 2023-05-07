import { forgotPasswordSchema, type IForgotPassword } from "@starter/api";
import { Button, Input } from "@starter/ui";
import { api } from "~/utils/api";
import AuthContainer from "~/components/auth-container";
import { Form } from "~/components/form";


const ForgotPasswordPage = () => {
  const { isLoading, mutateAsync } = api.user.forgotPassword.useMutation();
  return (
    <AuthContainer title="Forgot password">
      <Form<IForgotPassword, typeof forgotPasswordSchema>
        onSubmit={async (values) => {
          const res = await mutateAsync(values);
          console.log("RESULT >>> ", res);
        }}
        schema={forgotPasswordSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register }) => (
          <>
            <Input
              label="Email"
              type="text"
              name="email"
              registration={register("email")}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              onClick={() => console.log("CLICKED")}
            >
              Reset Password
            </Button>
          </>
        )}
      </Form>
    </AuthContainer>
  );
};

export default ForgotPasswordPage;
