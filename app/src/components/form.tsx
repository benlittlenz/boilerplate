import {
  useForm,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  FormProvider,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodType, type ZodTypeDef } from "zod";
import cx from "classnames";

type FormProps<TFormValues extends FieldValues, Schema> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactElement;
  options?: UseFormProps<TFormValues>;
  id?: string;
  schema?: Schema;
};

//test

export const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const methods = useForm<TFormValues>({
    ...options,
    resolver: schema && zodResolver<Schema>(schema),
  });

  return (
    <FormProvider {...methods}>
      <form
        className={cx("space-y-6", className)}
        onSubmit={methods.handleSubmit(onSubmit)}
        id={id}
      >
        {children(methods)}
      </form>
    </FormProvider>
  );
};
