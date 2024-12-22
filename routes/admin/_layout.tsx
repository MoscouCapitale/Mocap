import { PageProps } from "$fresh/server.ts";
import Navbar from "@islands/Layout/Navbar.tsx";

export default function Layout({ Component, state, route }: PageProps) {
  return (
    <div class="flex h-screen">
      <Navbar path={route} />
      <div class="w-full min-h-full p-10 flex-col justify-start items-start inline-flex overflow-auto">
        <Component />
      </div>
    </div>
  );
}
