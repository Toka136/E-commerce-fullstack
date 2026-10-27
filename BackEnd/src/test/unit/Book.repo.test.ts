import { beforeEach, describe, expect, it, vi } from "vitest";
import { bookI, insertBookI, queryI } from "../../modules/Books/book.types";
import { deleteBook, findBookById, findBookByName, findBooks, findOnlyBookById, getBooksCount, insertBook, updateBook } from "../../modules/Books/book.repo";

const { mockBook } = vi.hoisted(() => ({
  mockBook: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
}));
vi.mock("../../config/prisma", () => ({
    prisma: {
        book: mockBook,
    },
  }));
describe("Book Repo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
      });
    describe("insertBook",()=>{
        it("should create a book and return it",async()=>{
            const book:insertBookI={
                title:"book",
                author:"author",
                price:100,
                description:"description",
                coverImage:"image",
                stock:10,
                imagePublicId:"1",
                pages:10,
                categoryId:"1"}
                const bookCreate={
                    ...book,
                    id:"1",
                    rate:{create:{}}
                }
                mockBook.create.mockResolvedValue(bookCreate)
                const result=await insertBook(book)
                expect(result).toEqual(bookCreate)
                expect(mockBook.create).toHaveBeenCalledWith({
                    data: {
                        ...book,
                        rate: {
                        create: {},
                        },
                    },
                    });
        })
    })
    describe("findBookByName",()=>{
        it("should find a book by name and return it",async()=>{
            const book={
                id:"1",
                title:"book",
                author:"author",
                price:100,
                description:"description",
                coverImage:"image",
                stock:10,
                imagePublicId:"1",
                pages:10,
                categoryId:"1",
                rate:{average:0,count:0}
            }
            mockBook.findUnique.mockResolvedValue(book)
            const result=await findBookByName("book")
            expect(result).toEqual(book)
            expect(mockBook.findUnique).toHaveBeenCalledWith({where:{title:"book"}})
        })
        it("should return null if the book does not exist",async()=>{
            mockBook.findUnique.mockResolvedValue(null)
            const result=await findBookByName("book")
            expect(result).toBeNull()
            expect(mockBook.findUnique).toHaveBeenCalledWith({where:{title:"book"}})
        })
    })
    describe("findBookById", () => {
    it("should find a book by id and return it with category and rate", async () => {
        const book = {
        id: "1",
        title: "book",
        author: "author",
        price: 100,
        description: "description",
        coverImage: "image",
        stock: 10,
        imagePublicId: "1",
        pages: 10,
        categoryId: "category-1",
        category: {
            id: "category-1",
            name: "Science Fiction",
            slug: "science-fiction",
        },
        rate: {
            average: 4.5,
            count: 10,
        },
        };

        mockBook.findUnique.mockResolvedValue(book);

        const result = await findBookById("1");

        expect(mockBook.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: {
            category: {
            omit: {
                description: true,
            },
            },
            rate: {
            select: {
                average: true,
                count: true,
            },
            },
        },
        });

        expect(result).toEqual(book);
    });

    it("should return null if the book does not exist", async () => {
        mockBook.findUnique.mockResolvedValue(null);

        const result = await findBookById("unknown-id");

        expect(mockBook.findUnique).toHaveBeenCalledWith({
        where: { id: "unknown-id" },
        include: {
            category: {
            omit: {
                description: true,
            },
            },
            rate: {
            select: {
                average: true,
                count: true,
            },
            },
        },
        });

        expect(result).toBeNull();
    });
    });
    describe("findOnlyBookById", () => {
    it("should find a book by id and return it", async () => {
        const book = {
        id: "1",
        title: "book",
        author: "author",
        price: 100,
        description: "description",
        coverImage: "image",
        stock: 10,
        imagePublicId: "1",
        pages: 10,
        categoryId: "category-1",
        };

        mockBook.findUnique.mockResolvedValue(book);

        const result = await findOnlyBookById("1");

        expect(mockBook.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        });

        expect(result).toEqual(book);
    });

    it("should return null if the book does not exist", async () => {
        mockBook.findUnique.mockResolvedValue(null);

        const result = await findOnlyBookById("unknown-id");

        expect(result).toBeNull();
    });
    });
    describe("updateBook", () => {
  it("should update a book and return the updated book", async () => {
    const book: insertBookI = {
      title: "Updated Book",
      author: "Updated Author",
      price: 150,
      description: "Updated description",
      coverImage: "updated-image",
      stock: 20,
      imagePublicId: "updated-1",
      pages: 200,
      categoryId: "category-1",
    };

    const updatedBook = {
      id: "1",
      ...book,
    };

    mockBook.update.mockResolvedValue(updatedBook);

    const result = await updateBook(book, "1");

    expect(mockBook.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: book,
    });

    expect(result).toEqual(updatedBook);
  });
    });
    describe("deleteBook", () => {
        it("should delete a book and return the deleted book", async () => {
            const deletedBook = {
            id: "1",
            title: "book",
            author: "author",
            price: 100,
            description: "description",
            coverImage: "image",
            stock: 10,
            imagePublicId: "1",
            pages: 10,
            categoryId: "category-1",
            };

            mockBook.delete.mockResolvedValue(deletedBook);

            const result = await deleteBook("1");

            expect(mockBook.delete).toHaveBeenCalledWith({
            where: { id: "1" },
            });

            expect(result).toEqual(deletedBook);
        });
    });
    describe("findBooks", () => {
  it("should return books using the provided filter, sorting and pagination", async () => {
    const query = {
      pageSize: 10,
    } as queryI;

    const filter = {
      categoryId: "category-1",
    };

    const sort = {
      title: "asc",
    };

    const books = [
      {
        id: "1",
        title: "Book A",
        category: {
          id: "category-1",
          name: "Science",
          slug: "science",
        },
      },
    ];

    mockBook.findMany.mockResolvedValue(books);

    const result = await findBooks(query, 10, filter, sort);

    expect(mockBook.findMany).toHaveBeenCalledWith({
      where: filter,
      include: {
        category: {
          omit: {
            description: true,
          },
        },
      },
      orderBy: sort,
      skip: 10,
      take: 10,
    });

    expect(result).toEqual(books);
  });

  it("should return an empty array if no books match the filter", async () => {
    const query = {
      pageSize: 10,
    } as queryI;

    mockBook.findMany.mockResolvedValue([]);

    const result = await findBooks(query, 0, { categoryId: "unknown" });

    expect(result).toEqual([]);
  });
    });
    describe("getBooksCount", () => {
        it("should return the number of books matching the filter", async () => {
            const filter = {
            categoryId: "category-1",
            };

            mockBook.count.mockResolvedValue(5);

            const result = await getBooksCount(filter);

            expect(mockBook.count).toHaveBeenCalledWith({
            where: filter,
            });

            expect(result).toBe(5);
        });

        it("should return zero if no books match the filter", async () => {
            mockBook.count.mockResolvedValue(0);

            const result = await getBooksCount({
            categoryId: "unknown",
            });

            expect(result).toBe(0);
            
        });
});
})