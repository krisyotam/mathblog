'use client';

import Link from 'next/link'
import { DynamicCommandMenu } from '@/components/dynamic-command-menu'
import { CourseCard } from './components/CourseCard'
import { useEffect, useState } from 'react'

// Define the structure of a Course object
interface Course {
  code: string;
  sectionName: string;
  title: string;
  description: string;  // Added description
  image: string;         // Added image
  credits: number;       // Changed credits to number
  syllabusLink: string;  // Added syllabusLink
  latexLink: string;     // Added latexLink
  fullNotesLink: string; // Added fullNotesLink
}

export default function LectureNotesPage() {
  // Use Record with Course[] instead of any[]
  const [groupedCourses, setGroupedCourses] = useState<Record<string, Course[]>>({});

  useEffect(() => {
    fetch('/api/lecture-notes')
      .then(response => response.json())
      .then(data => {
        const grouped = data.reduce((acc: Record<string, Course[]>, course: Course) => {
          if (!acc[course.sectionName]) {
            acc[course.sectionName] = [];
          }
          acc[course.sectionName].push(course);
          return acc;
        }, {});
        setGroupedCourses(grouped);
      });
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-muted-foreground">@krisyotam</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Lecture Notes</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-normal mb-12">Lecture Notes</h1>
        <p className="text-sm text-muted-foreground mb-8">
          These are lecture notes from various mathematics courses. They cover a range of topics from undergraduate to graduate level mathematics.
        </p>

        {Object.entries(groupedCourses).map(([sectionName, courses]) => (
          <section key={sectionName} className="mb-12">
            <h2 className="text-lg font-normal mb-4">{sectionName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <CourseCard 
                  key={course.code}
                  code={course.code}
                  sectionName={course.sectionName} // Removed if unnecessary
                  title={course.title}
                  description={course.description}   // Added description prop
                  image={course.image}                 // Added image prop
                  credits={course.credits}             // Changed credits to number
                  syllabusLink={course.syllabusLink}   // Added syllabusLink prop
                  latexLink={course.latexLink}         // Added latexLink prop
                  fullNotesLink={course.fullNotesLink} // Added fullNotesLink prop
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <DynamicCommandMenu />
    </main>
  )
}
