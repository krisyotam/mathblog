'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import DOMPurify from 'isomorphic-dompurify';

const LaTeXRenderer = dynamic(() => import('./LaTeXRenderer').then(mod => mod.LaTeXRenderer), { ssr: false });

interface ContentRendererProps {
  content: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderContent = () => {
    const sanitizedContent = DOMPurify.sanitize(content);
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, 'text/html');

    const processNode = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/);
        return parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return <LaTeXRenderer key={index} latex={part} displayMode={true} />;
          } else if (part.startsWith('$') && part.endsWith('$')) {
            return <LaTeXRenderer key={index} latex={part} displayMode={false} />;
          } else {
            return part;
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.tagName.toLowerCase() === 'body') {
          return Array.from(element.childNodes).map((child, index) => 
            React.createElement(React.Fragment, { key: index }, processNode(child))
          );
        }
        const children = Array.from(element.childNodes).map((child, index) => 
          React.createElement(React.Fragment, { key: index }, processNode(child))
        );
        return React.createElement(
          element.tagName.toLowerCase(),
          { key: Math.random() },
          ...children
        );
      }
      return null;
    };

    return processNode(doc.body);
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {renderContent()}
    </div>
  );
};


