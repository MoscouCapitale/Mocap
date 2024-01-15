import { PageProps } from "$fresh/server.ts";
import Navbar from "@islands/Layout/Navbar.tsx";

export default function Layout({ Component, state, route }: PageProps) {
  return (
    <div class="w-full justify-start items-start inline-flex">
        <Navbar path={route} />
        <Component />
    </div>
  );
}