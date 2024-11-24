import { FormType } from "@models/Authentication.ts";
import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useState } from "preact/hooks";
import { verifyEmailIntegrity, verifyPasswordIntegrity, verifySamePassword } from "@utils/login.ts";
import { IconChevronDown, IconLoader, IconSend } from "@utils/icons.ts";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

import { Toaster } from "@components/UI/Toast/Toaster.tsx";
import { useToast } from "@hooks/toast.tsx";
import { FormField, FormFieldValue } from "@models/Form.ts";
import { Input } from "@islands/UI";
import Button from "./UI/Button.tsx";
import { cn } from "@utils/cn.ts";

type AuthFormFields = "email" | "password" | "confirmpassword";

const customInputsStyle = "w-full border-x-0 border-t-0 border-b-2 rounded-none outline-none";

export default function AuthForm({ type, additional_data, error }: FormType) {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>(additional_data?.email ?? "");
  const [password, setPassword] = useState<string>(additional_data?.password ?? "");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formsInputs: Record<AuthFormFields, FormField> = useMemo(() => ({
    email: {
      name: "email",
      type: "email",
      placeholder: "Email *",
      required: true,
      defaultValue: additional_data?.email, // TODO: default vbalue not working hzere, maybe try to manually assign with ref
      validation: verifyEmailIntegrity,
      sx: customInputsStyle,
    },
    password: {
      name: "password",
      type: "password",
      placeholder: "Password *",
      required: true,
      defaultValue: additional_data?.password,
      validation: verifyPasswordIntegrity,
      sx: customInputsStyle,
    },
    confirmpassword: {
      name: "confirmpassword",
      type: "password",
      placeholder: "Confirm password *",
      required: true,
      sx: customInputsStyle,
    },
  }), [type, additional_data]);

  useEffect(() => console.log("form: ", formsInputs), [formsInputs]);

  useEffect(() => {
    console.log("Props: ", { type, additional_data, error });
    if (error) {
      toast({
        title: "Erreur d'authentification",
        description: error.message,
      });
    }
    if (type !== "action_done" && additional_data?.message) {
      toast({
        description: additional_data.message,
      });
    }
  }, [error, additional_data?.message]);

  const handleInputChange = useCallback((key: AuthFormFields, value: FormFieldValue) => {
    switch (key) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmpassword":
        setConfirmPassword(password === value ? value : "");
        break;
    }
  }, [email, password, confirmpassword]);

  // If the form is an action done with a message, display the message as a simple texts
  if (type === "action_done" && additional_data?.message) {
    return (
      <div class="w-full h-screen flex justify-center items-center">
        <div class="w-10/12 max-w-lg flex justify-center items-center flex-col gap-10">
          <p className={"text-text text-center leading-loose"}>{additional_data.message}</p>
          <Button href={"/"}>Retourner à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div class="w-full h-screen inline-flex justify-center items-center">
        <form
          class={cn(
            "w-10/12 max-w-xs flex justify-center items-center flex-col gap-10 relative",
          )}
          method={"POST"}
          onSubmit={() => setIsLoading(true)}
        >
          {type === "default" && (
            <>
              <input type="hidden" name="authtype" value={"signin"} />
              <Input field={formsInputs.email} onChange={(v) => handleInputChange("email", v)} />
              {email && (
                <button className={`absolute left-[calc(100%+1rem)] ${isLoading && "animate-spin"}`} type={"submit"}>
                  {isLoading ? <IconLoader color={"white"} /> : <IconSend color={"white"} />}
                </button>
              )}
              <Accordion
                className="absolute top-[calc(100%+2.5rem)] left-0 right-0 w-full bg-back"
                type="single"
                collapsible
              >
                <AccordionItem value="item-1">
                  <AccordionHeader>
                    <AccordionTrigger className="flex flex-1 cursor-default items-center justify-between outline-none w-full p-1 group opacity-60 data-[state=open]:opacity-100">
                      <span className={"text-text_grey"}>Connexion avec mot de passe ?</span>
                      <IconChevronDown className="text-text_grey transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                    </AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent
                    className="overflow-hidden pt-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                  >
                    <Input field={formsInputs.password} onChange={(v) => handleInputChange("password", v)} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
          {type === "signup" && (
            <>
              <input type="hidden" name="authtype" value={"signup"} />
              <Input field={formsInputs.email} onChange={(v) => handleInputChange("email", v)} />
              <Input field={formsInputs.password} onChange={(v) => handleInputChange("password", v)} />
              <Input field={formsInputs.confirmpassword} onChange={(v) => handleInputChange("confirmpassword", v)} />
              <Button
                type={email && password && confirmpassword ? "submit" : "button"}
                disabled={!(email && password && confirmpassword)}
              >
                Demander des accès
              </Button>
            </>
          )}
        </form>
      </div>
      <Toaster />
    </>
  );
}
