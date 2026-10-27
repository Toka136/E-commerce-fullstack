import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";

// Prepare mocks before mocking the service module
const {
  mockAddBookS,
  mockEditBookS,
  mockDeleteBookS,
  mockGetBookS,
  mockGetBooksS,
} = vi.hoisted(() => ({
  mockAddBookS: vi.fn(),
  mockEditBookS: vi.fn(),
  mockDeleteBookS: vi.fn(),
  mockGetBookS: vi.fn(),
  mockGetBooksS: vi.fn(),
}));

vi.mock("../../modules/Books/book.service", () => ({
  addBook_S: mockAddBookS,
  editBook_S: mockEditBookS,
  deleteBook_S: mockDeleteBookS,
  getBook_S: mockGetBookS,
  getBooks_S: mockGetBooksS,
}));

import {
  addBook_C,
  updateBook_C,
  deleteBook_C,
  getBook_C,
  getBooks_C,
} from "../../modules/Books/book.controller";

describe("Book Controller", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      body: {},
      params: {},
      query: {},
      file: undefined,
    } as unknown as Request;

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    next = vi.fn() as unknown as NextFunction;
  });

  // =========================
  // addBook_C
  // =========================
  describe("addBook_C", () => {
    it("should add a book successfully", async () => {
      const body = {
        title: "JavaScript Book",
        author: "John",
        price: "100",
        description: "A book about JavaScript",
        stock: "10",
        pages: "200",
        slug: "programming",
        };

      const file = {
        originalname: "book.jpg",
      } as Express.Multer.File;

      const serviceResult = {
        id: "1",
        title: "JavaScript Book",
      };

      req.body = body;
      req.file = file;

      mockAddBookS.mockResolvedValue(serviceResult);

      await addBook_C(req, res, next);

      expect(mockAddBookS).toHaveBeenCalledWith(body, file);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book Added Successfully",
        data: serviceResult,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should pass the error to next if adding a book fails", async () => {
      const error = new Error("Failed to add book");

      mockAddBookS.mockRejectedValue(error);

      await addBook_C(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================
  // updateBook_C
  // =========================
  describe("updateBook_C", () => {
    it("should update a book successfully", async () => {
      const body = {
        id: "1",
        title: "Updated Book",
      };

      const file = {
        originalname: "updated-book.jpg",
      } as Express.Multer.File;

      const serviceResult = {
        id: "1",
        title: "Updated Book",
      };

      req.body = body;
      req.file = file;

      mockEditBookS.mockResolvedValue(serviceResult);

      await updateBook_C(req, res, next);

      expect(mockEditBookS).toHaveBeenCalledWith(body, file);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book Updated Successfully",
        data: serviceResult,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should pass the error to next if updating a book fails", async () => {
      const error = new Error("Failed to update book");

      mockEditBookS.mockRejectedValue(error);

      await updateBook_C(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================
  // deleteBook_C
  // =========================
  describe("deleteBook_C", () => {
    it("should delete a book successfully", async () => {
      const serviceResult = undefined;

      req.params = { id: "1" };

      mockDeleteBookS.mockResolvedValue(serviceResult);

      await deleteBook_C(req, res, next);

      expect(mockDeleteBookS).toHaveBeenCalledWith("1");

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book Deleted Successfully",
        data: serviceResult,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should pass an error to next if id is missing", async () => {
      req.params = {} as Request["params"];

      await deleteBook_C(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "id is required",
        })
      );

      expect(mockDeleteBookS).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should pass the error to next if deleting a book fails", async () => {
      const error = new Error("Failed to delete book");

      req.params = { id: "1" };

      mockDeleteBookS.mockRejectedValue(error);

      await deleteBook_C(req, res, next);

      expect(mockDeleteBookS).toHaveBeenCalledWith("1");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================
  // getBook_C
  // =========================
  describe("getBook_C", () => {
    it("should return a book successfully", async () => {
      const serviceResult = {
        book: {
          id: "1",
          title: "JavaScript Book",
        },
        bookReviews: [],
      };

      req.params = { id: "1" };

      mockGetBookS.mockResolvedValue(serviceResult);

      await getBook_C(req, res, next);

      expect(mockGetBookS).toHaveBeenCalledWith("1");

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Book Found Successfully",
        data: serviceResult,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should pass an error to next if id is missing", async () => {
      req.params = {} as Request["params"];

      await getBook_C(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "id is required",
        })
      );

      expect(mockGetBookS).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should pass the error to next if getting a book fails", async () => {
      const error = new Error("Book Not Found");

      req.params = { id: "1" };

      mockGetBookS.mockRejectedValue(error);

      await getBook_C(req, res, next);

      expect(mockGetBookS).toHaveBeenCalledWith("1");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // =========================
  // getBooks_C
  // =========================
  describe("getBooks_C", () => {
    it("should return books successfully", async () => {
      const query = {
        currentPage: "1",
        pageSize: "10",
        searchText: "JavaScript",
      };

      const serviceResult = {
        books: [
          {
            id: "1",
            title: "JavaScript Book",
          },
        ],
        currentPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 1,
      };

      req.query = query;

      mockGetBooksS.mockResolvedValue(serviceResult);

      await getBooks_C(req, res, next);

      expect(mockGetBooksS).toHaveBeenCalledWith(query);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Books Found Successfully",
        data: serviceResult,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("should pass the error to next if getting books fails", async () => {
      const error = new Error("Failed to get books");

      mockGetBooksS.mockRejectedValue(error);

      await getBooks_C(req, res, next);

      expect(mockGetBooksS).toHaveBeenCalledWith(req.query);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
