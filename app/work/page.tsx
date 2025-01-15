import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'
import { ArrowUpRight } from 'lucide-react'

const projects = [
  {
    title: "Mathematical Visualization Library",
    description: "An open-source library for creating interactive mathematical visualizations using WebGL and React.",
    link: "https://github.com/krisyotam/math-vis",
    year: "2024",
    status: "Active"
  },
  {
    title: "Category Theory Notes",
    description: "Interactive digital garden exploring category theory concepts with practical applications in programming.",
    link: "https://cat-theory.krisyotam.com",
    year: "2023",
    status: "Active"
  },
  {
    title: "Quantum Computing Simulator",
    description: "Browser-based quantum circuit simulator with visual state representations.",
    link: "https://quantum.krisyotam.com",
    year: "2023",
    status: "Completed"
  },
  {
    title: "Type Theory Playground",
    description: "Interactive environment for exploring dependent type theory and proof assistants.",
    link: "https://types.krisyotam.com",
    year: "2022",
    status: "Archived"
  }
]

export default function WorkPage() {
  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">@krisyotam</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/" className="hover:text-muted-foreground">Home</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Work</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">Work</h1>
        <div className="space-y-12">
          {projects.map((project) => (
            <div key={project.title} className="group">
              <div className="flex items-start justify-between mb-2">
                <a 
                  href={project.link}
                  className="text-sm font-medium hover:text-muted-foreground flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.title}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{project.year}</span>
                  <span>•</span>
                  <span>{project.status}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

