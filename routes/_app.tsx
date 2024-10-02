import { FreshContext, type PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { getCachedSettings } from "../stores/settings.ts";

export default async function App(req: Request, ctx: FreshContext) {
  const mainSettings = await getCachedSettings("main") ?? {};

  const website_title = mainSettings.website_title || "Moscoucap";
  const website_description = mainSettings.website_description || "Moscoucap";
  const website_keywords = mainSettings.website_keywords ||
    "moscoucap, moscoucapitale";
  const website_icon = mainSettings.website_icon || "/logo.svg";

  const styleSettings = await getCachedSettings("styles") ?? {};

  return (
    <html class="min-h-screen">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{website_title}</title>
        <meta name="description" content={website_description} />
        <meta name="keywords" content={website_keywords.split(",").join(" ")} />
        <link rel="icon" href={website_icon} />
        <link rel="stylesheet" href="/styles.css" />
        <script src="/loader.js" defer></script>
        
        {/* Its here that we declare our global styles */}
        <style>
          {`
            :root {
              --color-accent-main: ${styleSettings.style_color_main || "#000"};
              --color-accent-secondary: ${styleSettings.style_color_secondary || "#000"};
              --font-main: ${styleSettings.style_font_main || "Segoe UI"};
              --font-secondary: ${styleSettings.style_font_secondary || "Segoe UI"};
            }
          `}
        </style>
      </head>
      <body class="bg-background min-h-screen">
        <ctx.Component />
      </body>
    </html>
  );
}
