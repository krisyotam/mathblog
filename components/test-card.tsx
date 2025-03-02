import type { FC } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Eye, PenLine } from "lucide-react"

export interface TestCardProps {
  img: string
  title: string
  subject: string
  description: string
  duration: string
  questionCount: number
  previewLink: string
  startLink: string
  date?: string
  author?: string
}

export const TestCard: FC<TestCardProps> = ({
  img,
  title,
  subject,
  description,
  duration,
  questionCount,
  previewLink,
  startLink,
  date,
  author,
}) => {
  return (
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
            <Clock className="mr-1 h-3 w-3" />
            <span>{duration}</span>
          </div>
          <div>
            <span>{questionCount} questions</span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a
              href={previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Preview</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a href={startLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <PenLine className="mr-2 h-4 w-4" />
              <span>Take Test</span>
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
  )
}

