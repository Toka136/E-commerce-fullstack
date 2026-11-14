import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";

// ==================== Mocks ====================

const {
  mockTransaction,
  mockGetCartByUserId,
  mockFindOrderBooks,
  mockUpdateStock,
  mockRemoveCart,
  mockGetCouponById,
  mockUseCoupon,
  mockAddCouponUsage,
  mockCheckQuantity,
  mockRecalculateOrderCoupon,
  mockCreateOrder,
  mockFindOrderById,
  mockGetOrders,
  mockGetOrdersByUserId,
  mockUpdateOrderPaymentStatus,
  mockUpdateOrderStatus,
} = vi.hoisted(() => ({
  mockTransaction: vi.fn(),
  mockGetCartByUserId: vi.fn(),
  mockFindOrderBooks: vi.fn(),
  mockUpdateStock: vi.fn(),
  mockRemoveCart: vi.fn(),
  mockGetCouponById: vi.fn(),
  mockUseCoupon: vi.fn(),
  mockAddCouponUsage: vi.fn(),
  mockCheckQuantity: vi.fn(),
  mockRecalculateOrderCoupon: vi.fn(),
  mockCreateOrder: vi.fn(),
  mockFindOrderById: vi.fn(),
  mockGetOrders: vi.fn(),
  mockGetOrdersByUserId: vi.fn(),
  mockUpdateOrderPaymentStatus: vi.fn(),
  mockUpdateOrderStatus: vi.fn(),
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    $transaction: mockTransaction,
  },
}));

vi.mock("../../modules/Cart/Cart.repo", () => ({
  getCartByUserId: mockGetCartByUserId,
  removeCart: mockRemoveCart,
}));

vi.mock("../../modules/Books/book.repo", () => ({
  findOrderBooks: mockFindOrderBooks,
  updateStock: mockUpdateStock,
}));

vi.mock("../../modules/Coupon/Coupon.repo", () => ({
  getCouponByCode: vi.fn(),
  getCouponById: mockGetCouponById,
  useCoupon: mockUseCoupon,
  
}));

vi.mock("../../modules/CouponUsage/CouponUsage.repo", () => ({
  getCouponUsageByUserIdAndCouponId: vi.fn(),
  addCouponUsage: mockAddCouponUsage,
}));
vi.mock("../../modules/Orders/helper/checkQuantity", () => ({
  checkQuantity: mockCheckQuantity,
}));

vi.mock("../../modules/Orders/helper/recalculateOrderCoupon", () => ({
  recalculateOrderCoupon: mockRecalculateOrderCoupon,
}));
vi.mock("../../modules/Orders/order.repo", () => ({
  createOrder: mockCreateOrder,
  findOrderById: mockFindOrderById,
  getOrders: mockGetOrders,
  getOrdersByUserId: mockGetOrdersByUserId,
  updateOrderPaymentStatus: mockUpdateOrderPaymentStatus,
  updateOrderStatus: mockUpdateOrderStatus,
}));

import {
  createOrderS,
  getOrdersS,
  changeOrderStatusS,
  getOrderS,
} from "../../modules/Orders/order.service";

// ==================== Test Data ====================

const tx = {} as Prisma.TransactionClient;

const userId = "user-123";
const orderId = "order-123";
const bookId = "book-123";
const couponId = "coupon-123";

const address = {
  fullName: "Test User",
  phone: "01000000000",
  city: "Cairo",
  street: "Test Street",
} as any;

const book = {
  id: bookId,
  price: new Prisma.Decimal(100),
  title: "Test Book",
  coverImage: "book.jpg",
  stock: 10,
};

const cartItem = {
  book: {
    id: bookId,
  },
  quantity: 2,
};

const cart = {
  id: "cart-123",
  userId,
  couponId: null,
  items: [cartItem],
};

const createdOrder = {
  id: orderId,
  userId,
  totalPrice: new Prisma.Decimal(250),
};

const existingOrder = {
  id: orderId,
  userId,
  orderStatus: "PENDING",
  paymentStatus: "PENDING",
};

const coupon = {
  id: couponId,
  maxUsesPerUser: 3,
};

// ==================== Reset Mocks ====================

