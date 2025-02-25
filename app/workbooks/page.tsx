"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { WorkbookCard } from "@/components/WorkbookCard"
import { WorkbookModal } from "@/components/WorkbookModal"
import { Input } from "@/components/ui/input"

interface Workbook {
  id: string
  cover: string
  name: string
  subtitle: string
  author: string
  datePublished: string
  subject: string
  categories: string[]
  latex_link: string
  pdf_link: string
  description: string
  status: "active" | "que" | "dropped" | "finished"
}

const WorkbooksPage: React.FC = () => {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([])
  const [selectedWorkbook, setSelectedWorkbook] = useState<Workbook | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchWorkbooks = async () => {
      const response = await fetch("/api/workbooks")
      const data: Workbook[] = await response.json()

      setWorkbooks(data)
      const uniqueSubjects: string[] = Array.from(new Set(data.map((w) => w.subject)))
      setSubjects(uniqueSubjects)
    }

    fetchWorkbooks()
  }, [])

  const filteredWorkbooks = workbooks.filter((workbook) => {
    const matchesSearch =
      workbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbook.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = !selectedSubject || workbook.subject === selectedSubject

    return matchesSearch && matchesSubject
  })

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">
            @krisyotam
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Workbooks</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Workbooks</h1>
        <p className="text-sm text-muted-foreground mb-8">
          These are my fully worked out solutions from various workbooks & textbooks I've done over the years. Each workbook is categorized with a
          status to reflect its current state. If a workbook is marked as <strong>active</strong>, it means the work is currently in progress. <strong>Que</strong> indicates that
          the workbook is queued to be started soon. If the status is <strong>dropped</strong>, it means the workbook is temporarily paused or abandoned. Finally, when a workbook
          is <strong>finished</strong>, it is completed and available for download.
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            placeholder="Search workbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Subject Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject === selectedSubject ? null : subject)}
                className={`p-2 text-sm rounded-md transition-colors ${
                  subject === selectedSubject ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Workbook Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredWorkbooks.map((workbook) => (
            <WorkbookCard
              key={workbook.id}
              cover={workbook.cover}
              name={workbook.name}
              subtitle={workbook.subtitle}
              author={workbook.author}
              status={workbook.status}
              onClick={() => setSelectedWorkbook(workbook)}
            />
          ))}
        </div>

        {/* Modal */}
        <WorkbookModal
          isOpen={!!selectedWorkbook}
          onClose={() => setSelectedWorkbook(null)}
          workbook={selectedWorkbook} status={"active"}        />
      </div>
      <CommandMenu />
    </main>
  )
}

export default WorkbooksPage
