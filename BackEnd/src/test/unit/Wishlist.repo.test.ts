import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockWishList } = vi.hoisted(() => ({
  mockWishList: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    wishList: mockWishList,
  },
}));

import {
  addBookW,
  getWishList,
  getWishListByUserId,
  addEmptyWishList,
  addWishList,
  deleteBookW,
  deleteWishList,
  WHasBook,
} from "../../modules/Wishlist/WishList.repo";

describe("Wishlist.repo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================
  // addBookW
  // =========================
  describe("addBookW", () => {
    it("should add a book to the wishlist", async () => {
      const bookId = "book-1";
      const userId = "user-1";

      const updatedWishlist = {
        id: "wishlist-1",
        userId,
        items: [{ id: bookId }],
      };

      mockWishList.update.mockResolvedValue(updatedWishlist);

      const result = await addBookW(bookId, userId);

      expect(mockWishList.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          items: {
            connect: { id: bookId },
          },
        },
      });

      expect(result).toEqual(updatedWishlist);
    });
  });

  // =========================
  // getWishList
  // =========================
  describe("getWishList", () => {
    it("should return the user's wishlist with selected book fields", async () => {
      const userId = "user-1";

      const wishlist = {
        id: "wishlist-1",
        userId,
        items: [
          {
            id: "book-1",
            title: "JavaScript",
            coverImage: "book.jpg",
            price: 100,
            stock: 5,
            author: "John",
          },
        ],
      };

      mockWishList.findUnique.mockResolvedValue(wishlist);

      const result = await getWishList(userId);

      expect(mockWishList.findUnique).toHaveBeenCalledWith({
        where: { userId },
        include: {
          items: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              price: true,
              stock: true,
              author: true,
            },
          },
        },
      });

      expect(result).toEqual(wishlist);
    });

    it("should return null if the wishlist does not exist", async () => {
      mockWishList.findUnique.mockResolvedValue(null);

      const result = await getWishList("user-1");

      expect(result).toBeNull();
    });
  });

  // =========================
  // getWishListByUserId
  // =========================
  describe("getWishListByUserId", () => {
    it("should find a wishlist using the default Prisma client", async () => {
      const userId = "user-1";
      const wishlist = {
        id: "wishlist-1",
        userId,
        items: [],
      };

      mockWishList.findUnique.mockResolvedValue(wishlist);

      const result = await getWishListByUserId(userId);

      expect(mockWishList.findUnique).toHaveBeenCalledWith({
        where: { userId },
        include: {
          items: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              price: true,
              stock: true,
              author: true,
            },
          },
        },
      });

      expect(result).toEqual(wishlist);
    });

    it("should use the provided transaction client", async () => {
      const userId = "user-1";

      const txFindUnique = vi.fn().mockResolvedValue({
        id: "wishlist-1",
        userId,
        items: [],
      });

      const tx = {
        wishList: {
          findUnique: txFindUnique,
        },
      };

      const result = await getWishListByUserId(
        userId,
        tx as any
      );

      expect(txFindUnique).toHaveBeenCalledWith({
        where: { userId },
        include: {
          items: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              price: true,
              stock: true,
              author: true,
            },
          },
        },
      });

      expect(mockWishList.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: "wishlist-1",
        userId,
        items: [],
      });
    });
  });

  // =========================
  // addEmptyWishList
  // =========================
  describe("addEmptyWishList", () => {
    it("should create an empty wishlist for the user", async () => {
      const userId = "user-1";

      const wishlist = {
        id: "wishlist-1",
        userId,
        items: [],
      };

      mockWishList.create.mockResolvedValue(wishlist);

      const result = await addEmptyWishList(userId);

      expect(mockWishList.create).toHaveBeenCalledWith({
        data: { userId },
      });

      expect(result).toEqual(wishlist);
    });
  });

  // =========================
  // addWishList
  // =========================
  describe("addWishList", () => {
    it("should create a wishlist and connect the provided books", async () => {
      const userId = "user-1";
      const items = ["book-1", "book-2"];

      const createdWishlist = {
        id: "wishlist-1",
        userId,
        items: [{ id: "book-1" }, { id: "book-2" }],
      };

      mockWishList.create.mockResolvedValue(createdWishlist);

      const result = await addWishList(userId, items);

      expect(mockWishList.create).toHaveBeenCalledWith({
        data: {
          userId,
          items: {
            connect: items.map((id) => ({ id })),
          },
        },
      });

      expect(result).toEqual(createdWishlist);
    });

    it("should create a wishlist with no books when items is empty", async () => {
      const userId = "user-1";
      const items: string[] = [];

      const createdWishlist = {
        id: "wishlist-1",
        userId,
        items: [],
      };

      mockWishList.create.mockResolvedValue(createdWishlist);

      const result = await addWishList(userId, items);

      expect(mockWishList.create).toHaveBeenCalledWith({
        data: {
          userId,
          items: {
            connect: [],
          },
        },
      });

      expect(result).toEqual(createdWishlist);
    });
  });

  // =========================
  // deleteBookW
  // =========================
  describe("deleteBookW", () => {
    it("should remove a book from the wishlist", async () => {
      const userId = "user-1";
      const bookId = "book-1";

      const updatedWishlist = {
        id: "wishlist-1",
        userId,
        items: [],
      };

      mockWishList.update.mockResolvedValue(updatedWishlist);

      const result = await deleteBookW(userId, bookId);

      expect(mockWishList.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          items: {
            disconnect: { id: bookId },
          },
        },
      });

      expect(result).toEqual(updatedWishlist);
    });

    it("should use the provided transaction client", async () => {
      const userId = "user-1";
      const bookId = "book-1";

      const txUpdate = vi.fn().mockResolvedValue({
        id: "wishlist-1",
        userId,
        items: [],
      });

      const tx = {
        wishList: {
          update: txUpdate,
        },
      };

      const result = await deleteBookW(
        userId,
        bookId,
        tx as any
      );

      expect(txUpdate).toHaveBeenCalledWith({
        where: { userId },
        data: {
          items: {
            disconnect: { id: bookId },
          },
        },
      });

      expect(mockWishList.update).not.toHaveBeenCalled();

      expect(result).toEqual({
        id: "wishlist-1",
        userId,
        items: [],
      });
    });
  });

  // =========================
  // deleteWishList
  // =========================
  describe("deleteWishList", () => {
    it("should delete the user's wishlist", async () => {
      const userId = "user-1";

      const deletedWishlist = {
        id: "wishlist-1",
        userId,
        items: [],
      };

      mockWishList.delete.mockResolvedValue(deletedWishlist);

      const result = await deleteWishList(userId);

      expect(mockWishList.delete).toHaveBeenCalledWith({
        where: { userId },
      });

      expect(result).toEqual(deletedWishlist);
    });
  });

  // =========================
  // WHasBook
  // =========================
  describe("WHasBook", () => {
    it("should return the wishlist when the book exists in it", async () => {
      const userId = "user-1";
      const bookId = "book-1";

      const wishlist = {
        id: "wishlist-1",
      };

      mockWishList.findFirst.mockResolvedValue(wishlist);

      const result = await WHasBook(userId, bookId);

      expect(mockWishList.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          items: {
            some: {
              id: bookId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      expect(result).toEqual(wishlist);
    });

    it("should return null when the book is not in the wishlist", async () => {
      mockWishList.findFirst.mockResolvedValue(null);

      const result = await WHasBook("user-1", "book-1");

      expect(result).toBeNull();
    });

    it("should use the provided transaction client", async () => {
      const userId = "user-1";
      const bookId = "book-1";

      const txFindFirst = vi.fn().mockResolvedValue({
        id: "wishlist-1",
      });

      const tx = {
        wishList: {
          findFirst: txFindFirst,
        },
      };

      const result = await WHasBook(
        userId,
        bookId,
        tx as any
      );

      expect(txFindFirst).toHaveBeenCalledWith({
        where: {
          userId,
          items: {
            some: {
              id: bookId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      expect(mockWishList.findFirst).not.toHaveBeenCalled();

      expect(result).toEqual({
        id: "wishlist-1",
      });
    });
  });
});