beforeEach(() => {
  vi.clearAllMocks();

  mockGetCartByUserId.mockResolvedValue(cart);
  mockFindOrderBooks.mockResolvedValue([book]);
  mockCheckQuantity.mockResolvedValue(book);
  mockCreateOrder.mockResolvedValue(createdOrder);
  mockUpdateStock.mockResolvedValue(true);
  mockRemoveCart.mockResolvedValue({ success: true });

  mockGetCouponById.mockResolvedValue(coupon);
  mockUseCoupon.mockResolvedValue(true);
  mockAddCouponUsage.mockResolvedValue(true);

  mockRecalculateOrderCoupon.mockResolvedValue({
    couponRemoved: false,
    discountAmount: new Prisma.Decimal(0),
    totalAfterCoupon: new Prisma.Decimal(200),
  });

  mockTransaction.mockImplementation(
    async (callback: (transaction: Prisma.TransactionClient) => unknown) =>
      callback(tx)
  );
});

// ======================================================
// createOrderS
// ======================================================

describe("createOrderS", () => {
  it("should throw an error if the cart does not exist", async () => {
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Cart Not Found");

    expect(mockFindOrderBooks).not.toHaveBeenCalled();
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it("should throw an error if the cart is empty", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      items: [],
    });

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Cart is empty");

    expect(mockFindOrderBooks).not.toHaveBeenCalled();
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it("should get books using the cart item IDs", async () => {
    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockFindOrderBooks).toHaveBeenCalledWith([bookId], tx);
  });

  it("should check the quantity of every cart item", async () => {
    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockCheckQuantity).toHaveBeenCalledWith(
      [book],
      bookId,
      2,
      userId
    );
  });

  it("should create an order with the correct calculated data", async () => {
    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        subtotal: new Prisma.Decimal(200),
        discountAmount: new Prisma.Decimal(0),
        shippingCost: new Prisma.Decimal(50),
        totalPrice: new Prisma.Decimal(250),
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        orderShippingAddress: address,
        orderItems: [
          {
            bookId,
            quantity: 2,
            priceAtPurchase: new Prisma.Decimal(100),
            titleAtPurchase: book.title,
            imageAtPurchase: book.coverImage,
          },
        ],
      }),
      tx
    );
  });

  it("should update the stock of every cart item", async () => {
    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockUpdateStock).toHaveBeenCalledWith(
      bookId,
      2,
      tx
    );
  });

  it("should remove the cart after successfully creating the order", async () => {
    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockRemoveCart).toHaveBeenCalledWith(userId, tx);
  });

  it("should return the created order", async () => {
    const result = await createOrderS(
      userId,
      address,
      "CASH" as any,
      tx
    );

    expect(result).toEqual(createdOrder);
  });

  it("should throw an error if stock could not be updated", async () => {
    mockUpdateStock.mockResolvedValue(false);

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Insufficient stock");

    expect(mockRemoveCart).not.toHaveBeenCalled();
  });

  it("should recalculate the coupon if the cart has a coupon", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      couponId,
    });

    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockRecalculateOrderCoupon).toHaveBeenCalledWith(
      userId,
      couponId,
      new Prisma.Decimal(200),
      tx
    );
  });

  it("should throw an error if the coupon is no longer valid", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      couponId,
    });

    mockRecalculateOrderCoupon.mockResolvedValue({
      couponRemoved: true,
      couponMessage: "Invalid Cart Amount",
    });

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Invalid Cart Amount");

    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it("should throw an error if the coupon does not exist", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      couponId,
    });

    mockGetCouponById.mockResolvedValue(null);

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Coupon Not Found");

    expect(mockRemoveCart).not.toHaveBeenCalled();
  });

  it("should use the coupon and add coupon usage after creating the order", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      couponId,
    });

    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockUseCoupon).toHaveBeenCalledWith(couponId, tx);

    expect(mockAddCouponUsage).toHaveBeenCalledWith(
      couponId,
      userId,
      coupon.maxUsesPerUser,
      tx
    );
  });

  it("should throw an error if the coupon usage limit is reached", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      couponId,
    });

    mockUseCoupon.mockResolvedValue(false);

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Coupon usage limit reached");

    expect(mockAddCouponUsage).not.toHaveBeenCalled();
    expect(mockRemoveCart).not.toHaveBeenCalled();
  });

  it("should throw an error if adding coupon usage for the user fails", async () => {
    mockGetCartByUserId.mockResolvedValue({
      ...cart,
      couponId,
    });

    mockAddCouponUsage.mockResolvedValue(false);

    await expect(
      createOrderS(userId, address, "CASH" as any, tx)
    ).rejects.toThrow("Coupon usage limit reached for this user");

    expect(mockRemoveCart).not.toHaveBeenCalled();
  });

  it("should use a Prisma transaction if tx is not provided", async () => {
    await createOrderS(userId, address, "CASH" as any);

    expect(mockTransaction).toHaveBeenCalledOnce();
    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId, tx);
    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.any(Object),
      tx
    );
  });

  it("should use the provided transaction without starting a new one", async () => {
    await createOrderS(userId, address, "CASH" as any, tx);

    expect(mockTransaction).not.toHaveBeenCalled();
  });
});

