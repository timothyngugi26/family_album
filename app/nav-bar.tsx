"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const links = [
    { name: "Timeline", href: "/" },
    { name: "Family Members", href: "/members" },
  ];

  return (
    <nav className="border-b bg-white dark:bg-black px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Our Family Album
        </Link>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === link.href ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}