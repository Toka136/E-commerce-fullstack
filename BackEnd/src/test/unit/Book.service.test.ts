
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addBook_S, deleteBook_S, editBook_S, getBook_S, getBooks_S } from "../../modules/Books/book.service";
import { editBookI, insertBookI } from "../../modules/Books/book.types";
import { getBookReviews } from "../../modules/Reviews/review.repo";
import e from "express";
import { mock } from "node:test";

// Prepare mocks
const {
  mockGetCategory,
  mockFindBookByName,
  mockInsertBook,
  mockFindBookById,
  mockUpdateBook,
  mockDeleteBook,
  mockFindBooks,
  mockGetBooksCount,
  mockGetBookReviews,
  mockRedisGet,
  mockRedisSet,
  mockInvalidateCache,
  mockUploadToCloudinary,
  mockCloudinaryDestroy,
} = vi.hoisted(() => ({
  mockGetCategory: vi.fn(),
  mockFindBookByName: vi.fn(),
  mockInsertBook: vi.fn(),
  mockFindBookById: vi.fn(),
  mockUpdateBook: vi.fn(),
  mockDeleteBook: vi.fn(),
  mockFindBooks: vi.fn(),
  mockGetBooksCount: vi.fn(),
  mockGetBookReviews: vi.fn(),
  mockRedisGet: vi.fn(),
  mockRedisSet: vi.fn(),
  mockInvalidateCache: vi.fn(),
  mockUploadToCloudinary: vi.fn(),
  mockCloudinaryDestroy: vi.fn(),
}));

// Mock repositories
vi.mock("../../modules/Categories/Category.repo", () => ({
  getCategory: mockGetCategory,
}));

vi.mock("../../modules/Books/book.repo", () => ({
  findBookByName: mockFindBookByName,
  insertBook: mockInsertBook,
  findBookById: mockFindBookById,
  updateBook: mockUpdateBook,
  deleteBook: mockDeleteBook,
  findBooks: mockFindBooks,
  getBooksCount: mockGetBooksCount,
}));

vi.mock("../../modules/Reviews/review.repo", () => ({
  getBookReviews: mockGetBookReviews,
}));

// Mock Redis
vi.mock("../../config/redis", () => ({
  default: {
    get: mockRedisGet,
    set: mockRedisSet,
  },
}));

// Mock cache invalidation
vi.mock("../../utils/invalidateCache", () => ({
  default: mockInvalidateCache,
}));

// Mock Cloudinary upload
vi.mock("../../utils/uploadToCloudinary", () => ({
  uploadToCloudinary: mockUploadToCloudinary,
}));

// Mock Cloudinary deletion
vi.mock("../../config/cloudinaryconfig", () => ({
  default: {
    uploader: {
      destroy: mockCloudinaryDestroy,
    },
  },
}));

