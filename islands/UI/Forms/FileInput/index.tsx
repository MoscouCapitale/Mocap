import PreviewImage from "@islands/UI/Forms/FileInput/PreviewImage.tsx";
import { effect } from "@preact/signals-core";
import { cn } from "@utils/cn.ts";
import {
  convertAcceptFileTypeMapToInputAccept,
  getMediaTypeFromFiletype,
} from "@utils/database.ts";
import { IconCloudUpload, IconPlus, IconX } from "@utils/icons.ts";
import { VNode } from "preact";
import { useMemo, useRef, useState } from "preact/hooks";

type FileInputProps = {
  handleFileChange?: (file: File | null) => void;
  /** If specified, on click on the file zone, the default behaviour (file input) will be prevented and overwriteOnFileZoneClick called */
  overwriteOnFileZoneClick?: (e: Event) => void;
  /** If specified, on click on the icon to delete the file, the default behaviour will be prevented and overwriteOnFileDeleteClick called */
  overwriteOnFileDeleteClick?: (e: Event) => void;
  /** Type of the file we want to accept */
  filetype?: "Images" | "Videos" | "Audios" | "Misc";
  /** Full string query of file types that are accepted */
  accept?: string;
  /** The file zone styling variant. Default is `full-size`
   *
   * - `full-size`: The file zone wiil be a square, with the uploaded file inside it
   * - `inline`: The file zone will be a little button, with the uploaded file beside it
   */
  variant?: "full-size" | "inline";
  /** The "preview" element used */
  bgElement?: VNode;
  label?: VNode | string;
  /** If you use overwriteOnFileZoneClick but want to keep some default behaviour, customFile is used to set the file state */
  customFile?: File;
};

// TODO: better separate the file, be creating a base component, then two component for both variants

export default function FileInput(
  {
    handleFileChange,
    overwriteOnFileZoneClick,
    overwriteOnFileDeleteClick,
    filetype,
    accept,
    variant = "full-size",
    bgElement,
    label,
    customFile,
  }: FileInputProps,
) {
  const acceptedFileTypes = useMemo(
    () =>
      accept ?? getMediaTypeFromFiletype(filetype ?? "") ??
        convertAcceptFileTypeMapToInputAccept(),
    [filetype, accept],
  );

  const fileInputRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);

  effect(() => customFile && setFile(customFile));

  const handleSetRawFile = (e: Event) => {
    if (e.target && e.target instanceof HTMLInputElement && e.target.files) {
      setFile(e.target.files[0]);
      if (handleFileChange) handleFileChange(e.target.files[0]);
    }
  };

  const fileZoneStyle =
    "absolute inset-0 flex flex-col justify-center items-center transition-all ease-in-out duration-300";
  const fileZoneIconProps = {
    class: "text-text",
    size: 36,
  };

  const RenderedFileZone = useMemo(() => {
    if (bgElement) return bgElement;
    if (file) {
      return (
        <PreviewImage
          src={URL.createObjectURL(file)}
          filetype={file.type.split("/")[0] as "image" | "video" | "audio"}
          filename={file.name}
          variant={variant}
        />
      );
    }
    return variant === "full-size"
      ? (
        <>
          <div class="absolute break-all w-[238px] text-text text-opacity-10 text-[127px] z-0 leading-[110px]">
            media
          </div>
          <div
            className={cn(
              "translate-y-0 group-hover/filezone:-translate-y-full",
              fileZoneStyle,
            )}
          >
            <IconPlus {...fileZoneIconProps} />
          </div>
          <div
            className={cn(
              "translate-y-full group-hover/filezone:translate-y-0",
              fileZoneStyle,
            )}
          >
            <IconCloudUpload {...fileZoneIconProps} />
            <p class="text-text text-center p-2">
              {label ?? "Click to upload or drag a file here"}
            </p>
          </div>
        </>
      )
      : <></>;
  }, [bgElement, file]);

  return variant === "full-size"
    ? (
      <div
        ref={fileInputRef}
        className="w-[200px] h-[200px] relative group/filezone"
      >
        <input
          className="opacity-0 cursor-pointer absolute left-0 w-full top-0 bottom-0 z-10"
          type="file"
          accept={acceptedFileTypes}
          onClick={(e: Event) => {
            if (overwriteOnFileZoneClick) {
              e.preventDefault();
              e.stopPropagation();
              overwriteOnFileZoneClick(e);
            }
          }}
          onChange={handleSetRawFile}
        />
        <div
          class="w-full h-full rounded-lg border border-text_grey justify-center items-center gap-2.5 inline-flex z-0 relative overflow-hidden"
          title={file?.name}
        >
          {RenderedFileZone}
        </div>
        {file && (
          <div // Div wrapper, to make the hover zone a lot bigger, improving ux
            class="absolute top-0 right-0 z-10 w-12 h-12 cursor-pointer group/delFile"
            onClick={(e) => {
              if (overwriteOnFileDeleteClick) overwriteOnFileDeleteClick(e);
              else {
                if (handleFileChange) handleFileChange(null);
                setFile(null);
              }
            }}
          >
            <div
              class={cn(
                "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 p-1 bg-background rounded-full",
                "scale-0 invisible transition-all ease-in-out group-hover/delFile:scale-100 group-hover/delFile:visible",
              )}
            >
              <IconX className={"text-text_special"} size={26} />
            </div>
          </div>
        )}
      </div>
    )
    : (
      <div
        ref={fileInputRef}
        className="h-6 flex justify-start items-stretch gap-7"
      >
        <div
          className={"relative rounded-[3px] justify-start items-center gap-2.5 inline-flex cursor-pointer px-[5px] py-[3px] bg-main"}
        >
          <input
            className="opacity-0 cursor-pointer absolute left-0 w-full top-0 bottom-0 z-10"
            type="file"
            accept={acceptedFileTypes}
            onClick={(e: Event) => {
              if (overwriteOnFileZoneClick) {
                e.preventDefault();
                e.stopPropagation();
                overwriteOnFileZoneClick(e);
              }
            }}
            onChange={handleSetRawFile}
          />
          <p className={"text-text font-normal"}>{label ?? "Upload a file"}</p>
        </div>

        <div class="w-6 h-6 justify-center items-center gap-2.5 inline-flex relative group/file">
          <div
            class={"z-20 w-full h-full rounded-[3px] bg-background overflow-hidden"}
            title={file?.name}
          >
            {RenderedFileZone}
          </div>
          {file && (
            <div
              class={cn(
                "absolute top-0 bottom-0 left-full flex items-center p-1 z-10 cursor-pointer",
                "invisible transition-all ease-in-out -translate-x-full group-hover/file:translate-x-0 group-hover/file:visible",
              )}
              onClick={(e) =>
                overwriteOnFileDeleteClick
                  ? overwriteOnFileDeleteClick(e)
                  : setFile(null)}
            >
              <IconX className={"text-text_special"} size={24} />
            </div>
          )}
        </div>
      </div>
    );
}
