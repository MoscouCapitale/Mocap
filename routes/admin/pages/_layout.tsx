import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

export default function Layout({ Component }: PageProps) {
  return (
    <div class="w-full min-h-screen p-10 flex-col justify-start items-start gap-[10px] inline-flex">
        <Partial name="pages-content">
            <Component />
        </Partial>
    </>
  );
}