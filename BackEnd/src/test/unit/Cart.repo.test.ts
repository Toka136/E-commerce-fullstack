import { beforeEach, describe, expect, it, vi } from "vitest";
import { addProductToCart, getCartByUserId, insertCart, insertEmptyCart, removeCart, removeProductFromCart, updateQuantity } from "../../modules/Cart/Cart.repo";
import { Prisma } from "../../generated/prisma/client";
// import { findCartByUserId } from "../../modules/Cart/Cart.repo";
const {
  mockCartFindUnique,
  mockCartCreate,
  mockCartUpdate,
  mockCartItemDelete,
  mockCartDelete,
  mockTransaction,
  mockCartItemUpdate
} = vi.hoisted(() => ({
  mockCartFindUnique: vi.fn(),
  mockCartCreate: vi.fn(),
  mockCartUpdate: vi.fn(),
  mockCartItemDelete: vi.fn(),
  mockTransaction: vi.fn(),
  mockCartDelete: vi.fn(),
  mockCartItemUpdate: vi.fn()
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    cart: {
      findUnique: mockCartFindUnique,
      create: mockCartCreate,
      update: mockCartUpdate,
      delete: mockCartDelete
    },
    cartItem: {
      delete: mockCartItemDelete,
      update: mockCartItemUpdate
    },
    $transaction: mockTransaction,
  },
}));

describe("getCartByUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the cart with its items and book details", async () => {
    const userId = "user-1";

    const cart = {
      id: "cart-1",
      userId,
      subtotal: 200,
      items: [
        {
          id: "item-1",
          priceAtPurchase: 100,
          quantity: 2,
          book: {
            id: "book-1",
            title: "Clean Code",
            coverImage: "cover.jpg",
            price: 120,
            stock: 10,
          },
        },
      ],
    };

    mockCartFindUnique.mockResolvedValue(cart);

    const result = await getCartByUserId(userId);

    expect(mockCartFindUnique).toHaveBeenCalledWith({
      where: { userId },
      include: {
        items: {
          select: {
            id: true,
            priceAtPurchase: true,
            quantity: true,
            book: {
              select: {
                id: true,
                title: true,
                coverImage: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    expect(result).toEqual(cart);
  });

  it("should return null if the cart does not exist", async () => {
    const userId = "user-1";

    mockCartFindUnique.mockResolvedValue(null);

    const result = await getCartByUserId(userId);

    expect(mockCartFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId },
      }),
    );

    expect(result).toBeNull();
  });
});
describe("insertCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a cart with the given book and return its items", async () => {
    const cartInput = {
      userId: "user-1",
      bookId: "book-1",
      price: new Prisma.Decimal(100),
      quantity: 1,
    };

    const createdCart = {
      id: "cart-1",
      userId: "user-1",
      subtotal: new Prisma.Decimal(100),
      items: [
        {
          id: "item-1",
          bookId: "book-1",
          quantity: 1,
          priceAtPurchase: new Prisma.Decimal(100),
        },
      ],
    };

    mockCartCreate.mockResolvedValue(createdCart);

    const result = await insertCart(cartInput);

    expect(mockCartCreate).toHaveBeenCalledWith({
      data: {
        userId: cartInput.userId,
        items: {
          create: {
            book: {
              connect: { id: cartInput.bookId },
            },
            quantity: 1,
            priceAtPurchase: cartInput.price,
          },
        },
        subtotal: cartInput.price,
      },
      include: {
        items: true,
      },
    });

    expect(result).toEqual(createdCart);
    expect(result.items).toEqual(createdCart.items);
  });

  it("should use the provided transaction client", async () => {
    const cartInput = {
      userId: "user-1",
      bookId: "book-1",
      price: new Prisma.Decimal(100),
      quantity: 1,
    };

    const createdCart = {
      id: "cart-1",
      userId: "user-1",
      subtotal: new Prisma.Decimal(100),
      items: [
        {
          id: "item-1",
          bookId: "book-1",
          quantity: 1,
          priceAtPurchase: new Prisma.Decimal(100),
        },
      ],
    };

    const tx = {
      cart: {
        create: vi.fn().mockResolvedValue(createdCart),
      },
    };

    const result = await insertCart(cartInput, tx as any);

    expect(tx.cart.create).toHaveBeenCalledWith({
      data: {
        userId: cartInput.userId,
        items: {
          create: {
            book: {
              connect: { id: cartInput.bookId },
            },
            quantity: 1,
            priceAtPurchase: cartInput.price,
          },
        },
        subtotal: cartInput.price,
      },
      include: {
        items: true,
      },
    });

    expect(result).toEqual(createdCart);
    expect(result.items).toEqual(createdCart.items);
    expect(mockCartCreate).not.toHaveBeenCalled();
  });
});
describe("insertEmptyCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an empty cart for the user", async () => {
    const userId = "user-1";

    const createdCart = {
      id: "cart-1",
      userId,
      subtotal: new Prisma.Decimal(0),
    };

    mockCartCreate.mockResolvedValue(createdCart);

    const result = await insertEmptyCart(userId);

    expect(mockCartCreate).toHaveBeenCalledWith({
      data: {
        userId,
        items: {},
        subtotal: 0,
      },
    });

    expect(result).toEqual(createdCart);
  });

  it("should propagate an error if creating the cart fails", async () => {
    const userId = "user-1";
    const error = new Error("Database error");

    mockCartCreate.mockRejectedValue(error);

    await expect(insertEmptyCart(userId)).rejects.toThrow("Database error");
  });
});

