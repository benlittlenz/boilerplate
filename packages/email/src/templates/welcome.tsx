import BaseEmail from "./base";
import { Heading, Text, Section, Button } from "../components";
import { type WelcomeEmailProps } from "../types";

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  return (
    <BaseEmail previewText="Reset your email">
      <Heading>Welcome!</Heading>
      <Text>Hello {name},</Text>
      <Text>Welcome to Blah! The all in one SaaS boilerplate template</Text>
      <Section className="mb-[32px] mt-[32px] text-center">
        <Button pX={20} pY={12} href="">
          Get Started
        </Button>
      </Section>
      <Text className="text-[14px] leading-[24px] text-black">
        All the Best!
      </Text>
    </BaseEmail>
  );
};
