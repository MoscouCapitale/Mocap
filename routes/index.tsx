import Footer from "@components/Layout/Footer.tsx";
import { getFooterLinks } from "@utils/app.ts";
import Cursor from "@islands/UI/Cursor.tsx";

export default async function Home() {
  const platforms = await getFooterLinks();

  return (
    <div>
      <link rel="stylesheet" href="/main.css" />
      <Cursor />
      <main className={"min-h-screen"}>
        <textarea height={1000}></textarea>
      </main>
      <Footer platforms={platforms} />
    </div>
  );
}
