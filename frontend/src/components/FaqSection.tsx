'use client'

import { useState } from 'react'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqSectionProps {
  items: FaqItem[]
}

export function FaqSection({ items }: FaqSectionProps) {
  const [openItem, setOpenItem] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {items.map((item) => {
        const isOpen = openItem === item.id
        return (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenItem(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-lg font-semibold text-gray-900">{item.question}</span>
              <span className="text-2xl text-gray-400">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 whitespace-pre-line">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

