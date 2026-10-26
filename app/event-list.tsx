import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function EventList() {
  const supabase = await createClient();

  // The database query is moved into this component
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl bg-white dark:bg-zinc-900">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No events yet</h3>
        <p className="text-gray-500 mt-1 mb-4">Start by adding your first family memory.</p>
        <Link
          href="/events/new"
          className="text-blue-600 font-medium hover:underline"
        >
          Create an event
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="block p-6 bg-white dark:bg-zinc-900 border rounded-xl hover:border-blue-400 transition-colors shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(event.event_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {event.location && ` · ${event.location}`}
              </p>
            </div>
          </div>
          {event.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
              {event.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}