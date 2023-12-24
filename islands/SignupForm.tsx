import { useEffect, useState } from "preact/hooks";
import {
  verifyEmailIntegrity,
  verifyPasswordIntegrity,
  verifySamePassword,
} from "@utils/login.ts";

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
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
    <div class="w-lg max-w-lg mx-auto">
      <form
        class="w-full h-screen flex flex-col justify-center items-center gap-10 p-10"
        method="post"
      >
        <input
          className={`w-full border-b-2 rounded-none border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
          ${
            !validForm.email && email
              ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm" : "text-text rounded-none"}
          `}
          type="email"
          name="email"
          placeholder={"Email *"}
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement)?.value)}
          onBlur={() =>
            email &&
            setValidForm({ ...validForm, email: verifyEmailIntegrity(email) })}
        />
        <input
          className={`w-full border-b-2 rounded-none border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
            ${
            !validForm.password && password
              ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm" : "text-text rounded-none" }
          `}
          type="password"
          name="password"
          placeholder={"Password *"}
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement)?.value)}
          onBlur={() =>
            password &&
            setValidForm({
              ...validForm,
              password: verifyPasswordIntegrity(password),
            })}
        />
        <input
          className={`w-full border-b-2 border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
          ${ !validForm.confirmpassword && confirmpassword ? "ring-1 ring-error ring-offset-4 ring-offset-background text-error rounded-sm" : "text-text rounded-none" }
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
              confirmpassword: verifySamePassword(password, confirmpassword),
            })}
        />
        {!Object.values(validForm).every(value => value) &&
          (
            <button
              class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
              disabled={true}
            >
              Demander des accès
            </button>
          )}
        {Object.values(validForm).every(value => value) &&
          (
            <button
              class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
              disabled={false}
              type={"submit"}
            >
              Demander des accès
            </button>
          )}
      </form>
    </div>
  );
}
