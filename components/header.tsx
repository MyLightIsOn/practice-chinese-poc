import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function Header({
  user,
  dictionaryCount,
  handleLogout,
}: {
  user: SupabaseUser | null;
  dictionaryCount: number | null;
  handleLogout: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      {user ? (
        <Button onClick={handleLogout} variant="default">
          Logout
        </Button>
      ) : (
        <Button asChild variant="default">
          <Link href="/auth/login">Login</Link>
        </Button>
      )}

      <a
        href="/dictionary"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        My Dictionary
        {user && dictionaryCount !== null && (
          <span className="bg-white text-blue-600 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
            {dictionaryCount}
          </span>
        )}
      </a>
    </div>
  );
}

export default Header;
