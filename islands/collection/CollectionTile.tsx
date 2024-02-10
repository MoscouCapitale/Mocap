
interface MediaInfos {
    src: string,
    type: string, // TODO: really typed
    alt: string,
    metadata?: null
}

export default function CollectionTile({ src, type, alt, metadata }: MediaInfos) {
    return (
        <div class="h-[100px] flex bg-text">
            {src} {type} {alt} {metadata}
        </div>
    );
}