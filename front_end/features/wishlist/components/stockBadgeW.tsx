import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function StockBadgeW({ tone, label }: { tone: "in" | "low" | "out"; label: string }) {
  const styles = {
    in: "text-indigo-600",
    low: "text-amber-600",
    out: "text-red-500",
  }[tone];

  const Icon = tone === "in" ? CheckCircle2 : tone === "low" ? AlertTriangle : XCircle;

  return (
    <span className={`flex items-center gap-1 text-[12px] font-medium ${styles}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}