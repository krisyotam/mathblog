"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { Input } from "@/components/ui/input";
import { Theorem } from "@/components/theorems";

interface TheoremData {
  number: string;
  title: string;
  statement: string;
  description?: string;
  leanProof?: string;
  latexProof?: string;
  status: "active" | "finished";
  category: string;
  tags: string[];
  dateStarted: string;
  dateCompleted?: string;
  reference: string;
  notesSlug: string;
}

export default function TheoremsPage() {
  const [theorems, setTheorems] = useState<TheoremData[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const theoremsResponse = await fetch("/api/theorems");
        if (!theoremsResponse.ok) {
          throw new Error(`HTTP error! status: ${theoremsResponse.status}`);
        }
        const theoremsData = await theoremsResponse.json();
        setTheorems(theoremsData.theorems);

        const cats: Set<string> = new Set(
          theoremsData.theorems.map((t: TheoremData) => t.category)
        );
        setCategories(cats);

        const notesData: { [key: string]: string } = {};
        for (const theorem of theoremsData.theorems) {
          if (theorem.notesSlug) {
            const notesResponse = await fetch(`/api/notes/${theorem.notesSlug}`);
            if (notesResponse.ok) {
              const noteContent = await notesResponse.json();
              notesData[theorem.notesSlug] = noteContent.html;
            }
          }
        }
        setNotes(notesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTheorems = theorems.filter((theorem) => {
    const matchesSearch =
      theorem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theorem.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theorem.number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || theorem.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground">Loading theorems...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">
            @krisyotam
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/" className="hover:text-muted-foreground">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Theorems</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Theorems</h1>

        <div className="space-y-4 mb-8">
          <Input
            placeholder="Search theorems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === null ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            >
              All Categories
            </button>
            {Array.from(categories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="text-center text-destructive mt-8">{error}</p>
        ) : filteredTheorems.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No theorems found matching your criteria.</p>
        ) : (
          <div className="space-y-6">
            {filteredTheorems.map((theorem) => (
              <Theorem key={theorem.number} {...theorem} notes={notes[theorem.notesSlug] || ""} />
            ))}
          </div>
        )}
      </div>
      <CommandMenu />
    </main>
  );
}
