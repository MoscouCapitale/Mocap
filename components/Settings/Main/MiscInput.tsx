import { useSignal } from "@preact/signals";

export default function APIInput(props: { title: string; value: string | number | File | null; changing?: () => void }) {
  const title = props.title;
  let value = useSignal(props.value);

  return (
    <div key={parseInt(title) + Math.random()} className={"justify-center items-center gap-10 inline-flex"}>
      <p className={"w-32"}>{title}</p>
      <input
        className={
          "px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
        }
        type={`${typeof value === "string" ? "text" : typeof value === "number" ? "number" : "file"}`}
        value={`${typeof value === "string" || typeof value === "number" ? value : ""}`}
        onInput={(e) => {
          if (typeof value === "string") value.value = e.currentTarget.value;
          else if (typeof value === "number") value.value = parseInt(e.currentTarget.value);
          else if (typeof value === "object") value.value = e.currentTarget.files?.[0] || null;

          if (props.changing) props.changing();
        }
        }
      ></input>
    </div>
  );
}