describe("removeProductFromCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockTransaction.mockImplementation(async (callback) => {
      return callback({
        cart: {
          findUnique: mockCartFindUnique,
          update: mockCartUpdate,
        },
        cartItem: {
          delete: mockCartItemDelete,
        },
      });
    });
  });

  it("should remove the product and update the cart subtotal", async () => {
    const userId = "user-1";
    const bookId = "book-1";

    const cart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(300),
      items: [
        {
          id: "item-1",
          priceAtPurchase: new Prisma.Decimal(100),
          quantity: 2,
        },
      ],
    };

    const updatedCart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(100),
    };

    mockCartFindUnique.mockResolvedValue(cart);
    mockCartItemDelete.mockResolvedValue({});
    mockCartUpdate.mockResolvedValue(updatedCart);

    const result = await removeProductFromCart(userId, bookId);

    expect(mockCartFindUnique).toHaveBeenCalledWith({
      where: { userId },
      select: {
        id: true,
        items: {
          where: { bookId },
          select: {
            id: true,
            priceAtPurchase: true,
            quantity: true,
          },
        },
        subtotal: true,
      },
    });

    expect(mockCartItemDelete).toHaveBeenCalledWith({
      where: { id: "item-1" },
    });

    expect(mockCartUpdate).toHaveBeenCalledWith({
      where: { id: "cart-1" },
      data: {
        subtotal: new Prisma.Decimal(100),
      },
    });

    expect(result).toEqual(updatedCart);
  });
