export interface BaseEmailOptions {
    to: string;
}

export interface BaseEmailProps {
  previewText: string;
  children: React.ReactNode;
}

export interface ResetPasswordEmailProps {
  name: string;
  resetLink: string;
}

export interface WelcomeEmailProps {
    name: string;
}
