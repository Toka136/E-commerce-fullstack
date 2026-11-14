import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";

// ==================== Mocks ====================

const {
  mockFindOnlyBookById,
  mockGetCartByUserId,
  mockInsertCart,
  mockInsertEmptyCart,
  mockAddProductToCart,
  mockUpdateQuantity,
  mockRemoveProductFromCart,
  mockRemoveCouponFromCart,
  mockAddCouponToCart,
  mockGetCouponByCode,
  mockGetCouponUsage,
  mockIsCouponValidForCart,
  mockCalculateCouponDiscount,
  mockRecalculateCartCoupon,
} = vi.hoisted(() => ({
  mockFindOnlyBookById: vi.fn(),
  mockGetCartByUserId: vi.fn(),
  mockInsertCart: vi.fn(),
  mockInsertEmptyCart: vi.fn(),
  mockAddProductToCart: vi.fn(),
  mockUpdateQuantity: vi.fn(),
  mockRemoveProductFromCart: vi.fn(),
  mockRemoveCouponFromCart: vi.fn(),
  mockAddCouponToCart: vi.fn(),
  mockGetCouponByCode: vi.fn(),
  mockGetCouponUsage: vi.fn(),
  mockIsCouponValidForCart: vi.fn(),
  mockCalculateCouponDiscount: vi.fn(),
  mockRecalculateCartCoupon: vi.fn(),
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
  addCouponToCart: mockAddCouponToCart,
  removeCouponFromCart: mockRemoveCouponFromCart,
}));

vi.mock("../../modules/Coupon/Coupon.repo", () => ({
  getCouponByCode: mockGetCouponByCode,
  getCouponById: vi.fn(),
}));

vi.mock("../../modules/CouponUsage/CouponUsage.repo", () => ({
  getCouponUsageByUserIdAndCouponId: mockGetCouponUsage,
}));

vi.mock("../../modules/Coupon/utils/couponvalidation&discount", () => ({
  isCouponValidForCart: mockIsCouponValidForCart,
  calculateCouponDiscount: mockCalculateCouponDiscount,
}));

vi.mock("../../modules/Cart/helper/recalculateCartCoupon", () => ({
  recalculateCartCoupon: mockRecalculateCartCoupon,
}));

import {
  addProductInCart_S,
  getCartS,
  removeProductFromCartS,
  updateCart_S,
  addCouponToCartS,
  removeCouponFromCartS,
} from "../../modules/Cart/Cart.service";

// ==================== Test Data ====================

const tx = {} as Prisma.TransactionClient;

const userId = "user-123";
const bookId = "book-123";

const product = {
  id: bookId,
  price: new Prisma.Decimal(100),
  stock: 10,
};

const cartItem = {
  book: { id: bookId },
  quantity: 2,
};

const existingCart = {
  id: "cart-123",
  userId,
  couponId: null,
  subtotal: new Prisma.Decimal(200),
  items: [cartItem],
};

const updatedCart = {
  ...existingCart,
  subtotal: new Prisma.Decimal(400),
};

const input = {
  userId,
  bookId,
  quantity: 2,
};

const coupon = {
  id: "coupon-123",
  code: "SAVE10",
  discount: 10,
  type: "PERCENTAGE",
  maxUsesPerUser: 3,
};

const discountResult = {
  discountAmount: new Prisma.Decimal(40),
  totalAfterCoupon: new Prisma.Decimal(360),
};

// ==================== Reset Mocks ====================