it("should throw an error if the product is not in the cart", async () => {
  const userId = "user-1";
  const bookId = "book-1";

  const cart = {
    id: "cart-1",
    subtotal: new Prisma.Decimal(300),
    items: [],
  };

  mockCartFindUnique.mockResolvedValue(cart);

  await expect(
    removeProductFromCart(userId, bookId),
  ).rejects.toThrow("Product Not Found");

  expect(mockCartItemDelete).not.toHaveBeenCalled();
  expect(mockCartUpdate).not.toHaveBeenCalled();
});

});
describe("removeCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete the cart by userId", async () => {
    const userId = "user-1";

    const deletedCart = {
      id: "cart-1",
      userId,
      subtotal: new Prisma.Decimal(100),
    };

    mockCartDelete.mockResolvedValue(deletedCart);

    const result = await removeCart(userId);

    expect(mockCartDelete).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(result).toEqual(deletedCart);
  });

  it("should use the provided transaction client", async () => {
    const userId = "user-1";

    const deletedCart = {
      id: "cart-1",
      userId,
      subtotal: new Prisma.Decimal(100),
    };

    const tx = {
      cart: {
        delete: vi.fn().mockResolvedValue(deletedCart),
      },
    };

    const result = await removeCart(userId, tx as any);

    expect(tx.cart.delete).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(result).toEqual(deletedCart);
    expect(mockCartDelete).not.toHaveBeenCalled();
  });
});
describe("updateQuantity", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockTransaction.mockImplementation(async (callback) => {
      return callback({
        cart: {
          findUnique: mockCartFindUnique,
          update: mockCartUpdate,
        },
        cartItem: {
          delete: mockCartItemDelete,
          update: mockCartItemUpdate,
        },
      });
    });
  });

  it("should update the item quantity and price and recalculate subtotal", async () => {
    const cartInput = {
      userId: "user-1",
      bookId: "book-1",
      price: new Prisma.Decimal(120),
      quantity: 3,
    };

    const cart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(300),
      items: [
        {
          id: "item-1",
          priceAtPurchase: new Prisma.Decimal(100),
          quantity: 2,
          bookId: "book-1",
        },
      ],
    };

    const updatedCart = {
      id: "cart-1",
      subtotal: new Prisma.Decimal(460),
    };

    mockCartFindUnique.mockResolvedValue(cart);
    mockCartItemUpdate.mockResolvedValue({
      id: "item-1",
      quantity: 3,
      priceAtPurchase: new Prisma.Decimal(120),
    });
    mockCartUpdate.mockResolvedValue(updatedCart);

    const result = await updateQuantity(cartInput);

    expect(mockCartFindUnique).toHaveBeenCalledWith({
      where: { userId: cartInput.userId },
      select: {
        id: true,
        items: {
          where: { bookId: cartInput.bookId },
          select: {
            id: true,
            priceAtPurchase: true,
            quantity: true,
          },
        },
        subtotal: true,
      },
    });

    expect(mockCartItemUpdate).toHaveBeenCalledWith({
      where: { id: "item-1" },
      data: {
        quantity: 3,
        priceAtPurchase: cartInput.price,
      },
    });

    expect(mockCartUpdate).toHaveBeenCalledWith({
      where: { id: "cart-1" },
      data: {
        subtotal: new Prisma.Decimal(460),
      },
      select: {
    id: true,
    subtotal: true,
  },
    });

    expect(result).toEqual(updatedCart);
  });
it("should throw an error if the product is not in the cart", async () => {
  const cartInput = {
    userId: "user-1",
    bookId: "book-1",
    price: new Prisma.Decimal(120),
    quantity: 3,
  };

  const cart = {
    id: "cart-1",
    subtotal: new Prisma.Decimal(300),
    items: [],
  };

  mockCartFindUnique.mockResolvedValue(cart);

  await expect(
    updateQuantity(cartInput),
  ).rejects.toThrow("Product Not Found");

  expect(mockCartItemUpdate).not.toHaveBeenCalled();
  expect(mockCartUpdate).not.toHaveBeenCalled();
});
});
describe("addProductToCart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add the product and increment the cart subtotal", async () => {
    const cartInput = {
      userId: "user-1",
      bookId: "book-1",
      price: new Prisma.Decimal(120),
      quantity: 3,
    };

    const updatedCart = {
      id: "cart-1",
      userId: "user-1",
      subtotal: new Prisma.Decimal(660),
    };

    mockCartUpdate.mockResolvedValue(updatedCart);

    const result = await addProductToCart(cartInput);

    expect(mockCartUpdate).toHaveBeenCalledWith({
  where: {
    userId: cartInput.userId,
  },
  data: {
    items: {
      create: {
        book: {
          connect: {
            id: cartInput.bookId,
          },
        },
        quantity: cartInput.quantity,
        priceAtPurchase: cartInput.price,
      },
    },
    subtotal: {
      increment: new Prisma.Decimal(360),
    },
  },
  select: {
    id: true,
    subtotal: true,
  },
});

    expect(result).toEqual(updatedCart);
  });
});



