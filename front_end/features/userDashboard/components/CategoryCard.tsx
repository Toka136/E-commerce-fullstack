import {
  BookOpen,
  FlaskConical,
  Palette,
  Landmark,
  HeartPulse,
  Code2,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";

const ICONS_BY_KEYWORD: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /software|program|code|dev|tech/i, icon: Code2 },
  { match: /science|physic|chem|biolog/i, icon: FlaskConical },
  { match: /art|design|paint/i, icon: Palette },
  { match: /history|histor/i, icon: Landmark },
  { match: /health|wellness|life/i, icon: HeartPulse },
  { match: /cook|culinary|food/i, icon: UtensilsCrossed },
];

const GRADIENTS = [
  "from-primary/90 to-primary-container/70",
  "from-secondary/90 to-secondary-container/70",
  "from-tertiary/90 to-tertiary-container/70",
  "from-on-secondary-fixed-variant/90 to-secondary/70",
];

function iconFor(name: string): LucideIcon {
  return ICONS_BY_KEYWORD.find((entry) => entry.match.test(name))?.icon ?? BookOpen;
}

/** Deterministic gradient index so the same category always looks the same. */
function gradientFor(id: string): string {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

interface CategoryCardProps {
  category: Category;
  span?: "1" | "2";
}

export default function CategoryCard({ category, span = "1" }: CategoryCardProps) {
  const Icon = iconFor(category.name);

  return (
    <button
      type="button"
      className={`relative h-40 rounded-xl overflow-hidden group cursor-pointer text-left ${
        span === "2" ? "col-span-2" : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFor(
          category._id
        )} group-hover:scale-105 transition-transform duration-500`}
      />
      {/* eslint-disable-next-line react-hooks/static-components -- Icon is a component reference picked from a lookup table, not defined during render */}
      <Icon className="absolute -right-3 -bottom-3 w-24 h-24 text-white/15" strokeWidth={1.25} />
      <div className="absolute bottom-md left-md right-md">
        <h4 className="text-headline-md md:text-headline-md font-display text-white font-bold line-clamp-1">
          {category.name}
        </h4>
        {category.description && (
          <p className="text-label-sm text-white/80 line-clamp-1">{category.description}</p>
        )}
      </div>
    </button>
  );
}
