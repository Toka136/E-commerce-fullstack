export interface WishlistProduct {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  stock: number;
}

export interface WishlistItem {
  _id: string;
  productId: WishlistProduct;
}

export interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GetWishlistResponse {
  status: "success" | "error";
  message: string;
  items: WishlistItem[];
}
export interface wishlistStore {
  count: number;
  setCount: (count: number) => void;

}