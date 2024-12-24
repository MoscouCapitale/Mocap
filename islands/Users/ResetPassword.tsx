import { IconLoader, IconSend } from "@utils/icons.ts";
import { verifyEmailIntegrity, verifyPasswordIntegrity } from "@utils/login.ts";
import { useEffect, useState } from "preact/hooks";

import { Input } from "@islands/UI";
import { cn } from "@utils/cn.ts";

const customInputsStyle = "w-full border-x-0 border-t-0 border-b-2 rounded-none outline-none";

export default function ResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof globalThis !== "undefined") {
      const fragment = globalThis.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const token = params.get("access_token");
      setAccessToken(token);
    }
  }, []);

  return (
    <div class="w-full h-screen inline-flex justify-center items-center">
      <form
        class={cn(
          "w-10/12 max-w-xs flex justify-center items-center flex-col gap-10 relative",
        )}
        method={"POST"}
        onSubmit={() => setIsLoading(true)}
      >
        {accessToken && <input type="hidden" name="access_token" value={accessToken} />}
        <Input
          field={{
            name: "email",
            type: "email",
            placeholder: "Email *",
            required: true,
            validation: verifyEmailIntegrity,
            sx: customInputsStyle,
          }}
          onChange={setEmail}
        />
        {email && (
          <button className={`absolute left-[calc(100%+1rem)] ${isLoading && "animate-spin"}`} type={"submit"}>
            {isLoading ? <IconLoader color={"white"} /> : <IconSend color={"white"} />}
          </button>
        )}
        {accessToken && (
          <div className="absolute top-[calc(100%+2.5rem)] left-0 right-0 w-full bg-back">
            <Input
              field={{
                name: "password",
                type: "password",
                placeholder: "Password *",
                required: true,
                validation: verifyPasswordIntegrity,
                sx: customInputsStyle,
              }}
              onChange={setPassword}
            />
          </div>
        )}
      </form>
    </div>
  );
}
