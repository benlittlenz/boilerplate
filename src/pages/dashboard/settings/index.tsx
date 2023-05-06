import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "~/hooks/use-toast";
import { Form } from "~/components/form";
import { Input } from "~/components/ui/form/input";
import { Button } from "@react-email/components";
import { type ISettings, settingsSchema } from "~/lib/validations/auth";

export function Settings() {

  return (
    <Form<ISettings, typeof settingsSchema>
      id="login-form"
      onSubmit={async (values) => {}}
      schema={settingsSchema}
    >
      {({ register, formState }) => (
        <>
          <Input
            label="Name"
            type="text"
            name="name"
            registration={register("name")}
            error={formState.errors.name}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </>
      )}
    </Form>
  );
}
