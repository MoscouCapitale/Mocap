import { Misc } from "@models/Medias.ts";
import { getCachedSettings } from "../stores/settings.ts";

export default async function LegalNotices() {
  const { terms_file } = (await getCachedSettings("misc")) ?? {};
  const { name, public_src, extension } = terms_file as unknown as Misc;

  return (
    <div className={"text-text"}>
      {extension?.includes("pdf") ? (
        <embed src={public_src} type="application/pdf" width="100%" height="1200px" />
      ) : (
        <p>
          Télécharger les mentions légales -
          <a href={public_src} target="_blank" rel="noreferrer">
            {name}
          </a>
        </p>
      )}
    </div>
  );
}
