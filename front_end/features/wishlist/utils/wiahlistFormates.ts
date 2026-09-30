import { WishlistProduct } from "../types/wishlist";

export type StockTone = "in" | "low" | "out";
 
export function stockStatus(product: Pick<WishlistProduct, "stock">): {
  label: string;
  tone: StockTone;
} {
  console.log("product", product);
  if (product.stock <= 0) return { label: "Out of Stock", tone: "out" };
  if (product.stock <= 5) return { label: "Low Stock", tone: "low" };
  return { label: "In Stock", tone: "in" };
}
