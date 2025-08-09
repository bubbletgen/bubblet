export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabase";
import Modal from "@/components/Modal";
import ModalClose from "@/components/ModalClose";

type Params = Promise<{ id: string }>;

export default async function BubbleDetailModal({ params }: { params: Params }) {
  const { id } = await params;

  const supabase = supabaseServer();
  const { data } = await supabase
    .from("bubbles")
    .select("id, title, content, emoji, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  return (
    <Modal>
      <div className="rounded-2xl overflow-hidden bg-zinc-900 text-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-white/60">
          <span>Bubble</span>
          <ModalClose />
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2">
            <span className="text-2xl">{data.emoji}</span>
            <span>{data.title}</span>
          </div>
          <div className="whitespace-pre-wrap leading-7">{data.content}</div>
        </div>
      </div>
    </Modal>
  );
}