import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { ContentRenderer } from "@/components/ContentRenderer"
import { getTheorems } from "@/pages/api/theorems"

export const revalidate = 3600 // Revalidate every hour

export default async function TheoremsPage() {
  const theorems = await getTheorems()

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">
            @krisyotam
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Theorems</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-normal mb-4">Theorems</h1>
        <p className="text-sm text-muted-foreground mb-8">
        The theorems on this page are practice problems from various books, with my own proofs and solutions. The sources are referenced, 
        and the code for the proofs is written in Lean4.
        </p>
        <div className="border-b-2 border-solid border-border dark:border-border-light mb-8"></div>
        <div className="space-y-6">
          {theorems.length > 0 ? (
            theorems.map((theorem) => (
              <div key={theorem.id} className="border-b border-muted pb-4">
                <Link href={`/theorems/${theorem.slug}`} className="text-lg font-medium hover:text-muted-foreground">
                  {theorem.title}
                </Link>
                <div className="text-sm text-muted-foreground mt-2">
                  <ContentRenderer content={convertToInline(theorem.excerpt)} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No theorems available at the moment.</p>
          )}
        </div>
      </div>
      <CommandMenu />
    </main>
  )
}

// Convert all LaTeX to inline format
function convertToInline(content: string): string {
  return content
    .replace(/\$\$(.*?)\$\$/g, `\$($1\$)`) // Convert block LaTeX $$...$$ to inline $...$
    .replace(/(?<!\\)\$(.*?)(?<!\\)\$/g, `\$($1\$)`); // Standardize inline LaTeX $...$ to $...$
  
}
