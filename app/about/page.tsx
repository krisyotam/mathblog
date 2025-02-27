"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Mathematician {
  name: string
  link: string
  disciplines: string[]
  category: string
  tags: string[]
}

export default function AboutPage() {
  const [mathematicians, setMathematicians] = useState<Mathematician[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMathematicians = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/mathematicians")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMathematicians(data.mathematicians)
        const cats = new Set(data.mathematicians.map((m: Mathematician) => m.category))
        setCategories(cats)
      } catch (err) {
        console.error("Error fetching mathematicians:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMathematicians()
  }, [])

  const filteredMathematicians = mathematicians.filter((mathematician) => {
    const matchesSearch =
      mathematician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mathematician.disciplines.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mathematician.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || mathematician.category === selectedCategory

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
          <span className="text-muted-foreground">About</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-normal mb-8">About</h1>
        <div className="space-y-6 mb-16">
        <p>
        I'm Kris Yotam—a researcher, writer, and software engineer. I'm currently an undergraduate Math major at 
        IU. My bachelor's degree will come with a certification in Pure Mathematics. After this my plan is to waste
        no time at applying for PhD programs for mathematics. I intend to spend my life chipping
        away at very large problems.
        </p>

        <blockquote style={{ position: 'relative', paddingLeft: '30px', fontStyle: 'italic', color: '#333', paddingTop: '5px' }}>
        <span style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', fontSize: '30px', color: 'grey' }}>|</span>
        "A river cuts through rock, not because of its power, but because of its persistence."
        </blockquote>

        <p>
            I'm studying math, but I've always had a passion for making complex ideas easier to understand. I build things—
            sometimes with code, sometimes with words.
        </p>

        <p>
            My <a href="/courses" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">courses page</a> lists courses I have created and am working on.
            My philosophy is to keep these text-based, as I believe the job of a student is to learn to properly read and
            understand papers, which these courses can serve as additional practice for.
        </p>

        <p>
            I also develop software to solve niche mathematical issues in C++, which you can find on my 
            <a href="/work" className="text-blue-600 hover:underline"> work page</a>. I write proofs in the Lean 4 language and spend some free time pondering problems on 
            <a href="https://projecteuler.net/profile/krisyotam" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> Project Euler</a>.
        </p>

        <p>
            I'm not a big fan of fluff, but I'm always learning, always sharing, and maybe one day I'll contribute to
            open-source in more than just spirit.
        </p>


          <p>
            Connect with me on{" "}
            <a href="https://writing.exchange/@krisyotam" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Writing Exchange
            </a>{" "}
            or{" "}
            <a href="https://mathstodon.xyz/@krisyotam" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Mathstodon
            </a>
            .
          </p>
          <p>When I'm not coding or pondering mathematical structures, you can find me:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Writing about the philosophy of mathematics on my blog.</li>
            <li>Pursuing random DIY projects, documented at <a href="http://krisyotam.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">krisyotam.com</a>.</li>
            <li>Learning new skills and writing articles, which can be found on the site above!</li>
          </ul>
          <p>
            I'm always eager to connect with like-minded individuals and explore new ideas. Feel free to reach out if
            you'd like to collaborate or just have an interesting conversation.
          </p>
        </div>

        <section className="space-y-6">
          <p>Here is a list of well-known and somewhat obscure research mathematicians who deserve recognition. 
            This list was compiled so you can visit their websites, see what they are working on, and learn from their résumés, blogs, and other resources.</p>


          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <Input
              placeholder="Search mathematicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Badge>
              {Array.from(categories).map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : isLoading ? (
            <p className="text-center text-muted-foreground">Loading mathematicians...</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-4 font-medium">Name</th>
                    <th className="text-left py-2 px-4 font-medium">Fields of Study</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMathematicians.map((mathematician, index) => (
                    <tr
                      key={mathematician.name}
                      className={`${index !== filteredMathematicians.length - 1 ? "border-b" : ""} hover:bg-muted/50 transition-colors`}
                    >
                      <td className="py-2 px-4">
                        <a
                          href={mathematician.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {mathematician.name}
                        </a>
                      </td>
                      <td className="py-2 px-4">{mathematician.disciplines.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <CommandMenu />
    </main>
  )
}


