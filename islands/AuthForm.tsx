import { FormType } from "@models/Authentication.ts";
import { useEffect } from "preact/hooks";
import { useState } from "preact/hooks";
import { verifyEmailIntegrity, verifyPasswordIntegrity, verifySamePassword } from "@utils/login.ts";
import {IconSend} from "@utils/icons.ts";
import Alert from "@components/Misc/Alert.tsx";

export default function AuthForm({ type, additional_data, error }: FormType) {
  const [email, setEmail] = useState<string>(additional_data?.email ? additional_data.email : "");
  const [password, setPassword] = useState<string>(additional_data?.password ? additional_data.password : "");
  const [confirmpassword, setConfirmPassword] = useState<string>("");

  const [validForm, setValidForm] = useState({
    email: false,
    password: false,
    confirmpassword: false,
  });

  useEffect(() => {
    setValidForm({
      email: email ? verifyEmailIntegrity(email) : false,
      password: password ? verifyPasswordIntegrity(password) : false,
      confirmpassword: confirmpassword ? verifySamePassword(password, confirmpassword) : false,
    });
  }, [email, password, confirmpassword]);

  return (
    <>
      <div class="w-full h-screen inline-flex justify-center items-center">
        <form
          class={`max-w-md w-1/3 flex justify-center items-center ${type === "default" && `relative`}
      ${type === "signup" && `flex-col gap-10`}`}
          method={"POST"}
        >
          <input
            className={`w-full border-b-2 rounded-none border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
          ${!validForm.email && email ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm" : "text-text rounded-none"}
          `}
            type="email"
            name="email"
            placeholder={"Email *"}
            value={email}
            onInput={(e) => {
              setEmail((e.target as HTMLInputElement)?.value);
            }}
          />
          {type === "default" && validForm.email && (
            <button class="absolute left-[calc(100%+1rem)]" type={"submit"}>
              <IconSend color={"white"} />
            </button>
          )}
          {type === "signup" && (
            <>
              <input
                className={`w-full border-b-2 rounded-none border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
                         ${
                           !validForm.password && password
                             ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm"
                             : "text-text rounded-none"
                         }
                       `}
                type="password"
                name="password"
                placeholder={"Password *"}
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement)?.value)}
              />
              <input
                className={`w-full border-b-2 border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
                       ${
                         !validForm.confirmpassword && confirmpassword
                           ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm"
                           : "text-text rounded-none"
                       }
                       `}
                type="password"
                name="confirmpassword"
                placeholder={"Confirm password *"}
                value={confirmpassword}
                onChange={(e) => setConfirmPassword((e.target as HTMLInputElement)?.value)}
              />
              {!Object.values(validForm).every((value) => value) && (
                <button class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5" disabled={true}>
                  Demander des accès
                </button>
              )}
              {Object.values(validForm).every((value) => value) && (
                <button class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5" disabled={false} type={"submit"}>
                  Demander des accès
                </button>
              )}
            </>
          )}
        </form>
      </div>
      {error && <Alert message={error.message} error={true} />}
    </>
  );
}
