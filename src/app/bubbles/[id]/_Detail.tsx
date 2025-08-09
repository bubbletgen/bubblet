type Bubble = {
  id: string;
  title: string;
  content: string;
  emoji: string | null;
  created_at: string;
};

export default function Detail({ data }: { data: Bubble }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.emoji ?? "💬"}</span>
        <h1 className="text-xl font-semibold">{data.title}</h1>
      </div>

      <article className="whitespace-pre-wrap leading-7 text-white/90 bg-neutral-950 rounded-xl p-4">
        {data.content}
      </article>

      <div className="text-xs text-white/50">
        작성일: {new Date(data.created_at).toLocaleString()}
      </div>
    </div>
  );
}