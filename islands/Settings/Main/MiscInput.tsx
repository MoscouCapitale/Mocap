export default function MiscInput(props: {
  title: string;
  name: string;
  value: string | number | File | null;
  onUpdate: (data: Record<string, string>) => void;
}) {
  const title = props.title;
  const name = props.name;
  const value = props.value;

  return (
    <div key={parseInt(title) + Math.random()} className={"justify-center items-center gap-10 inline-flex"}>
      <p className={"w-32"}>{title}</p>
      <input
        className={
          "px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
        }
        type={`${typeof value === "string" ? "text" : typeof value === "number" ? "number" : "file"}`}
        value={`${typeof value === "string" || typeof value === "number" ? value : ""}`}
        onInput={(e) => props.onUpdate({ [name]: (e.target as HTMLInputElement).value })}
      />
    </div>
  );
}
