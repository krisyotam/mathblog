"use client"
import Link from "next/link"
import { BookOpen, CheckCircle2, Copy, Download, FileText, FlaskConical, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import LaTeXRenderer from "@/components/LaTeXRenderer"

interface DownloadLink {
  label: string
  href: string
  icon: LucideIcon
}

interface TheoremProps {
  number: string
  title: string
  statement: string
  description?: string
  leanProof?: string
  latexProof?: string
  status: "active" | "finished"
  category: string
  tags: string[]
  dateStarted: string
  dateCompleted?: string
  reference: string
  notesSlug: string
}

export function Theorem({
  number,
  title,
  statement,
  description,
  leanProof,
  latexProof,
  status,
  reference,
  notesSlug,
}: TheoremProps) {
  const downloads: DownloadLink[] = [
    ...(leanProof
      ? [
          {
            label: "Lean4 Proof",
            href: leanProof,
            icon: Download,
          },
        ]
      : []),
    ...(latexProof
      ? [
          {
            label: "LaTeX Proof",
            href: latexProof,
            icon: FileText,
          },
        ]
      : []),
  ]

  const isActive = status === "active"

  const copyStatement = async () => {
    try {
      await navigator.clipboard.writeText(statement)
      toast.success("Statement copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy statement")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Theorem {number}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              <span>{reference}</span>
            </div>
          </div>
          <Badge variant={isActive ? "secondary" : "default"} className="flex items-center gap-1">
            {isActive ? (
              <>
                <FlaskConical className="h-3 w-3" />
                <span>Work in Progress</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3" />
                <span>Completed</span>
              </>
            )}
          </Badge>
        </div>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative rounded-lg bg-muted">
          <ScrollArea className="w-full">
            <div className="min-w-full p-4 [&>*]:text-foreground">
              <LaTeXRenderer content={statement} displayMode={false} />
            </div>
          </ScrollArea>
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={copyStatement}>
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy statement</span>
          </Button>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <Button variant="outline" className="w-full justify-between" asChild>
          <Link href={`/theorems/${notesSlug}`}>
            {isActive ? "View Work in Progress Notes" : "See Final Results"}
            {isActive ? <FlaskConical className="h-4 w-4 ml-2" /> : <FileText className="h-4 w-4 ml-2" />}
          </Link>
        </Button>
      </CardContent>
      {downloads.length > 0 && status === "finished" && (
        <>
          <Separator />
          <CardFooter className="mt-4">
            <div className="flex w-full justify-end gap-2">
              {downloads.map(({ label, href, icon: Icon }) => (
                <Button key={label} variant="outline" size="sm" className="h-8" asChild>
                  <a href={href} download>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </a>
                </Button>
              ))}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default Theorem

