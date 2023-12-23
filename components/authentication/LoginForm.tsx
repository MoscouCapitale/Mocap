import { useSignal } from "@preact/signals";
import Input from "@components/Forms/Input.tsx";

type Props = {
  submitLoginInfo: (email: string, password: string) => void;
};

export default function LoginForm({ submitLoginInfo }: Props) {
  const email = useSignal("");
  const password = useSignal("");

  return (
    <div class="w-lg max-w-lg mx-auto">
      <form class="w-full h-screen flex flex-col justify-center items-center gap-10 p-10">
        <Input
          formType="auth"
          type="email"
          name="email"
          placeholder={email.value ? "" : "Email *"}
          value={email.value}
          onChange={(e) => email.value = (e.target as HTMLInputElement)?.value}
        />
        <Input
          formType="auth"
          type="password"
          name="password"
          placeholder={password.value ? "" : "Password *"}
          value={password.value}
          onChange={(e) =>
            password.value = (e.target as HTMLInputElement)?.value}
        />

        <button
          class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
          onClick={() => {
            submitLoginInfo(email.value, password.value);
          }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
