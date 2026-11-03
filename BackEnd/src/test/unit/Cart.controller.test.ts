import { beforeEach, describe, expect, it, vi } from "vitest";
import { Request, Response, NextFunction } from "express";

// ==================== Mocks ====================

const {
  mockAddProductInCartS,
  mockUpdateCartS,
  mockGetCartS,
  mockRemoveProductFromCartS,
} = vi.hoisted(() => ({
  mockAddProductInCartS: vi.fn(),
  mockUpdateCartS: vi.fn(),
  mockGetCartS: vi.fn(),
  mockRemoveProductFromCartS: vi.fn(),
}));

vi.mock("../../modules/Cart/Cart.service", () => ({
  addProductInCart_S: mockAddProductInCartS,
  updateCart_S: mockUpdateCartS,
  getCartS: mockGetCartS,
  removeProductFromCartS: mockRemoveProductFromCartS,
}));

import {
  addProductInCartC,
  updateProductInCartC,
  getCartC,
  removeProductFromCartC,
} from "../../modules/Cart/Cart.controller";

// ==================== Test Data ====================

const userId = "user-123";
const bookId = "book-123";

const cart = {
  id: "cart-123",
  userId,
  items: [],
};

// ==================== Helpers ====================

const createMocks = (user: { id: string } | null = { id: userId }, body = {}) => {
  const req = {
    user,
    body,
  } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  return { req, res, next };
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ======================================================
// addProductInCartC
// ======================================================

describe("addProductInCartC", () => {
  it("should add product to cart successfully", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId, quantity: 2 }
    );

    mockAddProductInCartS.mockResolvedValue(cart);

    await addProductInCartC(req, res, next);

    expect(mockAddProductInCartS).toHaveBeenCalledWith({
      bookId,
      userId,
      quantity: 2,
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Product Added Successfully",
      data: cart,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should use quantity 1 if quantity is not provided", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId }
    );

    mockAddProductInCartS.mockResolvedValue(cart);

    await addProductInCartC(req, res, next);

    expect(mockAddProductInCartS).toHaveBeenCalledWith({
      bookId,
      userId,
      quantity: 1,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null, { bookId });
    await addProductInCartC(req, res, next);

   expect(next).toHaveBeenCalledOnce();

    expect(next).toHaveBeenCalledWith(
  expect.objectContaining({
    message: "You are not logged in",
    statusCode: 401,
    statusText: "failed",
  })
);

    expect(mockAddProductInCartS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service errors to next", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId, quantity: 2 }
    );

    const error = new Error("Product Not Found");

    mockAddProductInCartS.mockRejectedValue(error);

    await addProductInCartC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ======================================================
// updateProductInCartC
// ======================================================

describe("updateProductInCartC", () => {
  it("should update product quantity successfully", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId, quantity: 5 }
    );

    mockUpdateCartS.mockResolvedValue(cart);

    await updateProductInCartC(req, res, next);

    expect(mockUpdateCartS).toHaveBeenCalledWith({
      bookId,
      userId,
      quantity: 5,
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Product Updated Successfully",
      data: cart,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should use quantity 1 if quantity is not provided", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId }
    );

    mockUpdateCartS.mockResolvedValue(cart);

    await updateProductInCartC(req, res, next);

    expect(mockUpdateCartS).toHaveBeenCalledWith({
      bookId,
      userId,
      quantity: 1,
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null, { bookId });

    await updateProductInCartC(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    expect(next).toHaveBeenCalledWith(
  expect.objectContaining({
    message: "You are not logged in",
    statusCode: 401,
    statusText: "failed",
  })
);

    expect(mockUpdateCartS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service errors to next", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId, quantity: 5 }
    );

    const error = new Error("Product Not Found");

    mockUpdateCartS.mockRejectedValue(error);

    await updateProductInCartC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ======================================================
// getCartC
// ======================================================

describe("getCartC", () => {
  it("should return user's cart successfully", async () => {
    const { req, res, next } = createMocks();

    mockGetCartS.mockResolvedValue(cart);

    await getCartC(req, res, next);

    expect(mockGetCartS).toHaveBeenCalledWith(userId);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Cart Found Successfully",
      data: cart,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null);

    await getCartC(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    expect(next).toHaveBeenCalledWith(
  expect.objectContaining({
    message: "You are not logged in",
    statusCode: 401,
    statusText: "failed",
  })
);

    expect(mockGetCartS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service errors to next", async () => {
    const { req, res, next } = createMocks();

    const error = new Error("Something went wrong");

    mockGetCartS.mockRejectedValue(error);

    await getCartC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ======================================================
// removeProductFromCartC
// ======================================================

describe("removeProductFromCartC", () => {
  it("should remove product from cart successfully", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId }
    );

    mockRemoveProductFromCartS.mockResolvedValue(cart);

    await removeProductFromCartC(req, res, next);

    expect(mockRemoveProductFromCartS).toHaveBeenCalledWith({
      bookId,
      userId,
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Product Deletd Successfully",
      data: cart,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null, { bookId });

    await removeProductFromCartC(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    expect(next).toHaveBeenCalledWith(
  expect.objectContaining({
    message: "You are not logged in",
    statusCode: 401,
    statusText: "failed",
  })
);

    expect(mockRemoveProductFromCartS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service errors to next", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      { bookId }
    );

    const error = new Error("Something went wrong");

    mockRemoveProductFromCartS.mockRejectedValue(error);

    await removeProductFromCartC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
