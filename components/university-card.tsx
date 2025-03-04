import type { FC } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, Users, Info } from "lucide-react"

export interface UniversityCardProps {
  img: string
  name: string
  location: string
  description: string
  studentCount: number
  website: string
  infoLink: () => void
  foundedYear: number
}

export const UniversityCard: FC<UniversityCardProps> = ({
  img,
  name,
  location,
  description,
  studentCount,
  website,
  infoLink,
  foundedYear,
}) => {
  return (
    <Card className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 h-full">
      <div className="relative">
        <img src={img || "/placeholder.svg"} alt={name} className="w-full aspect-[16/9] object-cover" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-300" />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 flex items-center">
          <MapPin className="mr-1 h-4 w-4" />
          {location}
        </p>
        <p className="text-sm text-muted-foreground flex-grow mb-4">{description}</p>

        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{studentCount.toLocaleString()} students</span>
          </div>
          <div>
            <span>Founded {foundedYear}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <Globe className="mr-2 h-4 w-4" />
              <span>Website</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={infoLink}
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <Info className="mr-2 h-4 w-4" />
            <span>View Information</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t bg-muted/50 mt-auto">
        <div className="w-full text-sm text-muted-foreground text-center">
          <span>Learn more about {name}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

