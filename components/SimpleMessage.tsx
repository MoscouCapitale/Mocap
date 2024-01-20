type SimpleMessageProps = {
  message?: string;
  error?: string;
  link?: any; 
};

export default function SimpleMessage({ message, error, link }: SimpleMessageProps) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        {message && (
          <div className="bg-background border border-main rounded-md p-4">
            <p className="text-text">{message}</p>
          </div>
        )}
        {error && (
          <div className="bg-background border border-error rounded-md p-4">
            <p className="text-error">{error}</p>
          </div>
        )}
        {link && (
          <a className="w-fit px-4 py-3 bg-main rounded justify-start items-center gap-2.5 inline-flex text-text text-lg" href={link.href}>
            {link.text}
          </a>
        )}
      </div>
    </div>
  );
}
