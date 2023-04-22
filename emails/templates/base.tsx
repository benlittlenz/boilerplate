import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import { type BaseEmailProps } from "emails/types";

export const BaseEmail = ({ previewText, children }: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`/react-logo.png`}
                width="40"
                height="37"
                alt="React logo"
                className="mx-auto my-0"
              />
            </Section>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BaseEmail;
