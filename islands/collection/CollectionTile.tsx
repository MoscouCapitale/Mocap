import { Media } from "@models/Medias.ts";

export default function CollectionTile({ src, type, alt, metadata }: Media) {
    return (
        <div class="h-[100px] flex bg-text">
            <img className={"h-full object-cover"} src={src} alt={alt} />
        </div>
    );
}