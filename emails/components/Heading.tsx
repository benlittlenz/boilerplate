import { Heading as HeadingBase } from "@react-email/components";
import cx from "classnames";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

export const Heading = ({ children, className, ...props }: HeadingProps) => {
  return (
    <HeadingBase
      {...props}
      className={cx(
        "mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black",
        className
      )}
    >
      {children}
    </HeadingBase>
  );
};
