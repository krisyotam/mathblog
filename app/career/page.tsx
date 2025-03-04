"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UniversityCard } from "@/components/university-card"
import { CommandMenu } from "@/components/command-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Separator from "@/components/separator"

const apiKey = process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY
const apiUrl = process.env.NEXT_PUBLIC_GHOST_API_URL

interface Institution {
  id: number
  img: string
  name: string
  location: string
  description: string
  studentCount: number
  website: string
  foundedYear: number
  category: string
  tags: string[]
  slug: string
}

interface GhostContent {
  html: string
  feature_image: string | null
}

type InstitutionType = "universities" | "institutes"

export default function AcademicInstitutionsPage() {
  const [institutionType, setInstitutionType] = useState<InstitutionType>("universities")
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<{
    ghostContent: string
    institution: Institution
    featureImage: string
  } | null>(null)

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/${institutionType}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setInstitutions(data)

        // Extract unique categories
        const cats = new Set(data.map((institution: Institution) => institution.category)) as Set<string>
        setCategories(cats)
      } catch (err) {
        console.error(`Error fetching ${institutionType}:`, err)
        setError(err instanceof Error ? err.message : `An error occurred while fetching ${institutionType}.`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstitutions()
  }, [institutionType])

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || institution.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleViewInformation = async (institution: Institution) => {
    try {
      const response = await fetch(`/api/ghost-content?slug=${institution.slug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: GhostContent = await response.json()
      setModalContent({
        ghostContent: data.html,
        institution,
        featureImage: data.feature_image || institution.img,
      })
      setModalOpen(true)
    } catch (err) {
      console.error("Error fetching Ghost content:", err)
    }
  }

  const handleCareerResearchAndPlanning = async () => {
    try {
      const response = await fetch(`/api/ghost-content?slug=career-research-and-planning`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setModalContent({
        ghostContent: data.html,
        institution: {
          id: -1,
          img: "",
          name: "Career Research & Planning",
          location: "",
          description: "",
          studentCount: 0,
          website: "",
          foundedYear: 0,
          category: "",
          tags: [],
          slug: "",
        },
        featureImage: data.feature_image || "",
      })
      setModalOpen(true)
    } catch (err) {
      console.error("Error fetching Career Research & Planning content:", err)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 bg-background text-foreground">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading Career...</p>
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
          <span className="text-muted-foreground">Career</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-normal mb-4">Career</h1>
          <Button onClick={handleCareerResearchAndPlanning} className="mb-4">
            Career Research & Planning
          </Button>
          <p className="text-sm text-muted-foreground mb-8">
            This page was uniquely designed to keep track of universities for my grad applications, and post-grad research institutes in <strong>somewhat</strong> obsessive detail.
            However anyone is free to use this page to look through the catalog of universities and institutes I have compiled and a list of information on them designed to observe
            the strengths and weaknesses of them. Some downsides will only apply to me for ex. location, climate, ect. so you should ignore those on your best judgement. 
          </p>

          {/* Institution Type Selector */}
          <div className="flex gap-4 mb-4">
            <Button
              onClick={() => {
                setInstitutionType("universities")
                setSelectedCategory(null)
              }}
              variant={institutionType === "universities" ? "default" : "outline"}
            >
              Universities
            </Button>
            <Button
              onClick={() => {
                setInstitutionType("institutes")
                setSelectedCategory(null)
              }}
              variant={institutionType === "institutes" ? "default" : "outline"}
            >
              Research Institutes
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <Input
              placeholder={`Search ${institutionType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            {/* Categories Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`p-2 text-sm rounded-md transition-colors ${
                  selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                All Categories
              </button>
              {Array.from(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-2 text-sm rounded-md transition-colors ${
                    selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <p className="text-center text-destructive mt-8">{error}</p>
        ) : filteredInstitutions.length === 0 ? (
          <p className="text-center text-muted-foreground mt-8">No institutions found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInstitutions.map((institution) => (
              <UniversityCard
                key={institution.id}
                img={institution.img}
                name={institution.name}
                location={institution.location}
                description={institution.description}
                studentCount={institution.studentCount}
                website={institution.website}
                infoLink={() => handleViewInformation(institution)}
                foundedYear={institution.foundedYear}
              />
            ))}
          </div>
        )}
      </div>
      <CommandMenu />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto scrollbar-hide">
          {modalContent && (
            <div className="space-y-6">
              <img
                src={modalContent.featureImage || "/placeholder.svg"}
                alt={modalContent.institution.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{modalContent.institution.name}</h2>
                <p className="text-muted-foreground">{modalContent.institution.location}</p>
                <p>{modalContent.institution.description}</p>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <span>Founded: {modalContent.institution.foundedYear}</span>
                  <span>Students: {modalContent.institution.studentCount.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {modalContent.institution.tags.map((tag, index) => (
                    <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: modalContent.ghostContent }} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

