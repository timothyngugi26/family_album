"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PhotoUpload({ eventId }: { eventId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`Uploading ${i + 1} of ${files.length}...`);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${eventId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        await supabase.from("photos").insert({
          event_id: eventId,
          url: publicUrl,
        });
      }
    }

    setProgress("");
    setFiles([]);
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleUpload} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border shadow-sm mb-8">
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
            setFiles(selectedFiles);
          }}
          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-white"
        />
        
        <button
          type="submit"
          disabled={files.length === 0 || loading}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 ml-auto whitespace-nowrap"
        >
          {loading ? progress : `Upload ${files.length > 0 ? files.length : ''} Photo${files.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  );
}