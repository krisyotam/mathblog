import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'

export async function processContent(content: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRaw)
    .use(rehypeKatex, {
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml'
    })
    .use(rehypeStringify)
    .process(content)

  return String(file)
}

