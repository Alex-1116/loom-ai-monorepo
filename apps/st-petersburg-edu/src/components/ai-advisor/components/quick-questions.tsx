"use client"

import { Button } from "@loom/ui/components/button"

type QuickQuestionsProps = {
  questions: string[]
  onSelect: (question: string) => void
}

export function QuickQuestions({ questions, onSelect }: QuickQuestionsProps) {
  return (
    <div className="border-b border-border/80 bg-muted/35 px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <Button
            key={question}
            size="sm"
            className="bg-background text-xs font-medium text-muted-foreground shadow-[0_10px_22px_-18px_rgba(15,23,42,0.12)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
            onClick={() => onSelect(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
