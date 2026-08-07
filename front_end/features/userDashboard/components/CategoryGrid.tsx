import type { Category } from "@/lib/types";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories: Category[];
}

/**
 * "Shop by Category" bento grid. The first tile spans two columns to echo
 * the reference layout's emphasis pattern; falls back gracefully for any
 * number of categories the backend returns.
 */
export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mb-xl">
      <h2 className="text-headline-lg-mobile md:text-headline-md font-display text-on-surface mb-md">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {categories.map((category, i) => (
          <CategoryCard key={category._id} category={category} span={i === 0 ? "2" : "1"} />
        ))}
      </div>
    </section>
  );
}
