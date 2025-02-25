import type React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface LectureNoteCardProps {
  code: string;
  title: string;
  description: string;
  image: string;
  credits: number;
  syllabusLink: string;
  latexLink: string;
  fullNotesLink: string;
  tags: string[];
}

export const LectureNoteCard: React.FC<LectureNoteCardProps> = ({
  code,
  title,
  description,
  image,
  credits,
  syllabusLink,
  latexLink,
  fullNotesLink,
  tags,
}) => {
  return (
    <Card className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 h-full">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full aspect-[7/4] object-cover" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-300" />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-muted-foreground mb-2">
          {code} • {credits} Credits
        </div>
        <h3 className="font-semibold text-base mb-2">{title}</h3>
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && <span className="text-xs text-muted-foreground">+{tags.length - 4} more</span>}
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a href={latexLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" />
              <span>LaTeX</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a href={fullNotesLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" />
              <span>PDF</span>
            </a>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t bg-muted/50">
        <Button variant="ghost" size="sm" asChild className="w-full">
          <a href={syllabusLink} target="_blank" rel="noopener noreferrer">
            View Syllabus
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
