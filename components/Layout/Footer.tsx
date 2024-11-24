import { PlatformLink } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { Link } from "@islands/UI";

interface FooterProps {
  platforms: PlatformLink[] | null;
}

export default function Footer({ platforms }: FooterProps) {
  const baseTextStyle = "text-grey font-semibold underline";

  return (
    <footer className={cn("py-3 px-8 flex items-center justify-center relative bg-black w-full", baseTextStyle)}>
      <div className={"flex items-center justify-between w-full max-w-screen-2xl"}>
        <div className="flex flex-col items-start">
          {platforms?.map((platform) => (
            <Link key={platform.id} href={platform.url} target="_blank" rel="noopener noreferrer" variant="footer">
              {platform.name}
            </Link>
          ))}
        </div>
        <div className="absolute inset-0 m-auto w-fit h-fit flex flex-col items-center justify-center gap-1">
          <Link variant="footer" href="/legal-notices" rel="noopener noreferrer">
            Pavel Volkov @ {new Date().getFullYear()}
          </Link>
          <p className={cn(baseTextStyle, "text-xs no-underline text-grey-dark")}>
            v. {Deno.env.get("APP_VERSION")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link variant="footer" href="/admin" rel="noopener noreferrer">
            Admin panel
          </Link>
          <Link variant="footer" href="https://github.com/Nikita-Philippe" target="_blank" rel="noopener noreferrer">
            <img
              src="https://avatars.githubusercontent.com/u/54618484?v=4"
              alt="Nikita Philippe"
              className="rounded-full w-6 h-6"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
