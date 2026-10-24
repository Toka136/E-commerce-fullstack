export interface BookCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface BookRate {
  average: number;
  count: number;
}

export interface BookDetails {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  pages: number;
  description: string;
  coverImage: string;
  stock: number;
  createdAt: string;
  rate: BookRate;
}

export interface BookReview {
  id: string;
  userId: string;
  rating: number;
  review: string;
  updatedAt: string;
  user:{userName:string}
}

export interface GetBookData {
  book: BookDetails;
  bookReviews: BookReview[];
}

export interface GetBookResponse {
  status: "success" | "error";
  message: string;
  data: GetBookData;
}