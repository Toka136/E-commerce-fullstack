import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../../modules/Categories/Category.repo";

import { addCategoryS, deleteCategoryS, getCategoriesS, getCategoryS, updateCategoryS } from "../../modules/Categories/Category.service";

import { categoryI } from "../../modules/Categories/Category.types";
import { getBooksbyCategory } from "../../modules/Books/book.repo";

vi.mock("../../modules/categories/Category.repo", () => ({
  addCategory: vi.fn(),
  deleteCategory: vi.fn(),
  getCategories: vi.fn(),
  getCategory: vi.fn(),
  updateCategory: vi.fn(),
}));

vi.mock("../../modules/Books/book.repo", () => ({
  getBooksbyCategory: vi.fn(),
}));
describe("Category Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
describe("addCategoryS", () => {
  

  it("should create a category with a generated slug", async () => {
    const category = {
      name: "Science Fiction",
    } as categoryI;

    const savedCategory = {
      ...category,
      slug: "science-fiction",
    };

    vi.mocked(getCategory).mockResolvedValue(null as any);

    vi.mocked(addCategory).mockResolvedValue(
      savedCategory as any
    );

    const result = await addCategoryS(category);

    expect(getCategory).toHaveBeenCalledWith(
      "science-fiction"
    );

    expect(addCategory).toHaveBeenCalledWith({
      name: "Science Fiction",
      slug: "science-fiction",
    });

    expect(result).toEqual(savedCategory);
  });
  it("should throw an error if the category already exists", async () => {
  const category = {
    name: "Science Fiction",
  } as categoryI;

  vi.mocked(getCategory).mockResolvedValue({
    name: "Science Fiction",
    slug: "science-fiction",
  } as any);

  await expect(addCategoryS(category)).rejects.toMatchObject({
    message: "Category Already Exist",
  });

  expect(addCategory).not.toHaveBeenCalled();
  });
});
describe("getCategoryS", () => {
  

  it("should return the category if it exists", async () => {
    const category = {
      name: "Science Fiction",
      slug: "science-fiction",
    };

    vi.mocked(getCategory).mockResolvedValue(category as any);

    const result = await getCategoryS("science-fiction");

    expect(getCategory).toHaveBeenCalledWith("science-fiction");
    expect(result).toEqual(category);
  });

  it("should throw an error if the category does not exist", async () => {
    vi.mocked(getCategory).mockResolvedValue(null as any);

    await expect(
      getCategoryS("unknown-category")
    ).rejects.toMatchObject({
      message: "Category Not Found",
    });

    expect(getCategory).toHaveBeenCalledWith("unknown-category");
  });
});
describe("getCategoriesS", () => {
  

  it("should return all categories", async () => {
    const categories = [
      { name: "Science Fiction", slug: "science-fiction" },
      { name: "History", slug: "history" },
    ];

    vi.mocked(getCategories).mockResolvedValue(categories as any);

    const result = await getCategoriesS();

    expect(getCategories).toHaveBeenCalledOnce();
    expect(result).toEqual(categories);
  });
  it("should return an empty array if no categories exist", async () => {
    vi.mocked(getCategories).mockResolvedValue([]);

    const result = await getCategoriesS();

    expect(getCategories).toHaveBeenCalledOnce();
    expect(result).toEqual([]);
  });
});
describe("deleteCategoryS", () => {
  

  it("should throw an error if the category has books", async () => {
    const books = [
      { id: "book-1", title: "Book One" },
    ];

    vi.mocked(getBooksbyCategory).mockResolvedValue(books as any);

    await expect(
      deleteCategoryS("category-1")
    ).rejects.toMatchObject({
      message: "Category Has Products",
    });

    expect(getBooksbyCategory).toHaveBeenCalledWith("category-1");
    expect(deleteCategory).not.toHaveBeenCalled();
  });

  it("should delete the category if it has no books", async () => {
    vi.mocked(getBooksbyCategory).mockResolvedValue([]);

    vi.mocked(deleteCategory).mockResolvedValue(undefined as any);

    await deleteCategoryS("category-1");

    expect(getBooksbyCategory).toHaveBeenCalledWith("category-1");
    expect(deleteCategory).toHaveBeenCalledWith("category-1");
  });
});
describe("updateCategoryS",()=>{
   
    it("should update the category if it exists",async()=>{
        const existingCategory = {
      id: "category-1",
      name: "Science Fiction",
      slug: "science-fiction",
      description: "Old description",
    };
     const updatedCategory = {
      ...existingCategory,
      description: "New description",
    };
    vi.mocked(getCategory).mockResolvedValue(existingCategory as any);
    vi.mocked(updateCategory).mockResolvedValue(updatedCategory as any);
    const result=await updateCategoryS("science-fiction","New description")
    expect(getCategory).toHaveBeenCalledWith("science-fiction");
    expect(updateCategory).toHaveBeenCalledWith("science-fiction", "New description");
    expect(result).toEqual(updatedCategory);
    })
    it("should throw an error if the category does not exist",async()=>{
        vi.mocked(getCategory).mockResolvedValue(null as any);
        await expect(
            updateCategoryS("unknown-category","New description")).rejects.toMatchObject({
                message:"Category Not Found"
            })
            expect(updateCategory).not.toHaveBeenCalled();
    })
})
})
  