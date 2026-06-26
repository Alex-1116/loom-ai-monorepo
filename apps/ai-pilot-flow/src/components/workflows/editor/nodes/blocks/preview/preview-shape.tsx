"use client"

export function renderPreviewBody() {
  return (
    <div
      className="aspect-square w-full rounded-xl bg-[#1f212b]"
      style={{
        backgroundImage:
          "linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04)), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%, rgba(255,255,255,0.04))",
        backgroundPosition: "0 0, 12px 12px",
        backgroundSize: "24px 24px",
      }}
    />
  )
}
