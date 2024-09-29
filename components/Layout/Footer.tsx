import { PlateformLink } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";

interface FooterProps {
  platforms: PlateformLink[] | null;
}

export default function Footer({ platforms }: FooterProps) {
  const baseTextStyle = "text-grey font-semibold underline";

  return (
    <footer className={cn("py-3 px-8 flex items-center justify-between relative bg-black w-full", baseTextStyle)}>
      <div className="flex flex-col items-start">
        {platforms?.map((platform) => (
          <a key={platform.id} href={platform.url} target="_blank" rel="noopener noreferrer">
            {platform.name}
          </a>
        ))}
      </div>
      <div className="absolute inset-0 m-auto w-fit h-fit flex items-center justify-center">
        <a href="/legal-notices" target="_blank" className={baseTextStyle}>
          Pavel Volkov @ {new Date().getFullYear()}
        </a>
      </div>
      <div className="absolute inset-x-0 bottom-3 m-auto flex items-center justify-center">
        <p className={cn(baseTextStyle, "text-xs no-underline text-grey-dark")}>
          v. 0.0.0
        </p>
      </div>
      <div>
        <a className={baseTextStyle} href="/admin" rel="noopener noreferrer">
          Admin panel
        </a>
      </div>
    </footer>
  );
}