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
  _id: string;
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
  _id: string;
  userId: {
    _id: string;
    userName: string;
  };
  rating: number;
  review: string;
  updatedAt: string;
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