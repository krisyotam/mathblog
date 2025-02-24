import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentRenderer } from "@/components/ContentRenderer"
import { CommandMenu } from "@/components/command-menu"
import { getTheorems } from "@/pages/api/theorems"

export const revalidate = 3600 // Revalidate every hour

export default async function TheoremPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const theorems = await getTheorems()
  const theorem = theorems.find((t) => t.slug === slug)

  if (!theorem) {
    notFound()
  }

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">
            @krisyotam
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/theorems" className="hover:text-muted-foreground">
            Theorems
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{theorem.title}</span>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{theorem.title}</h1>
        <ContentRenderer content={theorem.html} />
      </article>

      <CommandMenu />
    </main>
  )
}

export async function generateStaticParams() {
  const theorems = await getTheorems()
  return theorems.map((theorem) => ({
    slug: theorem.slug,
  }))
}

