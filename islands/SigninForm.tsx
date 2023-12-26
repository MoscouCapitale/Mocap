import { useState } from "preact/hooks";
import { PageProps } from "$fresh/server.ts";

interface AuthData {
  message?: string;
  error?: string;
}

export default function SignupForm({ data }: PageProps<AuthData>) {
  const { message, error } = data;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [validForm, setValidForm] = useState({
    email: false,
    password: false,
  });

  return (
    <>
      <div class="w-lg max-w-lg mx-auto">
        <form
          class="w-full h-screen flex flex-col justify-center items-center gap-10 p-10"
          method="post"
        >
          <input
            className={`w-full border-b-2 rounded-none border-text bg-background py-1 focus:border-main transition-all duration-200 ease-in-out outline-none
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
          />
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

          <button
            class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
            disabled={false}
            type={"submit"}
          >
            Se connecter
          </button>
        </form>
      </div>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </>
  );
}
