import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MemoryForm from "./memory-form";
import PhotoUpload from "./photo-upload";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    notFound();
  }

  const { data: memories } = await supabase
    .from("memories")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Timeline
        </Link>
        <h1 className="text-4xl font-bold">{event.title}</h1>
        <p className="text-lg text-gray-500 mt-2">
          {new Date(event.event_date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {event.location && ` · ${event.location}`}
        </p>
        {event.description && (
          <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {event.description}
          </p>
        )}
      </div>

      <hr className="my-8 border-gray-200 dark:border-zinc-800" />

      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold">Photos</h2>
        <PhotoUpload eventId={event.id} />

        {!photos || photos.length === 0 ? (
          <p className="text-gray-500 italic">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="aspect-square relative rounded-xl overflow-hidden border bg-gray-100 dark:bg-zinc-800">
                <Image
                  src={photo.url}
                  alt="Event photo"
                  fill
                  unoptimized
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="my-8 border-gray-200 dark:border-zinc-800" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Memories & Notes</h2>
        <MemoryForm eventId={event.id} />

        {!memories || memories.length === 0 ? (
          <p className="text-gray-500 italic">No notes added yet. Be the first to share a memory.</p>
        ) : (
          <div className="space-y-4">
            {memories.map((memory) => (
              <div key={memory.id} className="p-5 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap italic">
                  "{memory.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}