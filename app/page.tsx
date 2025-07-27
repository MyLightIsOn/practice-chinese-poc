"use client";

import { useState, useEffect } from "react";
import { KeyboardEvent } from "react";
import { LookupResponse } from "@/types/LookupResponse";
import { Search } from "@/components/search";
import { SearchResults } from "@/components/search-results";
import { createClient } from "@/lib/supabase/client";
import { useDictionary } from "@/lib/context/DictionaryContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<LookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const { count: dictionaryCount } = useDictionary();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);

      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
        },
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    checkUser();
  }, []);

  const handleSearch = async (page: number = 1): Promise<void> => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setError("");
    setCurrentPage(page);

    try {
      const response = await fetch(
        `/api/lookup?text=${encodeURIComponent(searchText)}&page=${page}&page_size=${20}`,
      );

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      // Reset to page 1 when performing a new search with Enter Key
      handleSearch(1).then((r) => console.log(r));
    }
  };

  const toggleEntrySelection = (entryId: number): void => {
    setSelectedEntries((prevSelected) => {
      // Special case: -1 is used as a signal to clear all selections
      if (entryId === -1) {
        return [];
      }

      if (prevSelected.includes(entryId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== entryId);
      } else {
        // If not selected, add it
        return [...prevSelected, entryId];
      }
    });
  };

  const handleLogout = async (): Promise<void> => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full flex flex-col gap-8">
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
        <Search
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
          isLoading={isLoading}
          handleKeyDown={handleKeyDown}
        />

        <SearchResults
          results={results}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          handleSearch={handleSearch}
          selectedEntries={selectedEntries}
          toggleEntrySelection={toggleEntrySelection}
        />
      </div>
    </main>
  );
}
