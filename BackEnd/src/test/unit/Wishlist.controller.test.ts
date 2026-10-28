import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import {
  getWishListC,
  addBookWishListC,
  deleteBookWC,
//   moveToCartC,
} from "../../modules/Wishlist/WishList.controller";
import { responseStatus } from "../../utils/responseStatus";
import appError from "../../utils/errorClass";

const {
  mockGetWishListS,
  mockAddBookWishListS,
  mockDeleteBookWS,
  mockMoveToCartS,
} = vi.hoisted(() => ({
  mockGetWishListS: vi.fn(),
  mockAddBookWishListS: vi.fn(),
  mockDeleteBookWS: vi.fn(),
  mockMoveToCartS: vi.fn(),
}));

vi.mock("../../modules/Wishlist/WishList.service", () => ({
  getWishListS: mockGetWishListS,
  addBookWishListS: mockAddBookWishListS,
  deleteBookWS: mockDeleteBookWS,
  moveToCartS: mockMoveToCartS,
}));

describe("Wishlist Controller", () => {
  let req: Partial<Request> & { user?: { id: string } };
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
     user: {
     id: "user-1",
     email: "test@example.com",
     role: "USER",
     },
      body: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    next = vi.fn();
  });

  describe("getWishListC", () => {
    it("should return the wishlist", async () => {
      const wishList = {
        id: "wishlist-1",
        userId: "user-1",
        items: [{ id: "book-1" }],
      };

      mockGetWishListS.mockResolvedValue(wishList);

      await getWishListC(
        req as Request,
        res as Response,
        next
      );

      expect(mockGetWishListS).toHaveBeenCalledWith("user-1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(wishList);
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if user is not logged in", async () => {
      req.user = { id: "", email: "", role: "" };

      await getWishListC(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledOnce();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "You are not logged in",
          statusCode: 401,
          statusText: responseStatus.FAILED,
        })
      );

      expect(mockGetWishListS).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should pass service errors to next", async () => {
      const error = new Error("Wishlist service failed");
      mockGetWishListS.mockRejectedValue(error);

      await getWishListC(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("addBookWishListC", () => {
    it("should add a book to the wishlist", async () => {
      req.body = { bookId: "book-1" };
      mockAddBookWishListS.mockResolvedValue("book-1");

      await addBookWishListC(
        req as Request,
        res as Response,
        next
      );

      expect(mockAddBookWishListS).toHaveBeenCalledWith(
        "user-1",
        "book-1"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book Added Successfully",
        data: "book-1",
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if user is not logged in", async () => {
      req.user = { id: "", email: "", role: "" };
      req.body = { bookId: "book-1" };

      await addBookWishListC(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "You are not logged in",
          statusCode: 401,
          statusText: responseStatus.FAILED,
        })
      );

      expect(mockAddBookWishListS).not.toHaveBeenCalled();
    });

    it("should pass service errors to next", async () => {
      req.body = { bookId: "book-1" };

      const error = new Error("Failed to add book");
      mockAddBookWishListS.mockRejectedValue(error);

      await addBookWishListC(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteBookWC", () => {
    it("should delete a book from the wishlist", async () => {
      req.body = { bookId: "book-1" };
      mockDeleteBookWS.mockResolvedValue("book-1");

      await deleteBookWC(
        req as Request,
        res as Response,
        next
      );

      expect(mockDeleteBookWS).toHaveBeenCalledWith(
        "user-1",
        "book-1"
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book Deleted Successfully",
        data: "book-1",
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if user is not logged in", async () => {
      req.user = { id: "", email: "", role: ""  };
      req.body = { bookId: "book-1" };

      await deleteBookWC(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "You are not logged in",
          statusCode: 401,
          statusText: responseStatus.FAILED,
        })
      );

      expect(mockDeleteBookWS).not.toHaveBeenCalled();
    });

    it("should pass service errors to next", async () => {
      req.body = { bookId: "book-1" };

      const error = new Error("Failed to delete book");
      mockDeleteBookWS.mockRejectedValue(error);

      await deleteBookWC(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

//   describe("moveToCartC", () => {
//     it("should move a product to the cart", async () => {
//       req.body = { productId: "product-1" };
//       mockMoveToCartS.mockResolvedValue("product-1");

//       await moveToCartC(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(mockMoveToCartS).toHaveBeenCalledWith(
//         "user-1",
//         "product-1"
//       );

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({
//         status: "success",
//         message: "Product Deleted Successfully",
//         data: "product-1",
//       });

//       expect(next).not.toHaveBeenCalled();
//     });

//     it("should throw an error if user is not logged in", async () => {
//       req.user = undefined;
//       req.body = { productId: "product-1" };

//       await moveToCartC(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(next).toHaveBeenCalledWith(
//         expect.objectContaining({
//           message: "You are not logged in",
//           statusCode: 401,
//           statusText: responseStatus.FAILED,
//         })
//       );

//       expect(mockMoveToCartS).not.toHaveBeenCalled();
//     });

//     it("should pass service errors to next", async () => {
//       req.body = { productId: "product-1" };

//       const error = new Error("Failed to move product to cart");
//       mockMoveToCartS.mockRejectedValue(error);

//       await moveToCartC(
//         req as Request,
//         res as Response,
//         next
//       );

//       expect(next).toHaveBeenCalledWith(error);
//     });
//   });
});