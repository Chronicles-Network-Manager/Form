import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouClient />
    </Suspense>
  );
}
