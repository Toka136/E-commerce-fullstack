import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Tone = "success" | "failed" | "pending";

const tones: Record<Tone, { ring: string; icon: string }> = {
  success: { ring: "bg-emerald-50", icon: "text-emerald-600" },
  failed: { ring: "bg-red-50", icon: "text-red-600" },
  pending: { ring: "bg-amber-50", icon: "text-amber-600" },
};

export type PaymentAction = {
  label: string;
  href?: string;
  primary?: boolean;
};

type Props = {
  tone: Tone;
  icon: LucideIcon;
  title: string;
  description: string;
  details?: { label: string; value: string }[];
  actions?: PaymentAction[];
  children?: React.ReactNode;
};

export default function PaymentStatusCard({
  tone,
  icon: Icon,
  title,
  description,
  details,
  actions,
  children,
}: Props) {
  const t = tones[tone];

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${t.ring}`}
        >
          <Icon className={`h-8 w-8 ${t.icon}`} aria-hidden />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        {details && details.length > 0 && (
          <dl className="mt-6 divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4 text-left text-sm">
            {details.map((d) => (
              <div key={d.label} className="flex justify-between gap-4 py-3">
                <dt className="text-slate-500">{d.label}</dt>
                <dd className="break-all font-medium text-slate-900">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {actions&& actions.map((a) => (
            <Link
              key={a.label}
              href={a.href ?? "#"}
              className={
                a.primary
                  ? "rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  : "rounded-full bg-indigo-50 px-6 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              }
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}