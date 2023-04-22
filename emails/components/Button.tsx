import { Button as ButtonBase, type ButtonProps } from "@react-email/components";
import cx from "classnames";

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <ButtonBase
      {...props}
      className={cx(
        "cursor-pointer rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline",
        className
      )}
    >
      {children}
    </ButtonBase>
  );
};