describe("Book Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addBook_S", () => {
    const body = {
      title: "Clean Code",
      author: "Robert C. Martin",
      slug: "programming",
      price: 100,
      description: "A programming book",
      stock: 10,
      pages: 300,
      coverImage: "https://example.com/book.jpg",
    };

    const file = {
      buffer: Buffer.from("fake image"),
    } as Express.Multer.File;

    const category = {
      id: "category-1",
      name: "Programming",
      slug: "programming",
    };

    const uploadedImage = {
      secure_url: "https://example.com/book.jpg",
      public_id: "books/book-1",
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });
    it("should throw an error if the category does not exist", async () => {
      mockGetCategory.mockResolvedValue(null);

      await expect(addBook_S(body, file)).rejects.toThrow(
        "Category Not Found"
      );

      expect(mockGetCategory).toHaveBeenCalledWith(body.slug);
      expect(mockFindBookByName).not.toHaveBeenCalled();
      expect(mockInsertBook).not.toHaveBeenCalled();
    });

    it("should throw an error if the book already exists", async () => {
      mockGetCategory.mockResolvedValue(category);

      mockFindBookByName.mockResolvedValue({
        id: "existing-book",
        title: body.title,
      });

      await expect(addBook_S(body, file)).rejects.toThrow(
        "Book Already Exists"
      );

      expect(mockFindBookByName).toHaveBeenCalledWith(body.title);
      expect(mockUploadToCloudinary).not.toHaveBeenCalled();
      expect(mockInsertBook).not.toHaveBeenCalled();
    });

    it("should upload the image and create the book successfully", async () => {
      mockGetCategory.mockResolvedValue(category);
      mockFindBookByName.mockResolvedValue(null);
      mockUploadToCloudinary.mockResolvedValue(uploadedImage);

      const createdBook = {
        id: "book-1",
        title: body.title,
        author: body.author,
        categoryId: category.id,
        price: 100,
        description: body.description,
        stock: 10,
        coverImage: uploadedImage.secure_url,
        pages: 300,
        imagePublicId: uploadedImage.public_id,
      };

      mockInsertBook.mockResolvedValue(createdBook);
      mockInvalidateCache.mockResolvedValue(undefined);

      const result = await addBook_S(body, file);

      expect(mockGetCategory).toHaveBeenCalledWith(body.slug);
      expect(mockFindBookByName).toHaveBeenCalledWith(body.title);

      expect(mockUploadToCloudinary).toHaveBeenCalledWith(
        file.buffer,
        "books"
      );

      expect(mockInsertBook).toHaveBeenCalledWith({
        title: body.title,
        author: body.author,
        categoryId: category.id,
        price: 100,
        description: body.description,
        stock: 10,
        coverImage: uploadedImage.secure_url,
        pages: 300,
        imagePublicId: uploadedImage.public_id,
      });

      expect(mockInvalidateCache).toHaveBeenCalledWith("books:list:");
      expect(result).toEqual(createdBook);
      expect(mockCloudinaryDestroy).not.toHaveBeenCalled();
    });

    it("should delete the uploaded image if creating the book fails", async () => {
      mockGetCategory.mockResolvedValue(category);
      mockFindBookByName.mockResolvedValue(null);
      mockUploadToCloudinary.mockResolvedValue(uploadedImage);

      const databaseError = new Error("Database error");

      mockInsertBook.mockRejectedValue(databaseError);
      mockCloudinaryDestroy.mockResolvedValue({ result: "ok" });

      await expect(addBook_S(body, file)).rejects.toThrow(
        "Database error"
      );

      expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
        uploadedImage.public_id
      );

      expect(mockInvalidateCache).not.toHaveBeenCalled();
    });
  });


  describe("editBook_S", () => {
    const body: editBookI = {
      id: "1",
      title: "Updated Book",
      author: "Updated Author",
      price: 150,
      description: "Updated description",
      stock: 20,
      pages: 200,
      slug: "programming",
    };

    const file = {
      buffer: Buffer.from("fake image"),
    } as Express.Multer.File;

    const category = {
      id: "category-1",
      name: "Programming",
      slug: "programming",
    };

    const uploadedImage = {
      secure_url: "https://example.com/book.jpg",
      public_id: "books/book-1",
    };

    const existingBook = {
      id: "1",
      title: "Old Book",
      author: "Old Author",
      categoryId: "category-1",
      price: {
        toNumber: () => 100,
      },
      description: "Old description",
      stock: 10,
      coverImage: "",
      imagePublicId: "",
      pages: 100,
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should throw an error if the book does not exist", async () => {
      mockFindBookById.mockResolvedValue(null);

      await expect(editBook_S(body, file)).rejects.toThrow(
        "Book Not Found"
      );

      expect(mockFindBookById).toHaveBeenCalledWith("1");
      expect(mockGetCategory).not.toHaveBeenCalled();
      expect(mockUpdateBook).not.toHaveBeenCalled();
    });

    it("should throw an error if the category does not exist", async () => {
      mockFindBookById.mockResolvedValue(existingBook);
      mockGetCategory.mockResolvedValue(null);

      await expect(editBook_S(body, file)).rejects.toThrow(
        "Category Not Found"
      );

      expect(mockFindBookById).toHaveBeenCalledWith("1");
      expect(mockGetCategory).toHaveBeenCalledWith("programming");
      expect(mockUpdateBook).not.toHaveBeenCalled();
    });

    it("should update the book successfully with a new image", async () => {
      mockFindBookById.mockResolvedValue(existingBook);
      mockGetCategory.mockResolvedValue(category);
      mockUploadToCloudinary.mockResolvedValue(uploadedImage);

      const updatedBook = {
        ...existingBook,
        title: "Old Book",
        author: "Updated Author",
        categoryId: "category-1",
        price: 150,
        description: "Updated description",
        stock: 20,
        coverImage: uploadedImage.secure_url,
        imagePublicId: uploadedImage.public_id,
        pages: 200,
      };

      mockUpdateBook.mockResolvedValue(updatedBook);
      mockInvalidateCache.mockResolvedValue(undefined);

      const result = await editBook_S(body, file);

      expect(mockFindBookById).toHaveBeenCalledWith("1");
      expect(mockGetCategory).toHaveBeenCalledWith("programming");

      expect(mockUploadToCloudinary).toHaveBeenCalledWith(
        file.buffer,
        "books"
      );

      expect(mockUpdateBook).toHaveBeenCalledWith(
        {
          title: "Old Book",
          author: "Updated Author",
          categoryId: "category-1",
          price: 150,
          description: "Updated description",
          stock: 20,
          coverImage: uploadedImage.secure_url,
          imagePublicId: uploadedImage.public_id,
          pages: 200,
        },
        "1"
      );

      expect(mockInvalidateCache).toHaveBeenCalledWith("books:list:");
      expect(mockInvalidateCache).toHaveBeenCalledWith("book:1");

      expect(result).toEqual(updatedBook);
      expect(mockCloudinaryDestroy).not.toHaveBeenCalled();
    });

    it("should throw an error if the book has no old image and no new image is provided", async () => {
      mockFindBookById.mockResolvedValue(existingBook);

      await expect(editBook_S(body)).rejects.toThrow(
        "Book Cover Image Is Required"
      );

      expect(mockUpdateBook).not.toHaveBeenCalled();
    });
  });
  describe("deleteBook_S", () => {
    const existingBook = {
      id: "1",
      title: "Old Book",
      author: "Old Author",
      categoryId: "category-1",
      price: {
        toNumber: () => 100,
      },
      description: "Old description",
      stock: 10,
      coverImage: "https://example.com/book.jpg",
      imagePublicId: "books/book-1",
      pages: 100,
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should throw an error if the book does not exist", async () => {
      mockFindBookById.mockResolvedValue(null);

      await expect(deleteBook_S("1")).rejects.toThrow(
        "Book Not Found"
      );

      expect(mockFindBookById).toHaveBeenCalledWith("1");
      expect(mockDeleteBook).not.toHaveBeenCalled();
      expect(mockCloudinaryDestroy).not.toHaveBeenCalled();
      expect(mockInvalidateCache).not.toHaveBeenCalled();
    });

   it("should delete the book successfully", async () => {
  mockFindBookById.mockResolvedValue(existingBook);
  mockDeleteBook.mockResolvedValue(existingBook);
  mockInvalidateCache.mockResolvedValue(undefined);
  mockCloudinaryDestroy.mockResolvedValue({ result: "ok" });

  await deleteBook_S("1");

  expect(mockFindBookById).toHaveBeenCalledWith("1");
  expect(mockDeleteBook).toHaveBeenCalledWith("1");

  expect(mockCloudinaryDestroy).toHaveBeenCalledWith(
    "books/book-1"
  );

  expect(mockInvalidateCache).toHaveBeenCalledWith("books:list:");
  expect(mockInvalidateCache).toHaveBeenCalledWith("book:1");
    });

  });

  describe("getBook_S", () => {
    const existingBook = {
      id: "1",
      title: "Old Book",
      author: "Old Author",
      categoryId: "category-1",
      price: {
        toNumber: () => 100,
      },
      description: "Old description",
      stock: 10,
      coverImage: "https://example.com/book.jpg",
      imagePublicId: "books/book-1",
      pages: 100,
    };

    const bookReviews = [
      {
        id: "1",
        bookId: "1",
        userId: "1",
        rating: 5,
        review: "Great book!",
      },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return the book and reviews from cache", async () => {
      const cachedData = {
        book: existingBook,
        bookReviews,
      };

      mockRedisGet.mockResolvedValue(cachedData);

      const result = await getBook_S("1");

      expect(mockRedisGet).toHaveBeenCalledWith("book:1");
      expect(result).toEqual(cachedData);

      expect(mockFindBookById).not.toHaveBeenCalled();
      expect(mockGetBookReviews).not.toHaveBeenCalled();
      expect(mockRedisSet).not.toHaveBeenCalled();
    });

    it("should throw an error if the book does not exist", async () => {
      mockRedisGet.mockResolvedValue(null);
      mockFindBookById.mockResolvedValue(null);

      await expect(getBook_S("1")).rejects.toThrow("Book Not Found");

      expect(mockRedisGet).toHaveBeenCalledWith("book:1");
      expect(mockFindBookById).toHaveBeenCalledWith("1");

      expect(mockGetBookReviews).not.toHaveBeenCalled();
      expect(mockRedisSet).not.toHaveBeenCalled();
    });

    it("should return the book and reviews from the database", async () => {
      mockRedisGet.mockResolvedValue(null);
      mockFindBookById.mockResolvedValue(existingBook);
      mockGetBookReviews.mockResolvedValue(bookReviews);
      mockRedisSet.mockResolvedValue(undefined);

      const result = await getBook_S("1");

      const expectedData = {
        book: existingBook,
        bookReviews,
      };

      expect(mockRedisGet).toHaveBeenCalledWith("book:1");
      expect(mockFindBookById).toHaveBeenCalledWith("1");
      expect(mockGetBookReviews).toHaveBeenCalledWith("1");

      expect(result).toEqual(expectedData);

      expect(mockRedisSet).toHaveBeenCalledWith(
        "book:1",
        JSON.stringify(expectedData),
        { ex: 300 }
      );
    });
  });
