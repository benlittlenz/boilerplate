import { Text as TextBase, type TextProps } from "@react-email/components";
import cx from "classnames";

export const Text = ({ children, className, ...props }: TextProps) => {
  return (
    <TextBase
      {...props}
      className={cx("text-[14px] leading-[24px] text-black", className)}
    >
      {children}
    </TextBase>
  );
};
