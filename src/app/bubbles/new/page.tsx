export const dynamic = "force-dynamic";

import NewBubbleForm from "@/components/NewBubbleForm";

export default function NewBubblePage() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">새 버블</h1>
      <NewBubbleForm />
    </main>
  );
}