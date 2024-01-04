type AlertProps = {
  message: string;
  error?: boolean;
};

export default function Alert({ message, error = false }: AlertProps) {
  //TODO: animate this
  return (
    <div className={`absolute bottom-10 inset-x-0 w-full flex align-center h-fit justify-center`}>
      <div className={`mx-auto max-w-xs bg-background text-text border-2 rounded-xl ${error ? "border-error" : "border-text"} w-fit px-5 py-2.5`}>
        <p>{message}</p>
      </div>
    </div>
  );
}
