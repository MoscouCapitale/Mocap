import { define } from "@utils/app.ts";

export const handler = define.handlers({
  GET(_ctx) {
    return new Response("", {
      status: 303,
      headers: {
        Location: "/admin/pages",
      },
    });
  },
});

export default function Home() {
  return;
}