beforeEach(() => {
  vi.clearAllMocks();

  mockRecalculateCartCoupon.mockResolvedValue({
    couponRemoved: false,
  });

  mockIsCouponValidForCart.mockReturnValue("");
  mockGetCouponUsage.mockResolvedValue(0);
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

    expect(mockInsertCart).toHaveBeenCalledWith(
      {
        userId,
        bookId,
        quantity: 2,
        price: product.price,
      },
      tx
    );

    // No existing cart means no coupon recalculation.
    expect(mockRecalculateCartCoupon).not.toHaveBeenCalled();
  });

  it("should use quantity 1 if quantity is not provided", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);

    await addProductInCart_S(
      { userId, bookId } as any,
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

  it("should throw an error if requested quantity exceeds stock", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(
      addProductInCart_S({ ...input, quantity: 11 }, tx)
    ).rejects.toThrow("Out of Stock");

    expect(mockInsertCart).not.toHaveBeenCalled();
  });

  it("should update quantity if the product already exists in the cart", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockUpdateQuantity.mockResolvedValue(updatedCart);

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

    expect(mockRecalculateCartCoupon).toHaveBeenCalledWith(
      userId,
      existingCart.couponId,
      updatedCart.subtotal,
      tx
    );
  });

  it("should throw an error if updated quantity exceeds stock", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      items: [{ ...cartItem, quantity: 9 }],
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
    mockAddProductToCart.mockResolvedValue(updatedCart);

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

    expect(mockRecalculateCartCoupon).toHaveBeenCalled();
  });

  it("should throw an error if quantity exceeds stock when adding a new product", async () => {
    mockFindOnlyBookById.mockResolvedValue(product);
    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      items: [],
    });

    await expect(
      addProductInCart_S({ ...input, quantity: 11 }, tx)
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
  it("should throw an error if the cart does not exist", async () => {
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(
      removeProductFromCartS({ userId, bookId }, tx)
    ).rejects.toThrow("Cart Not Found");

    expect(mockRemoveProductFromCart).not.toHaveBeenCalled();
  });

  it("should remove the product and recalculate the coupon", async () => {
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockRemoveProductFromCart.mockResolvedValue(updatedCart);

    const result = await removeProductFromCartS(
      { userId, bookId },
      tx
    );

    expect(mockRemoveProductFromCart).toHaveBeenCalledWith(
      userId,
      bookId,
      tx
    );

    expect(mockRecalculateCartCoupon).toHaveBeenCalledWith(
      userId,
      existingCart.couponId,
      updatedCart.subtotal,
      tx
    );

    expect(result).toEqual({ couponRemoved: false });
  });

  it("should return the coupon recalculation result when the coupon is removed", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      couponId: "coupon-123",
    });

    mockRemoveProductFromCart.mockResolvedValue(updatedCart);

    mockRecalculateCartCoupon.mockResolvedValue({
      couponRemoved: true,
      couponMessage: "Invalid Cart Amount",
    });

    const result = await removeProductFromCartS(
      { userId, bookId },
      tx
    );

    expect(result).toEqual({
      couponRemoved: true,
      couponMessage: "Invalid Cart Amount",
    });
  });
});

// ======================================================
// updateCart_S
// ======================================================