// ======================================================
// getOrdersS
// ======================================================

describe("getOrdersS", () => {
  it("should return all orders if the user is an admin", async () => {
    const orders = [existingOrder];

    mockGetOrders.mockResolvedValue(orders);

    const result = await getOrdersS(userId, "admin");

    expect(result).toEqual(orders);
    expect(mockGetOrders).toHaveBeenCalledOnce();
    expect(mockGetOrdersByUserId).not.toHaveBeenCalled();
  });

  it("should return only the user's orders if the user is not an admin", async () => {
    const orders = [existingOrder];

    mockGetOrdersByUserId.mockResolvedValue(orders);

    const result = await getOrdersS(userId, "user");

    expect(result).toEqual(orders);
    expect(mockGetOrdersByUserId).toHaveBeenCalledWith(userId);
    expect(mockGetOrders).not.toHaveBeenCalled();
  });
});

// ======================================================
// changeOrderStatusS
// ======================================================

describe("changeOrderStatusS", () => {
  it("should throw an error if the order does not exist", async () => {
    mockFindOrderById.mockResolvedValue(null);

    await expect(
      changeOrderStatusS(orderId, "SHIPPED" as any)
    ).rejects.toThrow("Order Not Found");

    expect(mockUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("should update payment status to COMPLETED when order is DELIVERED", async () => {
    mockFindOrderById
      .mockResolvedValueOnce(existingOrder)
      .mockResolvedValueOnce({
        ...existingOrder,
        orderStatus: "DELIVERED",
        paymentStatus: "COMPLETED",
      });

    const result = await changeOrderStatusS(
      orderId,
      "DELIVERED" as any
    );

    expect(mockUpdateOrderPaymentStatus).toHaveBeenCalledWith(
      orderId,
      "COMPLETED"
    );

    expect(mockUpdateOrderStatus).toHaveBeenCalledWith(
      orderId,
      "DELIVERED"
    );

    expect(result).toEqual({
      ...existingOrder,
      orderStatus: "DELIVERED",
      paymentStatus: "COMPLETED",
    });
  });

  it("should not update payment status if the order is not DELIVERED", async () => {
    mockFindOrderById
      .mockResolvedValueOnce(existingOrder)
      .mockResolvedValueOnce({
        ...existingOrder,
        orderStatus: "SHIPPED",
      });

    await changeOrderStatusS(orderId, "SHIPPED" as any);

    expect(mockUpdateOrderPaymentStatus).not.toHaveBeenCalled();

    expect(mockUpdateOrderStatus).toHaveBeenCalledWith(
      orderId,
      "SHIPPED"
    );
  });
});

// ======================================================
// getOrderS
// ======================================================

describe("getOrderS", () => {
  it("should return the order for an admin", async () => {
    mockFindOrderById.mockResolvedValue(existingOrder);

    const result = await getOrderS(orderId, "admin-id", "admin");

    expect(result).toEqual(existingOrder);
    expect(mockFindOrderById).toHaveBeenCalledWith(orderId);
  });

  it("should throw an error if the order does not exist for a regular user", async () => {
    mockFindOrderById.mockResolvedValue(null);

    await expect(
      getOrderS(orderId, userId, "user")
    ).rejects.toThrow("Order Not Found");
  });

  it("should throw an error if the order belongs to another user", async () => {
    mockFindOrderById.mockResolvedValue({
      ...existingOrder,
      userId: "another-user",
    });

    await expect(
      getOrderS(orderId, userId, "user")
    ).rejects.toThrow("You are not authorized to view this order");
  });

  it("should return the order if it belongs to the current user", async () => {
    mockFindOrderById.mockResolvedValue(existingOrder);

    const result = await getOrderS(orderId, userId, "user");

    expect(result).toEqual(existingOrder);
  });
});