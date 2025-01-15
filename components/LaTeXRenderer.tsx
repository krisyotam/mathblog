'use client'

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LaTeXRendererProps {
  latex: string;
  displayMode: boolean;
}

export const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ latex, displayMode }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        const cleanLatex = displayMode ? latex.slice(2, -2) : latex.slice(1, -1);
        katex.render(cleanLatex, containerRef.current, {
          throwOnError: false,
          displayMode: displayMode,
          strict: false,
          trust: true,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = latex;
        }
      }
    }
  }, [latex, displayMode]);

  return <span ref={containerRef} />;
};

export default LaTeXRenderer;

