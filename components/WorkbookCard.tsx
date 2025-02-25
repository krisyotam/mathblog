import { Download, Clock, PauseCircle, CheckCircle, List } from "lucide-react"  // Import relevant icons
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface WorkbookCardProps {
  cover: string
  name: string
  subtitle?: string
  author: string
  status: "active" | "que" | "dropped" | "finished"  // Added finished status
  onClick?: () => void
}

export function WorkbookCard({ cover, name, subtitle, author, status, onClick }: WorkbookCardProps) {
  // Determine the status label and icon based on the 'status' prop
  let statusLabel = "";
  let StatusIcon = Download;  // Default to Download icon
  
  switch (status) {
    case "active":
      statusLabel = "Work in progress";
      StatusIcon = Clock;  // Show Clock icon for active status
      break;
    case "que":
      statusLabel = "To be started";
      StatusIcon = List;  // Show List icon for queued status (distinct from active)
      break;
    case "dropped":
      statusLabel = "Temporarily paused";
      StatusIcon = PauseCircle;  // Show Pause icon for dropped status
      break;
    case "finished":
      statusLabel = "";  // No custom label needed for finished, just show download message
      StatusIcon = CheckCircle;  // Show Check Circle icon for finished status
      break;
    default:
      statusLabel = "";
      StatusIcon = Download;  // Default icon
      break;
  }

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
        {status === "finished" && (  // Only show download message for finished status
          <div className="flex items-center gap-1 mt-1.5">
            <Download className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Available for download</span>
          </div>
        )}
        {/* Add the status label with the respective icon */}
        {statusLabel && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <StatusIcon className="h-3 w-3 text-muted-foreground" />
            <span>{statusLabel}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
