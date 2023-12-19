import { useSignal } from "@preact/signals";

export default function LoginForm() {
  const email = useSignal("");
  const password = useSignal("");

  return (
    <div class="w-lg max-w-lg mx-auto">
      <form class="w-full h-screen flex flex-col justify-center items-center gap-10 p-10">  
        <input
          className={`w-full border-b-2 border-text bg-background py-1 text-text outline-none focus:border-main transition-all duration-200 ease-in-out`}
          type="email"
          name="email"
          placeholder={email.value ? "" : "Email *"}
          value={email.value}
          onChange={(e) => email.value = (e.target as HTMLInputElement)?.value}
        />
        <input
          className={`w-full border-b-2 border-text bg-background py-1 text-text outline-none focus:border-main transition-all duration-200 ease-in-out`}
          type="password"
          name="password"
          placeholder={password.value ? "" : "Password *"}
          value={password.value}
          onChange={(e) =>
            password.value = (e.target as HTMLInputElement)?.value}
        />
        <button
            class="bg-background text-text border-2 rounded-xl border-text w-fit px-10 py-2.5"
            type="submit">Se connecter
        </button>
      </form>
    </div>
  );
}
