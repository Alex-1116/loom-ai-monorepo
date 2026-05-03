type SectionHeadingProps = {
  badge: string
  title: string
  description: string
  align?: "left" | "center"
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "left" ? "items-start text-left" : "items-center text-center"

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      <span className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary/8 px-4 py-1 text-sm font-medium text-primary">
        {badge}
      </span>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
