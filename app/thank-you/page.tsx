import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
