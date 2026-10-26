"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("memory");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("events").insert({
      title,
      event_date: date,
      location: location || null,
      description: description || null,
      type,
      created_by: user?.id,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          &larr; Back to Timeline
        </Link>
        <h1 className="text-3xl font-bold">Add a New Memory</h1>
        <p className="text-gray-500 mt-1">Capture a moment, trip, or milestone.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Summer Trip to the Lake"
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-transparent dark:[color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-transparent"
            >
              <option value="memory">General Memory</option>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="holiday">Holiday</option>
              <option value="trip">Trip</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Lake Tahoe, CA"
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What happened? Who was there? What do you want to remember?"
            className="w-full border rounded-lg px-3 py-2 bg-transparent resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : "Save Event"}
        </button>
      </form>
    </div>
  );
}