import * as React from "react";

import cx from "classnames";

type DashboardShellProps = React.HTMLAttributes<HTMLDivElement>

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cx("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  );
}
