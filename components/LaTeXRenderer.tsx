"use client"

import "katex/dist/katex.min.css"
import { renderToString } from "katex"
import { useEffect, useState, memo } from "react"

interface LaTeXRendererProps {
  content: string
  displayMode: boolean
}

const LaTeXRenderer = memo(({ content, displayMode }: LaTeXRendererProps) => {
  const [renderedContent, setRenderedContent] = useState<string>(content)

  useEffect(() => {
    const decodeHtml = (html: string) => {
      const txt = document.createElement("textarea")
      txt.innerHTML = html
      return txt.value
    }

    const renderLatex = (text: string): string => {
      // First decode any HTML entities
      const decodedText = decodeHtml(text)

      try {
        // Remove the delimiters based on the display mode
        const latex = displayMode
          ? decodedText.replace(/^\$\$([\s\S]*)\$\$$/, "$1")
          : decodedText.replace(/^\$([\s\S]*)\$$/, "$1")

        return renderToString(latex.trim(), {
          displayMode: displayMode,
          throwOnError: false,
          strict: false,
          output: "html",
          maxSize: 10,
          maxExpand: 1000,
          // Add specific KaTeX options to control sizing
          macros: {
            "\\eqinline": "\\style{display: inline-block;}",
          },
        })
      } catch (error) {
        console.error("LaTeX rendering error:", error)
        return text
      }
    }

    setRenderedContent(renderLatex(content))
  }, [content, displayMode])

  return (
    <span
      aria-live="polite"
      className={displayMode ? "latex-display" : "latex-inline"}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
})

LaTeXRenderer.displayName = "LaTeXRenderer"

export default LaTeXRenderer

