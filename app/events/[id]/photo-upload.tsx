"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PhotoUpload({ eventId }: { eventId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    // 1. Upload image to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${eventId}/${fileName}`; // Put it in a folder named after the event

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading photo: " + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    // 3. Save the record to the database
    const { error: dbError } = await supabase.from("photos").insert({
      event_id: eventId,
      url: publicUrl,
    });

    if (dbError) {
      alert("Error saving photo record: " + dbError.message);
    } else {
      setFile(null); // Clear input
      router.refresh(); // Refresh to show the new photo
    }
    
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border shadow-sm mb-8 flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-white"
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 ml-auto whitespace-nowrap"
      >
        {loading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}