import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import {
  addProductInCart_S,
  getCartS,
  removeProductFromCartS,
} from "../../modules/Cart/Cart.service";

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

describe("addProductInCart_S", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw Product Not Found if the book does not exist", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
      quantity: 1,
    };

    mockFindOnlyBookById.mockResolvedValue(null);

    await expect(addProductInCart_S(input)).rejects.toThrow(
      "Product Not Found",
    );

    expect(mockFindOnlyBookById).toHaveBeenCalledWith(input.bookId);
    expect(mockGetCartByUserId).not.toHaveBeenCalled();
    expect(mockInsertCart).not.toHaveBeenCalled();
  });

  it("should create a new cart if the user does not have one", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
      quantity: 2,
    };

    const product = {
      id: "book-1",
      price: new Prisma.Decimal(100),
      stock: 10,
    };

    const createdCart = {
      id: "cart-1",
      userId: "user-1",
      subtotal: new Prisma.Decimal(100),
    };

    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);
    mockInsertCart.mockResolvedValue(createdCart);

    const result = await addProductInCart_S(input);

    expect(mockFindOnlyBookById).toHaveBeenCalledWith("book-1");
    expect(mockGetCartByUserId).toHaveBeenCalledWith("user-1");

    expect(mockInsertCart).toHaveBeenCalledWith({
      userId: "user-1",
      bookId: "book-1",
      quantity: 2,
      price: product.price,
    });

    expect(result).toEqual(createdCart);
    expect(mockAddProductToCart).not.toHaveBeenCalled();
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should use quantity 1 if quantity is not provided", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
    };

    const product = {
      id: "book-1",
      price: new Prisma.Decimal(100),
      stock: 10,
    };

    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);
    mockInsertCart.mockResolvedValue({ id: "cart-1" });

    await addProductInCart_S(input);

    expect(mockInsertCart).toHaveBeenCalledWith({
      userId: "user-1",
      bookId: "book-1",
      quantity: 1,
      price: product.price,
    });
  });

  it("should throw Out of Stock if quantity exceeds stock when creating a cart", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
      quantity: 5,
    };

    mockFindOnlyBookById.mockResolvedValue({
      id: "book-1",
      price: new Prisma.Decimal(100),
      stock: 3,
    });

    mockGetCartByUserId.mockResolvedValue(null);

    await expect(addProductInCart_S(input)).rejects.toThrow(
      "Out of Stock",
    );

    expect(mockInsertCart).not.toHaveBeenCalled();
  });

  it("should update quantity if the book already exists in the cart", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
      quantity: 2,
    };

    const product = {
      id: "book-1",
      price: new Prisma.Decimal(120),
      stock: 10,
    };

    const cart = {
      id: "cart-1",
      items: [
        {
          id: "item-1",
          quantity: 2,
          priceAtPurchase: new Prisma.Decimal(100),
          book: {
            id: "book-1",
          },
        },
      ],
    };

    const updatedCart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(480),
    };

    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(cart);
    mockUpdateQuantity.mockResolvedValue(updatedCart);

    const result = await addProductInCart_S(input);

    expect(mockUpdateQuantity).toHaveBeenCalledWith(
      {
        userId: "user-1",
        bookId: "book-1",
        quantity: 4,
        price: product.price,
      },
      product.stock,
    );

    expect(result).toEqual(updatedCart);
    expect(mockAddProductToCart).not.toHaveBeenCalled();
  });

  it("should throw Out of Stock if the new total quantity exceeds stock", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
      quantity: 3,
    };

    mockFindOnlyBookById.mockResolvedValue({
      id: "book-1",
      price: new Prisma.Decimal(100),
      stock: 4,
    });

    mockGetCartByUserId.mockResolvedValue({
      id: "cart-1",
      items: [
        {
          quantity: 2,
          book: {
            id: "book-1",
          },
        },
      ],
    });

    await expect(addProductInCart_S(input)).rejects.toThrow(
      "Out of Stock",
    );

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should add the book if it does not already exist in the cart", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-2",
      quantity: 2,
    };

    const product = {
      id: "book-2",
      price: new Prisma.Decimal(150),
      stock: 10,
    };

    const cart = {
      id: "cart-1",
      items: [
        {
          quantity: 1,
          book: {
            id: "book-1",
          },
        },
      ],
    };

    const updatedCart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(300),
    };

    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(cart);
    mockAddProductToCart.mockResolvedValue(updatedCart);

    const result = await addProductInCart_S(input);

    expect(mockAddProductToCart).toHaveBeenCalledWith({
      userId: "user-1",
      bookId: "book-2",
      quantity: 2,
      price: product.price,
    });

    expect(result).toEqual(updatedCart);
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should throw Out of Stock if quantity exceeds stock when adding a new book", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-2",
      quantity: 5,
    };

    mockFindOnlyBookById.mockResolvedValue({
      id: "book-2",
      price: new Prisma.Decimal(100),
      stock: 3,
    });

    mockGetCartByUserId.mockResolvedValue({
      id: "cart-1",
      items: [],
    });

    await expect(addProductInCart_S(input)).rejects.toThrow(
      "Out of Stock",
    );

    expect(mockAddProductToCart).not.toHaveBeenCalled();
  });
});

describe("getCartS", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the existing cart", async () => {
    const userId = "user-1";

    const cart = {
      id: "cart-1",
      userId,
      items: [],
      subtotal: new Prisma.Decimal(0),
    };

    mockGetCartByUserId.mockResolvedValue(cart);

    const result = await getCartS(userId);

    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId);
    expect(mockInsertEmptyCart).not.toHaveBeenCalled();
    expect(result).toEqual(cart);
  });

  it("should create an empty cart if the user does not have one", async () => {
    const userId = "user-1";

    const newCart = {
      id: "cart-1",
      userId,
      items: [],
      subtotal: new Prisma.Decimal(0),
    };

    mockGetCartByUserId.mockResolvedValue(null);
    mockInsertEmptyCart.mockResolvedValue(newCart);

    const result = await getCartS(userId);

    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId);
    expect(mockInsertEmptyCart).toHaveBeenCalledWith(userId);
    expect(result).toEqual(newCart);
  });
});

describe("removeProductFromCartS", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should remove the product from the user's cart", async () => {
    const input = {
      userId: "user-1",
      bookId: "book-1",
    };

    const updatedCart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(100),
    };

    mockRemoveProductFromCart.mockResolvedValue(updatedCart);

    const result = await removeProductFromCartS(input);

    expect(mockRemoveProductFromCart).toHaveBeenCalledWith(
      input.userId,
      input.bookId,
    );

    expect(result).toEqual(updatedCart);
  });
});