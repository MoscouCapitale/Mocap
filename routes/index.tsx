import Footer from "@components/Layout/Footer.tsx";
import { getFooterLinks, isBetaEnabled, verifyBetaCode } from "@utils/app.ts";
import Cursor from "@islands/UI/Cursor.tsx";
import { fetchNode } from "@services/nodes.ts";
import BrickLayout from "@islands/Bricks/BrickLayout.tsx";
import AdminPanelButton from "@components/Misc/AdminPanelButton.tsx";
import { RouteContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export default async function Home(req: Request, ctx: RouteContext) {
  // For the beta, check if the user has a beta code
  const betaCode = getCookies(req.headers).beta_code;
  if (isBetaEnabled() && (!betaCode || betaCode && !await verifyBetaCode(betaCode, true))) {
    return new Response("", {
      status: 303,
      headers: {
        Location: `/beta`,
      },
    });
  }

  const platforms = await getFooterLinks();
  const { data, error } = await fetchNode();

  return (
    <>
      <link rel="stylesheet" href="/cardsglow.css" />
      {/* <Cursor /> */}
      <AdminPanelButton />
      <main className={"min-h-screen w-full flex flex-col items-center justify-start"}>
        <img
          src="/assets/gradients/001.webp"
          loading={"lazy"}
          className={"fixed inset-0 w-full h-full object-cover -z-10 brightness-[0.3] pointer-events-none"}
        />
        <BrickLayout nodes={data ?? []} />
      </main>
      <Footer platforms={platforms} />
    </>
  );
}
