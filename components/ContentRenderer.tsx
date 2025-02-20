"use client"

import React, { useMemo } from "react"
import dynamic from "next/dynamic"
import DOMPurify from "isomorphic-dompurify"

const LaTeXRenderer = dynamic(() => import("./LaTeXRenderer"), {
  ssr: false,
})

interface ContentRendererProps {
  content: string
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const purifyConfig = {
    ADD_TAGS: ["math"],
    ADD_ATTR: ["class", "style"],
    ALLOWED_TAGS: [
      "p",
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "strong",
      "em",
      "math",
      "blockquote",
      "pre",
      "code",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    ALLOWED_ATTR: ["class", "style", "href", "target", "src", "alt"],
  }

  const sanitizedContent = useMemo(() => DOMPurify.sanitize(content, purifyConfig), [content])

  const renderContent = useMemo(() => {
    if (typeof window === "undefined") {
      return sanitizedContent
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitizedContent, "text/html")

    const processNode = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ""

        if (text.includes("$")) {
          // First, split by display mode delimiters
          const segments = text.split(/(\$\$[\s\S]*?\$\$)/g)

          return segments.map((segment, index) => {
            if (segment.startsWith("$$") && segment.endsWith("$$")) {
              return <LaTeXRenderer key={`display-${index}`} content={segment} displayMode={true} />
            }

            // Then handle inline mode in remaining segments
            if (segment.includes("$")) {
              const inlineParts = segment.split(/(\$(?!\$).*?\$)/g)
              return inlineParts.map((part, inlineIndex) => {
                if (part.startsWith("$") && part.endsWith("$") && !part.startsWith("$$")) {
                  return <LaTeXRenderer key={`inline-${index}-${inlineIndex}`} content={part} displayMode={false} />
                }
                return part
              })
            }

            return segment
          })
        }
        return text
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element

        if (element.tagName.toLowerCase() === "body") {
          return Array.from(element.childNodes).map((child, index) =>
            React.createElement(React.Fragment, { key: index }, processNode(child)),
          )
        }

        const children = Array.from(element.childNodes).map((child, index) =>
          React.createElement(React.Fragment, { key: index }, processNode(child)),
        )

        const attributes: { [key: string]: string } = {}
        Array.from(element.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value
        })

        // Add appropriate classes based on the element type
        const className = `slug-page-${element.tagName.toLowerCase()} ${attributes.class || ""}`

        return React.createElement(
          element.tagName.toLowerCase(),
          {
            key: `${element.tagName}-${Math.random().toString(36).slice(2)}`,
            ...attributes,
            className,
          },
          ...children,
        )
      }

      return null
    }

    return processNode(doc.body)
  }, [sanitizedContent])

  return <div className="prose prose-sm dark:prose-invert max-w-none slug-page">{renderContent}</div>
}

