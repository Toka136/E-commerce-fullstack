import { describe, it, expect, vi, beforeEach } from "vitest";
import { addCategory, getCategory, getCategories, deleteCategory, updateCategory } from "../../modules/Categories/Category.repo";
import { categoryI } from "../../modules/Categories/Category.types";

const { mockCategory } = vi.hoisted(() => ({
  mockCategory: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    category: mockCategory,
  },
}));

describe("Category Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addCategory", () => {
    it("should create a category and return it", async () => {
      const category: categoryI = {
        name: "Science Fiction",
        description: "Science fiction books",
        slug: "science-fiction",
      };

      const createdCategory = {
        id: "category-1",
        ...category,
      };

      mockCategory.create.mockResolvedValue(createdCategory);

      const result = await addCategory(category);

      expect(mockCategory.create).toHaveBeenCalledWith({
        data: category,
      });

      expect(result).toEqual(createdCategory);
    });
  });

  describe("getCategory", () => {
    it("should find a category by slug and return it", async () => {
      const category = {
        id: "category-1",
        name: "Science Fiction",
        description: "Science fiction books",
        slug: "science-fiction",
      };

      mockCategory.findUnique.mockResolvedValue(category);

      const result = await getCategory("science-fiction");

      expect(mockCategory.findUnique).toHaveBeenCalledWith({
        where: { slug: "science-fiction" },
      });

      expect(result).toEqual(category);
    });

    it("should return null if the category does not exist", async () => {
      mockCategory.findUnique.mockResolvedValue(null);

      const result = await getCategory("unknown-category");

      expect(result).toBeNull();
    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const categories = [
        {
          id: "category-1",
          name: "Science Fiction",
          description: "Science fiction books",
          slug: "science-fiction",
        },
        {
          id: "category-2",
          name: "Fantasy",
          description: "Fantasy books",
          slug: "fantasy",
        },
      ];

      mockCategory.findMany.mockResolvedValue(categories);

      const result = await getCategories();

      expect(mockCategory.findMany).toHaveBeenCalledOnce();
      expect(result).toEqual(categories);
    });

    it("should return an empty array if there are no categories", async () => {
      mockCategory.findMany.mockResolvedValue([]);

      const result = await getCategories();

      expect(result).toEqual([]);
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category by id and return the deleted category", async () => {
      const deletedCategory = {
        id: "category-1",
        name: "Science Fiction",
        description: "Science fiction books",
        slug: "science-fiction",
      };

      mockCategory.delete.mockResolvedValue(deletedCategory);

      const result = await deleteCategory("category-1");

      expect(mockCategory.delete).toHaveBeenCalledWith({
        where: { id: "category-1" },
      });

      expect(result).toEqual(deletedCategory);
    });
  });

  describe("updateCategory", () => {
    it("should update a category description and return the updated category", async () => {
      const updatedCategory = {
        id: "category-1",
        name: "Science Fiction",
        description: "Updated description",
        slug: "science-fiction",
      };

      mockCategory.update.mockResolvedValue(updatedCategory);

      const result = await updateCategory(
        "science-fiction",
        "Updated description"
      );

      expect(mockCategory.update).toHaveBeenCalledWith({
        where: { slug: "science-fiction" },
        data: { description: "Updated description" },
      });

      expect(result).toEqual(updatedCategory);
    });
  });
});