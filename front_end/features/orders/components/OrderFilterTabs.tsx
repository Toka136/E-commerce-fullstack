"use client";

export type OrderFilter = "all" | "active" | "delivered";

const TABS: { value: OrderFilter; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "active", label: "Active" },
  { value: "delivered", label: "Delivered" },
];

export default function OrderFilterTabs({
  value,
  onChange,
}: {
  value: OrderFilter;
  onChange: (filter: OrderFilter) => void;
}) {
  return (
    <div className="flex gap-2">
      {TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selected
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
