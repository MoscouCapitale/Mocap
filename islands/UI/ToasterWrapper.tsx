import { Toaster } from "@components/UI/Toast/Toaster.tsx";
import { toast, ToasterToast } from "@hooks/toast.tsx";
import { useEffect } from "preact/hooks";

type ToasterWrapperProps = {
  content?: Omit<ToasterToast, "id"> & { id?: string };
};

/**
 * Simple wrapper to display a toast inb server side rendered pages.
 *
 * @param {ToasterWrapperProps} { content } The content of the toast
 * @returns {JSX.Element} The Toaster component
 */
export default function ToasterWrapper({ content }: ToasterWrapperProps) {
  useEffect(() => {
    if (content) toast(content);
  }, [content]);

  return <Toaster />;
}
