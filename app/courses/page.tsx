"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CourseCard } from "@/components/course-card" // ✅ Fixed import

interface Course {
  title: string
  subtitle: string
  description: string
  date: string
  author: string
  img: string
  latexLink: string
  pdfLink: string
  category: string
  tags: string[] // Tags are still part of the filtering but not displayed
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Set<string>>(new Set<string>()) // ✅ Explicitly type Set<string>

  useEffect(() => {
    fetch("/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data)

        // Extract unique categories
        const cats = new Set<string>(data.map((course: Course) => course.category)) // ✅ Explicitly type Set<string>
        setCategories(cats)
      })
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = !selectedCategory || course.category === selectedCategory

    return matchesSearch && matchesCategory
  })

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
          <span className="text-muted-foreground">Courses</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-normal mb-4">Courses</h1>
          <p className="text-sm text-muted-foreground mb-8">
            A collection of mathematics courses with downloadable materials in both LaTeX and PDF formats.
          </p>

          {/* Search and Filters */}
          <div className="space-y-8">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {Array.from(categories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      category === selectedCategory
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.title}
              img={course.img}
              title={course.title}
              subtitle={course.subtitle}
              description={course.description}
              latexLink={course.latexLink}
              pdfLink={course.pdfLink}
              date={course.date}
              author={course.author}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No courses found matching your criteria.</p>
        )}
      </div>

      <CommandMenu />
    </main>
  )
}
