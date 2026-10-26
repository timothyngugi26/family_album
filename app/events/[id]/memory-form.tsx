"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MemoryForm({ eventId }: { eventId: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("memories").insert({
      event_id: eventId,
      text: text,
      author_id: user?.id,
    });

    if (!error) {
      setText(""); // Clear the input
      router.refresh(); // Refresh the page to show the new memory
    } else {
      alert("Error adding memory: " + error.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border shadow-sm mb-8">
      <label className="block text-sm font-medium mb-2">Add a memory or note</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="I remember when..."
        rows={3}
        className="w-full border rounded-lg px-3 py-2 bg-transparent resize-none mb-3"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Post Note"}
        </button>
      </div>
    </form>
  );
}