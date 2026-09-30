export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface GetCategoriesResponse {
  data: Category[];
  status: string;
  message: string;
}
export interface addCategoryT {
  name: string;
}

export interface editCategoryT {
  name: string;
  description?: string;
}