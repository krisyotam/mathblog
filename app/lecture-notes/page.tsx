import Link from 'next/link'
import { DynamicCommandMenu } from '@/components/dynamic-command-menu'
import { CourseCard } from './components/CourseCard'
import lectureNotesData from '@/data/lecture-notes.json'

export default function LectureNotesPage() {
  const groupedCourses = lectureNotesData.reduce((acc, course) => {
    if (!acc[course.sectionName]) {
      acc[course.sectionName] = [];
    }
    acc[course.sectionName].push(course);
    return acc;
  }, {} as Record<string, typeof lectureNotesData>);

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
                <CourseCard key={course.code} {...course} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <DynamicCommandMenu />
    </main>
  )
}

