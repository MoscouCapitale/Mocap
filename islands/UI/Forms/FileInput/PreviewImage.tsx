import { IconFileMusic, IconFileText } from "@utils/icons.ts";

type PreviewImageProps = {
  src: string;
  /** Type of the file we want to accept */
  filetype?: "image" | "Images" | "video" | "Videos" | "audio" | "Audios" | "misc" | "Misc";
  /** File name */
  filename?: string;
  variant?: "full-size" | "inline";
};

export default function PreviewImage(
  {
    src,
    filetype,
    filename,
    variant = "full-size",
  }: PreviewImageProps,
) {

  const fileZoneStyle =
    "absolute inset-0 flex flex-col justify-center items-center transition-all ease-in-out duration-300";

  const fileZoneIconProps = {
    title: filename,
    class: "text-text",
    size: variant === "full-size" ? 36 : 22,
  };

  if (filetype === "image" || filetype === "Images") {
    return (
      <img
        src={src}
        class="w-full h-full object-cover"
        title={filename}
      />
    );
  } else if (filetype === "video" || filetype === "Videos") {
    // Return a video completely disabled, to just set it as a preview
    return (
      <video
        src={src}
        class="w-full h-full object-cover"
        controls={false}
        disabled
        title={filename}
      />
    );
  }
  return (
    <div className={variant === "full-size" ? fileZoneStyle : ""}>
      {filetype === "audio" || filetype === "Audios"
        ? <IconFileMusic {...fileZoneIconProps} />
        : <IconFileText {...fileZoneIconProps} />}
      {variant === "full-size" && (
        <p class="text-text text-center p-2 break-all">{filename}</p>
      )}
    </div>
  );
}
