"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { WorkbookCard } from "@/components/WorkbookCard"
import { WorkbookModal } from "@/components/WorkbookModal"

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
}

const WorkbooksPage: React.FC = () => {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([])
  const [selectedWorkbook, setSelectedWorkbook] = useState<Workbook | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<string[]>([])

  useEffect(() => {
    const fetchWorkbooks = async () => {
      const response = await fetch('/api/workbooks')
      const data: Workbook[] = await response.json() // Type the data as Workbook[]

      setWorkbooks(data)

      // Ensure subjects are a unique set of strings
      const uniqueSubjects: string[] = Array.from(new Set(data.map((w) => w.subject)))
      setSubjects(uniqueSubjects)
    }

    fetchWorkbooks()
  }, [])

  const filteredWorkbooks = selectedSubject ? workbooks.filter((w) => w.subject === selectedSubject) : workbooks

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

        <div className="mb-8">
          {/* Updated grid to display 4 columns */}
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

        <div className="grid gap-4 md:grid-cols-2">
          {filteredWorkbooks.map((workbook) => (
            <WorkbookCard
              key={workbook.id}
              cover={workbook.cover}
              name={workbook.name}
              subtitle={workbook.subtitle}
              author={workbook.author}
              onClick={() => setSelectedWorkbook(workbook)}
            />
          ))}
        </div>

        <WorkbookModal
          isOpen={!!selectedWorkbook}
          onClose={() => setSelectedWorkbook(null)}
          workbook={selectedWorkbook}
        />
      </div>
      <CommandMenu />
    </main>
  )
}

export default WorkbooksPage;
