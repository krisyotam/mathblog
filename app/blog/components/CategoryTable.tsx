import Link from 'next/link'

interface CategoryTableProps {
  categories: { [key: string]: number };
}

export function CategoryTable({ categories }: CategoryTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-2">Category</th>
          <th className="text-right py-2">Posts</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(categories).map(([category, count]) => (
          <tr key={category} className="border-b border-gray-200 dark:border-gray-700">
            <td className="py-2">
              <Link href={`/blog/category/${encodeURIComponent(category)}`} className="hover:text-gray-600 dark:hover:text-gray-300">
                {category}
              </Link>
            </td>
            <td className="text-right py-2">{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

