import { type PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

export default function App({ Component }: PageProps) {
  return (
    <html class="min-h-screen">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>moscoucap_back</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/loader.js" defer></script>
      </head>
      <body class="bg-background min-h-screen">
        <Component />
      </body>
    </html>
  );
}