describe("updateCart_S", () => {
  it("should throw an error if the cart does not exist", async () => {
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(updateCart_S(input, tx)).rejects.toThrow(
      "Cart Not Found"
    );

    expect(mockFindOnlyBookById).not.toHaveBeenCalled();
  });

  it("should throw an error if the product does not exist", async () => {
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockFindOnlyBookById.mockResolvedValue(null);

    await expect(updateCart_S(input, tx)).rejects.toThrow(
      "Product Not Found"
    );

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should update the product quantity and recalculate the coupon", async () => {
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockFindOnlyBookById.mockResolvedValue(product);
    mockUpdateQuantity.mockResolvedValue(updatedCart);

    const result = await updateCart_S(input, tx);

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

    expect(mockRecalculateCartCoupon).toHaveBeenCalledWith(
      userId,
      existingCart.couponId,
      updatedCart.subtotal,
      tx
    );

    expect(result).toEqual({ couponRemoved: false });
  });

  it("should use quantity 1 if quantity is not provided", async () => {
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockFindOnlyBookById.mockResolvedValue(product);
    mockUpdateQuantity.mockResolvedValue(updatedCart);

    await updateCart_S({ userId, bookId } as any, tx);

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

  it("should throw an error if quantity is less than 1", async () => {
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockFindOnlyBookById.mockResolvedValue(product);

    await expect(
      updateCart_S({ ...input, quantity: 0 }, tx)
    ).rejects.toThrow("Invalid Quantity");

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });
});

// ======================================================
// addCouponToCartS
// ======================================================

describe("addCouponToCartS", () => {
  it("should throw an error if the coupon does not exist", async () => {
    mockGetCouponByCode.mockResolvedValue(null);

    await expect(
      addCouponToCartS({ userId, couponCode: "INVALID" })
    ).rejects.toThrow("Coupon Not Found");

    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if the cart does not exist", async () => {
    mockGetCouponByCode.mockResolvedValue(coupon);
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(
      addCouponToCartS({ userId, couponCode: coupon.code })
    ).rejects.toThrow("Cart Not Found");
  });

  it("should throw an error if a coupon is already applied", async () => {
    mockGetCouponByCode.mockResolvedValue(coupon);
    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      couponId: "another-coupon",
    });

    await expect(
      addCouponToCartS({ userId, couponCode: coupon.code })
    ).rejects.toThrow("Coupon Already Applied");

    expect(mockIsCouponValidForCart).not.toHaveBeenCalled();
  });

  it("should throw an error if the coupon is invalid for the cart", async () => {
    mockGetCouponByCode.mockResolvedValue(coupon);
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockIsCouponValidForCart.mockReturnValue("Invalid Cart Amount");

    await expect(
      addCouponToCartS({ userId, couponCode: coupon.code })
    ).rejects.toThrow("Invalid Cart Amount");

    expect(mockGetCouponUsage).not.toHaveBeenCalled();
  });

  it("should throw an error if the user exceeded the coupon usage limit", async () => {
    mockGetCouponByCode.mockResolvedValue(coupon);
    mockGetCartByUserId.mockResolvedValue(existingCart);
    mockGetCouponUsage.mockResolvedValue(coupon.maxUsesPerUser);

    await expect(
      addCouponToCartS({ userId, couponCode: coupon.code })
    ).rejects.toThrow("Coupon usage limit reached");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should apply the coupon and save the discount", async () => {
    const newCart = { ...existingCart, couponId: coupon.id };

    mockGetCouponByCode.mockResolvedValue(coupon);
    mockGetCartByUserId.mockResolvedValue(existingCart);
    
    mockCalculateCouponDiscount.mockReturnValue(discountResult);
    mockAddCouponToCart.mockResolvedValue(newCart);

    const result = await addCouponToCartS({
      userId,
      couponCode: coupon.code,
    });

    expect(mockGetCouponByCode).toHaveBeenCalledWith(coupon.code);
    expect(mockGetCouponUsage).toHaveBeenCalledWith(userId, coupon.id);

    expect(mockCalculateCouponDiscount).toHaveBeenCalledWith(
      existingCart.subtotal,
      coupon
    );

    expect(mockAddCouponToCart).toHaveBeenCalledWith(
      userId,
      coupon.id,
      discountResult.discountAmount,
      discountResult.totalAfterCoupon
    );

    expect(result).toEqual({ cart: newCart });
  });
});

// ======================================================
// removeCouponFromCartS
// ======================================================

describe("removeCouponFromCartS", () => {
  it("should throw an error if the cart does not exist", async () => {
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(removeCouponFromCartS(userId)).rejects.toThrow(
      "Cart Not Found"
    );

    expect(mockRemoveCouponFromCart).not.toHaveBeenCalled();
  });

  it("should remove the coupon and restore the cart subtotal", async () => {
    const cartWithoutCoupon = {
      ...existingCart,
      couponId: null,
      discountAmount: new Prisma.Decimal(0),
    };

    mockGetCartByUserId.mockResolvedValue({
      ...existingCart,
      couponId: coupon.id,
    });

    mockRemoveCouponFromCart.mockResolvedValue(cartWithoutCoupon);

    const result = await removeCouponFromCartS(userId);

    expect(mockRemoveCouponFromCart).toHaveBeenCalledWith(
      userId,
      existingCart.subtotal
    );

    expect(result).toEqual({ cart: cartWithoutCoupon });
  });
});