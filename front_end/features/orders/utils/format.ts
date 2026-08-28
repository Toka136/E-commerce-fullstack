// The API doesn't return a human-friendly order number (e.g. "ORD-8902-BK"),
// only a Mongo _id — this derives a short, stable-looking one from it.
export function getOrderNumber(id: string) {
  return `ORD-${id.slice(-6).toUpperCase()}`;
}

export function formatOrderDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Base path where uploaded book images are served from.
const IMAGE_BASE_URL =  "http://localhost:4000/api/Uploads";

export function getItemImageUrl(image?: string) {
  return image ? `${IMAGE_BASE_URL}/${image}` : undefined;
}