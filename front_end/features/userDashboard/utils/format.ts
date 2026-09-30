import { BookDetails } from "../types/book";

const ASSET_BASE_URL =
  "http://localhost:4000/api/Uploads" ;

export function getCoverImageUrl(coverImage: string): string {
    console.log("coverImage",coverImage)
  if (!coverImage) return "/placeholder-book.png";
  if (coverImage.startsWith("http")) return coverImage;
  console.log("ASSET_BASE_URL",`${ASSET_BASE_URL}/${coverImage}`)
  return `${ASSET_BASE_URL}/${coverImage}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatPublishedDate(createdAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(createdAt));
}

export function stockLabel(book: Pick<BookDetails, "stock">): {
  label: string;
  tone: "in" | "low" | "out";
} {
  if (book.stock <= 0) return { label: "Out of stock", tone: "out" };
  if (book.stock <= 5) return { label: `Only ${book.stock} left`, tone: "low" };
  return { label: "In stock", tone: "in" };
}
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}
