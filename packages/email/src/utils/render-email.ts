import { render } from "@react-email/render";

import * as templates from "../templates";

type TemplateProps<T extends keyof typeof templates> = React.ComponentProps<
  (typeof templates)[T]
>;

type EmailComponent<T extends keyof typeof templates> = (
  props: TemplateProps<T>
) => JSX.Element;

export const renderEmail = <T extends keyof typeof templates>(
  template: T,
  props: TemplateProps<T>
) => {
  const Email = templates[template] as EmailComponent<T>;

  const html = render(Email(props), {
    pretty: true,
  });

  return html;
};
