import Footer from "@components/Layout/Footer.tsx";
import { getFooterLinks } from "@utils/app.ts";
import Cursor from "@islands/UI/Cursor.tsx";
import { fetchNode } from "@services/nodes.ts";
import BrickLayout from "@islands/Bricks/BrickLayout.tsx";

export default async function Home() {
  const platforms = await getFooterLinks();
  const { data, error } = await fetchNode(undefined, true);

  console.log(data?.length);

  return (
    <>
      <link rel="stylesheet" href="/main.css" />
      {/* <Cursor /> */}
      <main className={"min-h-screen w-full flex flex-col justify-center items-start"}>
        <BrickLayout nodes={data ?? []} />
      </main>
      <Footer platforms={platforms} />
    </>
  );
}
