export default function APIInput(props: {title: string, value: string | null}) {
  const title = props.title;
  const value = props.value;

  return (
    <div className={"justify-center items-center gap-10 inline-flex"}>
      <p className={"w-32"}>{title}</p>
      <input
        className={"w-80 px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"}
        type={"text"}
        value={value ?? ""}
      ></input>
      <div>
        <button>Test</button>
        {/* TODO: check if api is valid */}
      </div>
    </div>
  );
}
