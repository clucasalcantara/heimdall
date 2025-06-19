import type React from "react"
interface DashboardHeaderProps {
  heading: string
  subheading?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, subheading, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
        {subheading && <p className="text-sm text-muted-foreground">{subheading}</p>}
      </div>
      {children}
    </div>
  )
}
