import { useSignal } from "@preact/signals";
import { PageProps } from "$fresh/server.ts";
import Input from "@components/Forms/Input.tsx";
import { InputError } from "@models/Form.ts";

export default function SignupForm(data?: PageProps<InputError>) {
  const error = useSignal(data?.data as InputError);
  const email = useSignal("");
  const password = useSignal("");
  const confirmpassword = useSignal("");

  return (
    <div class="w-lg max-w-lg mx-auto">
      <form
        class="w-full h-screen flex flex-col justify-center items-center gap-10 p-10"
        method="post"
      >
        <Input
          formType="auth"
          type="email"
          name="email"
          placeholder={email.value ? "" : "Email *"}
          value={email.value}
          onChange={(e) => email.value = (e.target as HTMLInputElement)?.value}
          error={error?.value.field === "email" ? error.value : undefined}
        />
        <Input
          formType="auth"
          type="password"
          name="password"
          placeholder={password.value ? "" : "Password *"}
          value={password.value}
          onChange={(e) => {
            password.value = (e.target as HTMLInputElement)?.value;
          }}
          error={error?.value.field === "password" ? error.value : undefined}
        />
        <Input
          formType="auth"
          type="password"
          name="confirmpassword"
          placeholder={confirmpassword.value ? "" : "Confirm password *"}
          value={confirmpassword.value}
          onChange={(e) => {
            confirmpassword.value = (e.target as HTMLInputElement)?.value;
          }}
          error={error?.value.field === "password" ? error.value : undefined}
        />
        <button
          class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
          type={"submit"}
        >
          Demander des accès
        </button>
      </form>
    </div>
  );
}
