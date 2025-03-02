"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TestCard } from "@/components/test-card"
import { ProblemSetCard } from "@/components/problem-set-card"
import { CommandMenu } from "@/components/command-menu"

interface Test {
  id: number
  img: string
  title: string
  subject: string
  description: string
  duration: string
  questionCount: number
  previewLink: string
  startLink: string
  date: string
  author: string
  category: string
  tags: string[]
}

interface ProblemSet {
  id: number
  img: string
  title: string
  subject: string
  description: string
  difficulty: string
  problemCount: number
  pdfUrl: string
  date: string
  author: string
  category: string
  tags: string[]
  status: "open" | "solved"
}

type ResourceType = "problemSets" | "tests"

export default function AcademicResourcesPage() {
  const [resourceType, setResourceType] = useState<ResourceType>("problemSets")
  const [resources, setResources] = useState<ProblemSet[] | Test[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/${resourceType}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResources(data)

        // Extract unique categories
        const cats = new Set(data.map((resource: ProblemSet | Test) => resource.category)) as Set<string>
        setCategories(cats)
      } catch (err) {
        console.error(`Error fetching ${resourceType}:`, err)
        setError(err instanceof Error ? err.message : `An error occurred while fetching ${resourceType}.`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [resourceType])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ("difficulty" in resource ? resource.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || resource.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading Problem Sets...</p>
        </div>
      </main>
    )
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
          <span className="text-muted-foreground">Problem Sets</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-normal mb-4">Problem Sets</h1>
          <p className="text-sm text-muted-foreground mb-8">
            This page, created by me as a pure mathematics student, offers a collection of problem sets and tests
            designed to help you study and practice in a more comprehensive way. It goes beyond traditional tests by
            exploring multiple solving methods and includes problems from advanced fields, some of which are open
            unsolved problems marked with <strong>open</strong>, while others marked with <strong>solved</strong> come
            with detailed solutions to aid your learning.
          </p>

          {/* Resource Type Selector */}
          <div className="flex gap-4 mb-4">
            <Button
              onClick={() => {
                setResourceType("problemSets")
                setSelectedCategory(null)
              }}
              variant={resourceType === "problemSets" ? "default" : "outline"}
            >
              Problem Sets
            </Button>
            <Button
              onClick={() => {
                setResourceType("tests")
                setSelectedCategory(null)
              }}
              variant={resourceType === "tests" ? "default" : "outline"}
            >
              Tests
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder={`Search ${resourceType === "problemSets" ? "problem sets" : "tests"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {/* Categories Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
              >
                All Categories
              </button>
              {Array.from(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-2 text-sm rounded-md transition-colors ${selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <p className="text-center text-destructive mt-8">{error}</p>
        ) : filteredResources.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No resources found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource) =>
              resourceType === "problemSets" ? (
                <ProblemSetCard
                  key={resource.id}
                  img={resource.img}
                  title={resource.title}
                  subject={resource.subject}
                  description={resource.description}
                  difficulty={(resource as ProblemSet).difficulty}
                  problemCount={(resource as ProblemSet).problemCount}
                  pdfUrl={(resource as ProblemSet).pdfUrl}
                  date={resource.date}
                  author={resource.author}
                  status={(resource as ProblemSet).status}
                />
              ) : (
                <TestCard
                  key={resource.id}
                  img={resource.img}
                  title={resource.title}
                  subject={resource.subject}
                  description={resource.description}
                  duration={(resource as Test).duration}
                  questionCount={(resource as Test).questionCount}
                  previewLink={(resource as Test).previewLink}
                  startLink={(resource as Test).startLink}
                  date={resource.date}
                  author={resource.author}
                />
              ),
            )}
          </div>
        )}
      </div>
      <CommandMenu />
    </main>
  )
}


