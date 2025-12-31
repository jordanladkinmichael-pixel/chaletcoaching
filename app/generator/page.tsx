import { Suspense } from "react";
import GeneratorPageContent from "./GeneratorPageContent";

export default function GeneratorPage() {
  return (
    <Suspense fallback={null}>
      <GeneratorPageContent />
    </Suspense>
  );
}
