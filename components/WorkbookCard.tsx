"use client"

import { Download } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface WorkbookCardProps {
  cover: string
  name: string
  subtitle?: string
  author: string
  onClick?: () => void
}

export function WorkbookCard({ cover, name, subtitle, author, onClick }: WorkbookCardProps) {
  return (
    <Card
      className="flex overflow-hidden transition-colors hover:bg-accent/50 group h-[120px] cursor-pointer"
      onClick={onClick}
    >
      <div className="w-[80px] bg-muted p-3">
        <div className="relative h-[80px] w-full">
          <Image src={cover || "/placeholder.svg"} alt={name} fill className="object-cover rounded-sm" />
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-2">{name}</h3>
          {subtitle && <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>}
          <p className="text-xs text-muted-foreground truncate">by {author}</p>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <Download className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Available for download</span>
        </div>
      </div>
    </Card>
  )
}
