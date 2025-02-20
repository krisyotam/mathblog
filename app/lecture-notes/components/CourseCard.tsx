import Image from 'next/image'
import Link from 'next/link'

interface CourseCardProps {
  code: string
  title: string
  description: string
  image: string
  credits: number
  syllabusLink: string
  latexLink: string
  fullNotesLink: string
  sectionName: string
}

export function CourseCard({ 
  code, 
  title, 
  description, 
  image, 
  credits, 
  syllabusLink, 
  latexLink, 
  fullNotesLink, 
  sectionName 
}: CourseCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="filter brightness-75 hover:brightness-100 transition-all duration-300"
        />
      </div>
      {/* Make the content section fill the remaining space */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {code} • {credits} Credits
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        {/* Push this section to the bottom */}
        <div className="mt-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {sectionName}
          </p>
          <div className="flex space-x-4">
            <a 
              href={syllabusLink} 
              download 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Syllabus
            </a>
            <a 
              href={latexLink} 
              download 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              LaTeX
            </a>
            <a 
              href={fullNotesLink} 
              download 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Full Notes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
