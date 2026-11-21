"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p>Couldn't load the data.</p>

      <button onClick={() => reset()}>
        Try Again
      </button>
    </div>
  );
}