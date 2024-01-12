type APIInputProps = {
  title: string;
  name: string;
  value: string | null;
  onUpdate: (data: Record<string, string>) => void;
};

export default function APIInput(props: APIInputProps) {
  const title = props.title;
  const name = props.name;
  const value = props.value;

  return (
    <div className={"justify-center items-center gap-10 inline-flex"}>
      <p className={"w-32"}>{title}</p>
      <input
        className={"w-80 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"}
        type={"text"}
        value={value ?? ''}
        onInput={(e) => props.onUpdate({ [name]: (e.target as HTMLInputElement).value })}
      ></input>
      <div>
        <button>Test</button>
        {/* TODO: check if api is valid */}
      </div>
    </div>
  );
}
