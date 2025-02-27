"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download } from "lucide-react"
import Image from "next/image"

interface WorkbookModalProps {
  isOpen: boolean
  onClose: () => void
  workbook: {
    cover: string
    name: string
    subtitle: string
    author: string
    description: string
    latex_link: string
    pdf_link: string
  } | null
  status: "active" | "que" | "dropped" | "finished" // Added status prop
}

export function WorkbookModal({ isOpen, onClose, workbook, status }: WorkbookModalProps) {
  if (!workbook) return null

  // Conditionally render the download buttons if status is "finished" or "dropped"
  const shouldShowDownloadButtons = status === "finished" || status === "dropped";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{workbook.name}</DialogTitle>
          <DialogDescription>
            {workbook.subtitle} by {workbook.author}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <div className="relative h-[240px] w-[160px]">
              {/* Ensure the image is fully visible without cropping */}
              <Image
                src={workbook.cover || "/placeholder.svg"}
                alt={workbook.name}
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{workbook.description}</p>

          {/* Conditionally render download buttons */}
          {shouldShowDownloadButtons && (
            <div className="flex gap-4">
              <Button onClick={() => window.open(workbook.latex_link, "_blank")} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                LaTeX Files
              </Button>
              <Button onClick={() => window.open(workbook.pdf_link, "_blank")} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                PDF Version
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
