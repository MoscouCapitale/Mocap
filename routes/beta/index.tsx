import { getCookies, setCookie } from "$std/http/cookie.ts";
import { Input, ToasterWrapper } from "@islands/UI";
import { define, getHashedCode, isBetaEnabled, verifyBetaCode } from "@utils/app.ts";
import { cn } from "@utils/cn.ts";
import Button from "@islands/UI/Button.tsx";

export type FormType = {
  message?: string;
};

const genericMessage = "Le code d'accès à la beta est invalide";

export const handler = define.handlers({
  POST: async (ctx) => {
    const req = ctx.req;
    const form = await req.formData();

    const betaCode = form.get("beta_code")?.toString();

    if (!betaCode) return { data: { message: genericMessage } };

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

    if (!isBetaCodeValid) return { data: { message: genericMessage } };

    return { data: {} };
  },
});

export default define.page<typeof handler>(async (ctx) => {
  const req = ctx.req;
  const betaCodeState = getCookies(req.headers).beta_code;
  if (!isBetaEnabled() || (betaCodeState && (await verifyBetaCode(betaCodeState, true)))) {
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
        <form class={cn("w-10/12 max-w-md flex justify-center items-center gap-5 relative")} method="POST">
          <Input
            field={{
              name: "beta_code",
              type: "string",
              placeholder: "Code d'accès à la beta",
              sx: "w-full border-x-0 border-t-0 border-b-2 rounded-none outline-hidden",
            }}
          />
          <Button type="submit" className={{ button: "whitespace-nowrap" }}>
            Accéder à la beta
          </Button>
        </form>
      </div>
      {message && <ToasterWrapper content={{ id: "1", description: message }} />}
    </>
  );
});
