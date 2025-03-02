"use client"

import { type FC, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export interface ProblemSetCardProps {
  img: string
  title: string
  subject: string
  description: string
  difficulty: string
  problemCount: number
  pdfUrl: string
  date?: string
  author?: string
  status: "open" | "solved"
}

export const ProblemSetCard: FC<ProblemSetCardProps> = ({
  img,
  title,
  subject,
  description,
  difficulty,
  problemCount,
  pdfUrl,
  date,
  author,
  status,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 h-full">
        <div className="relative">
          <img src={img || "/placeholder.svg"} alt={title} className="w-full aspect-[7/4] object-cover" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-300" />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-base mb-2">{title}</h3>
          <p className="text-xs text-muted-foreground mb-3">{subject}</p>
          <p className="text-[10px] text-muted-foreground flex-grow mb-4">{description}</p>

          <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span>Difficulty: {difficulty}</span>
            </div>
            <div>
              <span>{problemCount} problems</span>
            </div>
          </div>
          <div className="mb-4 text-xs">
            <span
              className={`px-2 py-1 rounded-full ${
                status === "open" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
              }`}
            >
              {status === "open" ? "Open" : "Solved"}
            </span>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>View Set</span>
              </a>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t bg-muted/50 mt-auto">
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            {date && <span>{new Date(date).toLocaleDateString()}</span>}
            {author && <span>{author}</span>}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0">
          <div className="relative w-full h-[80vh]">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <Button size="sm" variant="secondary" asChild>
                <a href={pdfUrl} download className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
            </div>
            <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full" title={`${title} Preview`} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

