import { FormType } from "@models/Authentication.ts";
import { useEffect } from "preact/hooks";
import { useState } from "preact/hooks";
import {
  verifyEmailIntegrity,
  verifyPasswordIntegrity,
  verifySamePassword,
} from "@utils/login.ts";
import { Send } from "lucide-icons";

export default function AuthForm({ type, additional_data, error }: FormType) {
  const [email, setEmail] = useState<string>(
    additional_data?.email ? additional_data.email : "",
  );
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");

  const [validForm, setValidForm] = useState({
    email: false,
    password: false,
    confirmpassword: false,
  });

  useEffect(() => {
    console.log("validForm", validForm);
  }, [validForm]);

  return (
    <>
      <div class="w-full h-screen inline-flex justify-center items-center">
        <form
          class={`flex justify-center items-center ${type === "default" && ``}
      ${type === "signup" && `flex-col gap-10`}`}
          method={"POST"}
        >
          <input
            className={`max-w-xl border-b-2 rounded-none border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
          ${
              !validForm.email && email
                ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm"
                : "text-text rounded-none"
            }
          `}
            type="email"
            name="email"
            placeholder={"Email *"}
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement)?.value)}
            onBlur={() =>
              email &&
              setValidForm({
                ...validForm,
                email: verifyEmailIntegrity(email),
              })}
          />
          {type === "default" && (
            <button type={"submit"}>
              <Send color={"white"} />
            </button>
          )}
          {type === "signup" &&
            (
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
                  onChange={(e) =>
                    setPassword((e.target as HTMLInputElement)?.value)}
                  onBlur={() =>
                    password &&
                    setValidForm({
                      ...validForm,
                      password: verifyPasswordIntegrity(password),
                    })}
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
                  onChange={(e) =>
                    setConfirmPassword((e.target as HTMLInputElement)?.value)}
                  onBlur={() =>
                    confirmpassword &&
                    setValidForm({
                      ...validForm,
                      confirmpassword: verifySamePassword(
                        password,
                        confirmpassword,
                      ),
                    })}
                />
                {!Object.values(validForm).every((value) => value) &&
                  (
                    <button
                      class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
                      disabled={true}
                    >
                      Demander des accès
                    </button>
                  )}
                {Object.values(validForm).every((value) => value) &&
                  (
                    <button
                      class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
                      disabled={false}
                      type={"submit"}
                    >
                      Demander des accès
                    </button>
                  )}
              </>
            )}
        </form>
      </div>
      {error && <p>{error}</p>}
    </>
  );
}
