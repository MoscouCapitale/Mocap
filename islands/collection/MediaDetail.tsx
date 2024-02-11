import { Media } from "@models/Medias.ts";
import { useEffect, useState } from "preact/hooks";
import { IconTrash } from "@utils/icons.ts";
import Button from "@islands/Button.tsx";

interface MediaDetailProps {
  media: Media;
  action: "upload" | "modify";
}

export default function MediaDetail({ media }: MediaDetailProps) {
  const [reactiveMedia, setReactiveMedia] = useState(media);
  const [mediaAttributes, setMediaAttributes] = useState();

  // TODO: make this fetched once and stored in a global state
  useEffect(() => {
    fetch(`/api/medias/attributes`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMediaAttributes(data);
      });
  }, []);

  return (
    <div class="flex gap-8">	
      <div style={{ maxWidth: "200px"}}>
        {/* TODO: image fullscreen on click */}
        <img className={"h-full object-cover"} src={reactiveMedia.public_src} alt={reactiveMedia.alt} />
      </div>
      <div class="w-1/2 flex flex-col gap-5">
        <div class="text-text">
          <div>Nom</div>
          <input
            className={`bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0`}
            type={"text"}
            value={reactiveMedia.name}
            onChange={(e) => setReactiveMedia({ ...reactiveMedia, name: (e.target as HTMLInputElement).value })}
          />
        </div>
        <div class="text-text">
          <div>Lien vers le fichier</div>
          <input
            className={`bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0`}
            type={"text"}
            readonly
            value={reactiveMedia.public_src}
            onChange={(e) => setReactiveMedia({ ...reactiveMedia, public_src: (e.target as HTMLInputElement).value })}
          />
        </div>
        <div class="text-text">
          <div>Description</div>
          <textarea
            className={`bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0`}
            value={reactiveMedia.alt}
            onChange={(e) => setReactiveMedia({ ...reactiveMedia, alt: (e.target as HTMLTextAreaElement).value })}
          />
        </div>
        <div class="text-text flex align-center gap-4">
            <Button text={"Modifier"} onClick={() => console.log(reactiveMedia)} className={{ wrapper: "grow justify-center" }} />
            <IconTrash className={"text-error"} />
        </div>
      </div>
    </div>
  );
}
