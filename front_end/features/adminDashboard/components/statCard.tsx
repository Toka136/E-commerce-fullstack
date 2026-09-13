import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatCardFooter {
  label: string
  value: string
  tone?: "default" | "error"
}

interface StatCardProps {
  icon: LucideIcon
  iconClassName?: string
  label: string
  value: string
  growthPercentage: number
  isPositiveTrend: boolean
  footer: StatCardFooter
}

const FOOTER_TONE_CLASSES: Record<NonNullable<StatCardFooter["tone"]>, string> = {
  default: "bg-surface-container-low text-on-surface-variant",
  error: "bg-error-container text-on-error-container",
}

export default function StatCard({
  icon: Icon,
  iconClassName = "bg-primary/10 text-primary",
  label,
  value,
  growthPercentage,
  isPositiveTrend,
  footer,
}: StatCardProps) {
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown

  return (
    <div className="flex w-full md:w-[80%] flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {label}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xl font-bold text-on-surface">{value}</span>
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositiveTrend ? "text-primary" : "text-error"
            }`}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(growthPercentage)}%
          </span>
        </div>
      </div>

      <div
        className={`flex items-center w-full md:w-[40%] justify-between rounded-lg px-3 py-2 text-xs font-medium ${
          FOOTER_TONE_CLASSES[footer.tone ?? "default"]
        }`}
      >
        <span>{footer.label}</span>
        <span className="font-semibold">{footer.value}</span>
      </div>
    </div>
  )
}