import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-3 text-stone-900 dark:text-white">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-2.5 text-stone-900 dark:text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mb-2 text-stone-900 dark:text-white">
            {children}
          </h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        // Code blocks
        code: ({ inline, className, children, ...props }: any) => {
          return inline ? (
            <code
              className="bg-stone-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className="block bg-stone-100 dark:bg-dark-900 text-stone-800 dark:text-slate-200 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 border border-stone-200 dark:border-dark-700"
              {...props}
            >
              {children}
            </code>
          );
        },
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary-500 pl-4 py-2 mb-3 italic text-stone-600 dark:text-slate-400 bg-stone-50 dark:bg-dark-900/50 rounded-r">
            {children}
          </blockquote>
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline decoration-primary-300 dark:decoration-primary-600 hover:decoration-primary-500 transition-colors"
          >
            {children}
          </a>
        ),
        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-stone-900 dark:text-white">
            {children}
          </strong>
        ),
        // Emphasis/Italic
        em: ({ children }) => (
          <em className="italic text-stone-700 dark:text-slate-300">{children}</em>
        ),
        // Horizontal rule
        hr: () => (
          <hr className="my-4 border-t border-stone-200 dark:border-dark-700" />
        ),
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full border border-stone-200 dark:border-dark-700 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-stone-100 dark:bg-dark-900">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-stone-200 dark:border-dark-700 last:border-0">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-sm font-semibold text-stone-900 dark:text-white">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-sm text-stone-700 dark:text-slate-300">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
