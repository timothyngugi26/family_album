import { Suspense } from "react";
import Link from "next/link";
import EventList from "./event-list";

// A simple loading placeholder (skeleton screen)
function EventListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 bg-white dark:bg-zinc-900 border rounded-xl h-32"></div>
      ))}
    </div>
  );
}

export default function TimelinePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Family Timeline</h1>
          <p className="text-gray-500 mt-1">Every moment we've captured.</p>
        </div>
        <Link
          href="/events/new"
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
        >
          + Add Event
        </Link>
      </div>

      {/* Key point: Wrap the data-reading component with Suspense */}
      <Suspense fallback={<EventListSkeleton />}>
        <EventList />
      </Suspense>
    </div>
  );
}