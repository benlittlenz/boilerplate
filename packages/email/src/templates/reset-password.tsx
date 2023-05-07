import BaseEmail from "./base"
import { Heading, Text, Section, Button } from "../components";
import { type ResetPasswordEmailProps } from "../types";

export const ResetPasswordEmail = ({ name, resetLink }: ResetPasswordEmailProps) => {
    return (
      <BaseEmail previewText="Reset your email">
        <Heading>Reset your password</Heading>
        <Text>Hello {name},</Text>
        <Text>You have requested for your password to be reset.</Text>
        <Section className="mb-[32px] mt-[32px] text-center">
          <Button pX={20} pY={12} href={resetLink ?? ""}>
            Reset your password
          </Button>
        </Section>
        <Text className="text-[14px] leading-[24px] text-black">
          If you didn&apos;t request this, you can safely ignore this email and
          your password will not be changed.
        </Text>
      </BaseEmail>
    );
}
