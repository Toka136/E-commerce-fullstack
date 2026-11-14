import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";

// ==================== Mocks ====================

const {
  mockCreate,
  mockFindMany,
  mockFindUnique,
  mockUpdate,
} = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    order: {
      create: mockCreate,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  },
}));

import {
  createOrder,
  getOrdersByUserId,
  getOrders,
  findOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
} from "../../modules/Orders/order.repo";

// ==================== Test Data ====================

const userId = "user-123";
const orderId = "order-123";

const orderData = {
  userId,
  subtotal: new Prisma.Decimal(300),
  discountAmount: new Prisma.Decimal(30),
  shippingCost: new Prisma.Decimal(20),
  totalPrice: new Prisma.Decimal(290),
  couponCode: "SAVE10",
  paymentMethod: "CASH",
  paymentStatus: "PENDING",
  orderStatus: "PENDING",

  orderItems: [
    {
      bookId: "book-123",
      quantity: 2,
      price: new Prisma.Decimal(150),
    },
  ],

  orderShippingAddress: {
    fullName: "Test User",
    phone: "01000000000",
    city: "Cairo",
    street: "Test Street",
  },
};

const createdOrder = {
  id: orderId,
  ...orderData,
};

const tx = {
  order: {
    create: mockCreate,
  },
} as unknown as Prisma.TransactionClient;

// ==================== Reset Mocks ====================

beforeEach(() => {
  vi.clearAllMocks();
});

// ======================================================
// createOrder
// ======================================================

describe("createOrder", () => {
  it("should create an order with the correct data", async () => {
    mockCreate.mockResolvedValue(createdOrder);

    const result = await createOrder(orderData as any, tx);

    expect(result).toEqual(createdOrder);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: orderData.userId,
        subtotal: orderData.subtotal,
        discountAmount: orderData.discountAmount,
        shippingCost: orderData.shippingCost,
        totalPrice: orderData.totalPrice,
        couponCode: orderData.couponCode,

        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        orderStatus: orderData.orderStatus,

        orderItems: {
          create: orderData.orderItems,
        },

        orderShippingAddress: {
          create: orderData.orderShippingAddress,
        },
      },
      include: {
        orderItems: true,
        orderShippingAddress: true,
      },
    });
  });

  it("should use null if couponCode is undefined", async () => {
    mockCreate.mockResolvedValue(createdOrder);

    const orderWithoutCoupon = {
      ...orderData,
      couponCode: undefined,
    };

    await createOrder(orderWithoutCoupon as any, tx);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          couponCode: null,
        }),
      })
    );
  });

  it("should use the provided transaction", async () => {
    mockCreate.mockResolvedValue(createdOrder);

    await createOrder(orderData as any, tx);

    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("should propagate repository errors", async () => {
    const error = new Error("Database error");

    mockCreate.mockRejectedValue(error);

    await expect(
      createOrder(orderData as any, tx)
    ).rejects.toThrow("Database error");
  });
});

// ======================================================
// getOrdersByUserId
// ======================================================

describe("getOrdersByUserId", () => {
  it("should return orders belonging to the specified user", async () => {
    const orders = [createdOrder];

    mockFindMany.mockResolvedValue(orders);

    const result = await getOrdersByUserId(userId);

    expect(result).toEqual(orders);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: true,
        orderShippingAddress: true,
      },
    });
  });

  it("should return an empty array if the user has no orders", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getOrdersByUserId(userId);

    expect(result).toEqual([]);
  });

  it("should propagate repository errors", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    await expect(getOrdersByUserId(userId)).rejects.toThrow(
      "Database error"
    );
  });
});

// ======================================================
// getOrders
// ======================================================

describe("getOrders", () => {
  it("should return all orders sorted by creation date descending", async () => {
    const orders = [createdOrder];

    mockFindMany.mockResolvedValue(orders);

    const result = await getOrders();

    expect(result).toEqual(orders);

    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: true,
        orderShippingAddress: true,
      },
    });
  });

  it("should return an empty array if there are no orders", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getOrders();

    expect(result).toEqual([]);
  });

  it("should propagate repository errors", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    await expect(getOrders()).rejects.toThrow("Database error");
  });
});

// ======================================================
// findOrderById
// ======================================================

describe("findOrderById", () => {
  it("should return the order with its items and shipping address", async () => {
    mockFindUnique.mockResolvedValue(createdOrder);

    const result = await findOrderById(orderId);

    expect(result).toEqual(createdOrder);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: orderId },
      include: {
        orderItems: true,
        orderShippingAddress: true,
      },
    });
  });

  it("should return null if the order does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await findOrderById(orderId);

    expect(result).toBeNull();
  });

  it("should propagate repository errors", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    await expect(findOrderById(orderId)).rejects.toThrow(
      "Database error"
    );
  });
});

// ======================================================
// updateOrderStatus
// ======================================================

describe("updateOrderStatus", () => {
  it("should update the order status", async () => {
    mockUpdate.mockResolvedValue({ id: orderId });

    await updateOrderStatus(orderId, "SHIPPED" as any);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: orderId },
      data: {
        orderStatus: "SHIPPED",
      },
    });
  });

  it("should propagate repository errors", async () => {
    mockUpdate.mockRejectedValue(new Error("Database error"));

    await expect(
      updateOrderStatus(orderId, "SHIPPED" as any)
    ).rejects.toThrow("Database error");
  });
});

// ======================================================
// updateOrderPaymentStatus
// ======================================================

describe("updateOrderPaymentStatus", () => {
  it("should update the order payment status", async () => {
    mockUpdate.mockResolvedValue({ id: orderId });

    await updateOrderPaymentStatus(orderId, "PAID" as any);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
      },
    });
  });

  it("should propagate repository errors", async () => {
    mockUpdate.mockRejectedValue(new Error("Database error"));

    await expect(
      updateOrderPaymentStatus(orderId, "PAID" as any)
    ).rejects.toThrow("Database error");
  });
});