describe("getBooks_S", () => {
  const mockBooks = [
    {
      id: "1",
      title: "Book One",
      author: "Author One",
      price: 100,
      description: "First book",
      stock: 10,
      categoryId: "category-1",
    },
    {
      id: "2",
      title: "Book Two",
      author: "Author Two",
      price: 200,
      description: "Second book",
      stock: 5,
      categoryId: "category-1",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockRedisGet.mockResolvedValue(null);
    mockFindBooks.mockResolvedValue(mockBooks);
    mockGetBooksCount.mockResolvedValue(20);
    mockRedisSet.mockResolvedValue("OK");
  });

  // 1. Default pagination and sorting
  it("should return books with default pagination and sorting", async () => {
    const query = {};

    const result = await getBooks_S(query);

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
      }),
      0,
      {},
      [{ createdAt: "desc" }, { id: "desc" }]
    );

    expect(mockGetBooksCount).toHaveBeenCalledWith({});

    expect(result).toEqual({
      books: mockBooks,
      currentPage: 1,
      pageSize: 10,
      totalPage: 2,
      totalCount: 20,
    });

    expect(mockRedisSet).toHaveBeenCalledWith(
      "books:list:1:10:::::newest",
      JSON.stringify(result),
      { ex: 60 }
    );
  });

  // 2. Custom pagination
  it("should apply custom pagination", async () => {
    const query = {
      currentPage: 3,
      pageSize: 5,
    };

    const result = await getBooks_S(query);

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 5,
      }),
      10,
      {},
      [{ createdAt: "desc" }, { id: "desc" }]
    );

    expect(result.currentPage).toBe(3);
    expect(result.pageSize).toBe(5);
    expect(result.totalPage).toBe(4);
  });

  // 3. Search by text
  it("should filter books by search text", async () => {
    const query = {
      searchText: "JavaScript",
    };

    await getBooks_S(query);

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
      }),
      0,
      {
        OR: [
          {
            title: {
              contains: "JavaScript",
              mode: "insensitive",
            },
          },
          {
            author: {
              contains: "JavaScript",
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: "JavaScript",
              mode: "insensitive",
            },
          },
        ],
      },
      [{ createdAt: "desc" }, { id: "desc" }]
    );
  });

  // 4. Filter by category
  it("should filter books by category", async () => {
    mockGetCategory.mockResolvedValue({
      id: "category-1",
      name: "Programming",
      slug: "programming",
    });

    const query = {
      category: "programming",
    };

    await getBooks_S(query);

    expect(mockGetCategory).toHaveBeenCalledWith("programming");

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
      }),
      0,
      {
        categoryId: "category-1",
      },
      [{ createdAt: "desc" }, { id: "desc" }]
    );
  });

  // 5. Category does not exist
  it("should throw an error if the category does not exist", async () => {
    mockGetCategory.mockResolvedValue(null);

    const query = {
      category: "unknown-category",
    };

    await expect(getBooks_S(query)).rejects.toThrow(
      "Category Not Found"
    );

    expect(mockGetCategory).toHaveBeenCalledWith("unknown-category");

    expect(mockFindBooks).not.toHaveBeenCalled();
    expect(mockGetBooksCount).not.toHaveBeenCalled();
    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  // 6. Filter by price range
  it("should filter books by minimum and maximum price", async () => {
    const query = {
      minPrice: 100,
      maxPrice: 500,
    };

    await getBooks_S(query);

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
      }),
      0,
      {
        price: {
          gte: 100,
          lte: 500,
        },
      },
      [{ createdAt: "desc" }, { id: "desc" }]
    );

    expect(mockGetBooksCount).toHaveBeenCalledWith({
      price: {
        gte: 100,
        lte: 500,
      },
    });
  });

  // 7. Sort by price ascending
  it("should sort books by price ascending", async () => {
    const query = {
      sort: "price-asc",
    };

    await getBooks_S(query);

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
      }),
      0,
      {},
      [{ price: "asc" }, { id: "asc" }]
    );
  });

  // 8. Sort by price descending
  it("should sort books by price descending", async () => {
    const query = {
      sort: "price-desc",
    };

    await getBooks_S(query);

    expect(mockFindBooks).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 10,
      }),
      0,
      {},
      [{ price: "desc" }, { id: "desc" }]
    );
  });

  // 9. Return data from Redis cache
  it("should return cached books without querying the database", async () => {
    const cachedData = {
      books: mockBooks,
      currentPage: 1,
      pageSize: 10,
      totalPage: 2,
      totalCount: 20,
    };

    mockRedisGet.mockResolvedValue(cachedData);

    const result = await getBooks_S({});

    expect(mockRedisGet).toHaveBeenCalledWith(
      "books:list:1:10:::::newest"
    );

    expect(result).toEqual(cachedData);

    expect(mockFindBooks).not.toHaveBeenCalled();
    expect(mockGetBooksCount).not.toHaveBeenCalled();
    expect(mockRedisSet).not.toHaveBeenCalled();
  });

  // 10. Return cached JSON string
  it("should parse cached JSON string", async () => {
    const cachedData = {
      books: mockBooks,
      currentPage: 1,
      pageSize: 10,
      totalPage: 2,
      totalCount: 20,
    };

    mockRedisGet.mockResolvedValue(JSON.stringify(cachedData));

    const result = await getBooks_S({});

    expect(result).toEqual(cachedData);

    expect(mockFindBooks).not.toHaveBeenCalled();
    expect(mockGetBooksCount).not.toHaveBeenCalled();
  });

  // 11. Empty database result
  it("should return empty books when no books are found", async () => {
    mockFindBooks.mockResolvedValue([]);
    mockGetBooksCount.mockResolvedValue(0);

    const result = await getBooks_S({});

    expect(result).toEqual({
      books: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalCount: 0,
    });

    expect(mockRedisSet).toHaveBeenCalledWith(
      "books:list:1:10:::::newest",
      JSON.stringify(result),
      { ex: 60 }
    );
  });
});






});
