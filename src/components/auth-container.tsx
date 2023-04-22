import React from "react";

interface Props {
  title: string;
}

export default function AuthContainer({
  title,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-200 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {title && (
          <h2 className="mt-6 text-center text-3xl text-neutral-900">
            {title}
          </h2>
        )}
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-md bg-white px-4 py-8 shadow-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
