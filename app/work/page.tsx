"use client"

import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { ArrowUpRight, Search } from "lucide-react"
import { useEffect, useState } from "react"

interface Project {
  title: string
  description: string
  link: string
  year: string
  status: string
  category: string
  tags: string[]
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    fetch("/api/work-projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
  }, [])

  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))]

  const filteredProjects = projects.filter(
    (project) =>
      (selectedCategory === "All" || project.category === selectedCategory) &&
      (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
          <span className="text-muted-foreground">Work</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Work</h1>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md bg-background"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {filteredProjects.map((project) => (
            <div key={project.title} className="group border-b border-border pb-8">
              <div className="flex items-start justify-between mb-2">
                <a
                  href={project.link}
                  className="text-lg font-medium hover:text-muted-foreground flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{project.year}</span>
                  <span>•</span>
                  <span>{project.status}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {project.category}
                </span>
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}



