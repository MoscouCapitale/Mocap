import { FreshContext, Handlers, PageProps, RouteContext } from "$fresh/server.ts";
import { ToasterWrapper, Input } from "@islands/UI";
import { getHashedCode, isBetaEnabled, verifyBetaCode } from "@utils/app.ts";
import Button from "../../islands/UI/Button.tsx";
import { cn } from "@utils/cn.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

export type FormType = {
  message?: string;
};

const genericMessage = "Le code d'accès à la beta est invalide";

export const handler: Handlers<FormType> = {
  async POST(req: Request, ctx: FreshContext) {
    const form = await req.formData();

    const betaCode = form.get("beta_code")?.toString();

    if (!betaCode) return ctx.render({ message: genericMessage });

    const isBetaCodeValid = await verifyBetaCode(betaCode);

    if (isBetaCodeValid) {
      const response = new Response("", {
        status: 303,
        headers: {
          Location: `/`,
        },
      });
      const hashedCode = await getHashedCode(betaCode);
      const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
      setCookie(response.headers, {
        name: "beta_code",
        value: hashedCode,
        path: "/",
        httpOnly: true,
        expires,
      });
      return response;
    }

    if (!isBetaCodeValid) return ctx.render({ message: genericMessage });

    return ctx.render({});
  },
};

export default async function Beta(req: Request, ctx: RouteContext) {
  const betaCodeState = getCookies(req.headers).beta_code;
  if (!isBetaEnabled() || (betaCodeState && await verifyBetaCode(betaCodeState, true))) {
    return new Response("", {
      status: 303,
      headers: {
        Location: `/`,
      },
    });
  }

  const message = ctx.data?.message as string;

  return (
    <>
      <div class="w-full h-screen inline-flex justify-center items-center">
        <form
          class={cn(
            "w-10/12 max-w-md flex justify-center items-center gap-5 relative",
          )}
          method={"POST"}
        >
          <Input
            field={{
              name: "beta_code",
              type: "string",
              placeholder: "Code d'accès à la beta",
              sx: "w-full border-x-0 border-t-0 border-b-2 rounded-none outline-none",
            }}
            onChange={() => {}}
          />
          <Button
            type={"submit"}
            className={{ button: "whitespace-nowrap" }}
          >
            Accéder à la beta
          </Button>
        </form>
      </div>
      {message && <ToasterWrapper content={{ id: "1", description: message }} />}
    </>
  );
}
