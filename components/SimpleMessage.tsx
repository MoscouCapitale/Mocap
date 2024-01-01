type SimpleMessageProps = {
  message?: string;
  error?: string;
};

export default function SimpleMessage({ message, error }: SimpleMessageProps) {
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
      </div>
    </div>
  );
}
