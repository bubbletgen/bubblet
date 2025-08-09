export const dynamic = "force-dynamic";

import Modal from "@/components/Modal";
import ModalClose from "@/components/ModalClose";
import NewBubbleForm from "@/components/NewBubbleForm";

export default function NewBubbleModal() {
  return (
    <Modal>
      <div className="rounded-2xl overflow-hidden bg-zinc-900 text-white shadow-2xl border border-white/10">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-white/60 border-b border-white/10">
          <span>새 버블</span>
          <ModalClose />
        </div>
        <div className="px-4 pb-4 pt-4">
          <NewBubbleForm />
        </div>
      </div>
    </Modal>
  );
}