"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KeynoteCard } from "@/components/keynote-card";

interface Talk {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  author: string;
  img: string;
  keynoteLink: string;
  pptLink: string;
  category: string;
  tags: string[];
}

export default function TalksPage() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/keynotes")
      .then((response) => response.json())
      .then((data: Talk[]) => {
        setTalks(data);
        // Extract unique categories
        const cats = new Set<string>(data.map((talk) => talk.category));
        setCategories(cats);
      });
  }, []);

  const filteredTalks = talks.filter((talk) => {
    const matchesSearch =
      talk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talk.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || talk.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
          <span className="text-muted-foreground">Talks</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-normal mb-4">Talks</h1>
          <p className="text-sm text-muted-foreground mb-8">
            A collection of my academic talks and presentations. Each talk includes downloadable slides in both Keynote
            and PowerPoint formats.
          </p>

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder="Search talks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {/* Categories Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
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
        </div>

        {/* Talks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTalks.map((talk) => (
            <KeynoteCard
              key={talk.title}
              img={talk.img}
              title={talk.title}
              subtitle={talk.subtitle}
              description={talk.description}
              keynoteLink={talk.keynoteLink}
              pptLink={talk.pptLink}
              date={talk.date}
              author={talk.author}
            />
          ))}
        </div>

        {filteredTalks.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No talks found matching your criteria.</p>
        )}
      </div>

      <CommandMenu />
    </main>
  );
}
