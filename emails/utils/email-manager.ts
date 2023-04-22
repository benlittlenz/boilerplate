import { type WelcomeEmailProps, type BaseEmailOptions, type ResetPasswordEmailProps } from "emails/types";
import { sendEmail } from "emails/utils/config";
import { renderEmail } from "emails/utils/render-email";

export const sendResetPasswordEmail = async (
  props: BaseEmailOptions & ResetPasswordEmailProps
) => {
  const { to, name, resetLink} = props;
  const options = {
    from: "joe@doe.com",
    to,
    subject: "Reset your password",
    html: renderEmail("ResetPasswordEmail", {
      name,
      resetLink,
    }),
  };
  return await sendEmail(options, "ResetPasswordEmail");
};

export const sendWelcomeEmail = async (
    props: BaseEmailOptions & WelcomeEmailProps
) => {
    const { to, name } = props;
    const options = {
        from: "joe@doe.com",
        to,
        subject: "Welcome to ....",
        html: renderEmail("WelcomeEmail", {
            name,
        }),
    };
    return await sendEmail(options, "WelcomeEmail");
};
