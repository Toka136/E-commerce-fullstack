
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";

import {
  addProductInCart_S,
  getCartS,
  removeProductFromCartS,
  updateCart_S,
} from "../../modules/Cart/Cart.service";

// ==================== Mocks ====================

const {
  mockFindOnlyBookById,
  mockGetCartByUserId,
  mockInsertCart,
  mockInsertEmptyCart,
  mockAddProductToCart,
  mockUpdateQuantity,
  mockRemoveProductFromCart,
} = vi.hoisted(() => ({
  mockFindOnlyBookById: vi.fn(),
  mockGetCartByUserId: vi.fn(),
  mockInsertCart: vi.fn(),
  mockInsertEmptyCart: vi.fn(),
  mockAddProductToCart: vi.fn(),
  mockUpdateQuantity: vi.fn(),
  mockRemoveProductFromCart: vi.fn(),
}));

vi.mock("../../modules/Books/book.repo", () => ({
  findOnlyBookById: mockFindOnlyBookById,
  findBookById: vi.fn(),
}));

vi.mock("../../modules/Cart/Cart.repo", () => ({
  getCartByUserId: mockGetCartByUserId,
  insertCart: mockInsertCart,
  insertEmptyCart: mockInsertEmptyCart,
  addProductToCart: mockAddProductToCart,
  updateQuantity: mockUpdateQuantity,
  removeProductFromCart: mockRemoveProductFromCart,
}));

// ==================== Test Data ====================

const tx = {} as Prisma.TransactionClient;

const userId = "user-123";
const bookId = "book-123";

const product = {
  id: bookId,
  price: 100,
  stock: 10,
};

const cartItem = {
  book: {
    id: bookId,
  },
  quantity: 2,
};

const existingCart = {
  id: "cart-123",
  userId,
  items: [cartItem],
};

const input = {
  userId,
  bookId,
  quantity: 2,
};

// ==================== Reset Mocks ====================

beforeEach(() => {
  vi.clearAllMocks();
});

// ======================================================
// addProductInCart_S
// ======================================================

describe("addProductInCart_S", () => {
  it("should throw an error if the product does not exist", async () => {
    mockFindOnlyBookById.mockResolvedValue(null);

    await expect(addProductInCart_S(input, tx)).rejects.toThrow(
      "Product Not Found"
    );

    expect(mockFindOnlyBookById).toHaveBeenCalledWith(bookId, tx);
    expect(mockGetCartByUserId).not.toHaveBeenCalled();
  });

  it("should create a new cart if the user does not have one", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);
    mockInsertCart.mockResolvedValue({ id: "new-cart" });

    await addProductInCart_S(input, tx);

    expect(mockFindOnlyBookById).toHaveBeenCalledWith(bookId, tx);
    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId, tx);

    expect(mockInsertCart).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 2,
        price: product.price,
      },
      tx
    );
  });

  it("should use quantity 1 if quantity is not provided when creating a cart", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);

    await addProductInCart_S(
      {
        userId,
        bookId,
      },
      tx
    );

    expect(mockInsertCart).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 1,
        price: product.price,
      },
      tx
    );
  });

  it("should throw an error if requested quantity exceeds stock when creating a cart", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(
      addProductInCart_S(
        {
          userId,
          bookId,
          quantity: 11,
        },
        tx
      )
    ).rejects.toThrow("Out of Stock");

    expect(mockInsertCart).not.toHaveBeenCalled();
  });

  it("should update quantity if the product already exists in the cart", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockUpdateQuantity.mockResolvedValue({ success: true });

    await addProductInCart_S(input, tx);

    expect(mockUpdateQuantity).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 4,
        price: product.price,
      },
      tx
    );
  });

  it("should throw an error if the updated quantity exceeds stock", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);

    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      items: [
        {
          ...cartItem,
          quantity: 9,
        },
      ],
    });

    await expect(addProductInCart_S(input, tx)).rejects.toThrow(
      "Out of Stock"
    );

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should add a new product if it does not exist in the cart", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      items: [],
    });

    mockAddProductToCart.mockResolvedValue({ success: true });

    await addProductInCart_S(input, tx);

    expect(mockAddProductToCart).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 2,
        price: product.price,
      },
      tx
    );
  });

  it("should throw an error if quantity exceeds stock when adding a new product to an existing cart", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      items: [],
    });

    await expect(
      addProductInCart_S(
        {
          userId,
          bookId,
          quantity: 11,
        },
        tx
      )
    ).rejects.toThrow("Out of Stock");

    expect(mockAddProductToCart).not.toHaveBeenCalled();
  });
});

// ======================================================
// getCartS
// ======================================================

describe("getCartS", () => {
  it("should return the existing cart", async () => {
    mockGetCartByUserId.mockResolvedValue(existingCart);

    const result = await getCartS(userId);

    expect(result).toEqual(existingCart);
    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId);
    expect(mockInsertEmptyCart).not.toHaveBeenCalled();
  });

  it("should create an empty cart if the user does not have one", async () => {
    const emptyCart = {
      id: "empty-cart",
      userId,
      items: [],
    };

    mockGetCartByUserId.mockResolvedValue(null);
    mockInsertEmptyCart.mockResolvedValue(emptyCart);

    const result = await getCartS(userId);

    expect(result).toEqual(emptyCart);
    expect(mockInsertEmptyCart).toHaveBeenCalledWith(userId);
  });
});

// ======================================================
// removeProductFromCartS
// ======================================================

describe("removeProductFromCartS", () => {
  it("should call removeProductFromCart repository with userId and bookId", async () => {
    const result = { success: true };

    mockRemoveProductFromCart.mockResolvedValue(result);

    const response = await removeProductFromCartS({
      userId,
      bookId,
    });

    expect(response).toEqual(result);

    expect(mockRemoveProductFromCart).toHaveBeenCalledWith(
      userId,
      bookId
    );
  });
});

// ======================================================
// updateCart_S
// ======================================================

describe("updateCart_S", () => {
  it("should throw an error if the product does not exist", async () => {
    mockFindOnlyBookById.mockResolvedValue(null);

    await expect(updateCart_S(input, tx)).rejects.toThrow(
      "Product Not Found"
    );

    expect(mockFindOnlyBookById).toHaveBeenCalledWith(bookId, tx);
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should update the product quantity and forward transaction", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockUpdateQuantity.mockResolvedValue({ success: true });

    const result = await updateCart_S(input, tx);

    expect(result).toEqual({ success: true });

    expect(mockFindOnlyBookById).toHaveBeenCalledWith(bookId, tx);

    expect(mockUpdateQuantity).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 2,
        price: product.price,
      },
      tx
    );
  });

  it("should use quantity 1 if quantity is not provided", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);

    await updateCart_S(
      {
        userId,
        bookId,
      },
      tx
    );

    expect(mockUpdateQuantity).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 1,
        price: product.price,
      },
      tx
    );
  });
});
