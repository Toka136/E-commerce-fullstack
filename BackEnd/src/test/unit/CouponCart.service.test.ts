import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";

// 1. Mock repository functions
const {
  mockGetCouponById,
  mockGetCouponUsage,
  mockGetCartByUserId,
  mockAddCouponToCart,
} = vi.hoisted(() => ({
  mockGetCouponById: vi.fn(),
  mockGetCouponUsage: vi.fn(),
  mockGetCartByUserId: vi.fn(),
  mockAddCouponToCart: vi.fn(),
}));

vi.mock("../../modules/Coupon/Coupon.repo", () => ({
  getCouponById: mockGetCouponById,
 
}));
vi.mock("../../modules/CouponUsage/CouponUsage.repo", () => ({
     getCouponUsageByUserIdAndCouponId: mockGetCouponUsage,
}));

vi.mock("../../modules/Cart/Cart.repo", () => ({
  getCartByUserId: mockGetCartByUserId,
  addCouponToCart: mockAddCouponToCart,
}));

import { addCouponToCartS } from "../../modules/Cart/Cart.service";

// Test data
const userId = "user-123";
const couponId = "coupon-123";

const couponData = {
  id: couponId,
  isActive: true,
  type: "FIXED",
  discount: 20,
  minAmount: new Prisma.Decimal(50),
  maxAmount: new Prisma.Decimal(500),
  maxUses: 100,
  useCount: 5,
  maxUsesPerUser: 2,
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

const cartData = {
  userId,
  couponId: null,
  subtotal: new Prisma.Decimal(100),
};

const newCart = {
  ...cartData,
  couponId,
  discountAmount: new Prisma.Decimal(20),
};

const setupValidScenario = () => {
  mockGetCouponById.mockResolvedValue(couponData);
  mockGetCartByUserId.mockResolvedValue(cartData);
  mockGetCouponUsage.mockResolvedValue(0);
  mockAddCouponToCart.mockResolvedValue(newCart);
};

beforeEach(() => {
  vi.clearAllMocks();
});

// =====================================
// addCouponToCartS
// =====================================

describe("addCouponToCartS", () => {

  // Success cases

  it("should apply a FIXED coupon successfully", async () => {
    setupValidScenario();

    const result = await addCouponToCartS({ userId, couponId });

    expect(mockGetCouponById).toHaveBeenCalledWith(couponId);
    expect(mockGetCartByUserId).toHaveBeenCalledWith(userId);
    expect(mockGetCouponUsage).toHaveBeenCalledWith(userId, couponId);

    expect(mockAddCouponToCart).toHaveBeenCalledWith(
      userId,
      couponId,
      new Prisma.Decimal(20)
    );

    expect(result).toEqual({
      cart: newCart,
      finalTotal: new Prisma.Decimal(80),
    });
  });

  it("should calculate PERCENTAGE discount correctly", async () => {
    setupValidScenario();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      type: "PERCENTAGE",
      discount: 20,
    });

    const result = await addCouponToCartS({ userId, couponId });

    expect(mockAddCouponToCart).toHaveBeenCalledWith(
      userId,
      couponId,
      new Prisma.Decimal(20)
    );

    expect(result.finalTotal).toEqual(new Prisma.Decimal(80));
  });

  it("should not allow discount to exceed cart subtotal", async () => {
    setupValidScenario();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      type: "FIXED",
      discount: 150,
    });

    const result = await addCouponToCartS({ userId, couponId });

    expect(mockAddCouponToCart).toHaveBeenCalledWith(
      userId,
      couponId,
      new Prisma.Decimal(100)
    );

    expect(result.finalTotal).toEqual(new Prisma.Decimal(0));
  });

  // Coupon validation

  it("should throw an error if coupon does not exist", async () => {
    mockGetCouponById.mockResolvedValue(null);
    mockGetCartByUserId.mockResolvedValue(cartData);

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Coupon Not Found");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon is already applied", async () => {
    setupValidScenario();

    mockGetCartByUserId.mockResolvedValue({
      ...cartData,
      couponId: "another-coupon",
    });

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Coupon Already Applied");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if cart does not exist", async () => {
    mockGetCouponById.mockResolvedValue(couponData);
    mockGetCartByUserId.mockResolvedValue(null);

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Cart Not Found");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon is inactive", async () => {
    setupValidScenario();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
    });

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Coupon is not active");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if cart subtotal is less than minAmount", async () => {
    setupValidScenario();

    mockGetCartByUserId.mockResolvedValue({
      ...cartData,
      subtotal: new Prisma.Decimal(30),
    });

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Invalid Cart Amount");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if cart subtotal is greater than maxAmount", async () => {
    setupValidScenario();

    mockGetCartByUserId.mockResolvedValue({
      ...cartData,
      subtotal: new Prisma.Decimal(600),
    });

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Invalid Cart Amount");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should ignore maxAmount if it is zero", async () => {
    setupValidScenario();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      maxAmount: new Prisma.Decimal(0),
    });

    const result = await addCouponToCartS({ userId, couponId });

    expect(result.finalTotal).toEqual(new Prisma.Decimal(80));
  });

  it("should throw an error if coupon usage limit is reached", async () => {
    setupValidScenario();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      useCount: 100,
      maxUses: 100,
    });

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Coupon usage limit reached");

    expect(mockGetCouponUsage).not.toHaveBeenCalled();
    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon date is not valid", async () => {
    setupValidScenario();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Invalid Coupon Date");

    expect(mockGetCouponUsage).not.toHaveBeenCalled();
    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  it("should throw an error if user usage limit is reached", async () => {
    setupValidScenario();

    mockGetCouponUsage.mockResolvedValue(2);

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Coupon usage limit reached");

    expect(mockAddCouponToCart).not.toHaveBeenCalled();
  });

  // Repository errors

  it("should pass repository error if getting coupon fails", async () => {
    const error = new Error("Database Error");

    mockGetCouponById.mockRejectedValue(error);

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Database Error");

    expect(mockGetCartByUserId).not.toHaveBeenCalled();
  });

  it("should pass repository error if adding coupon to cart fails", async () => {
    setupValidScenario();

    const error = new Error("Update Failed");
    mockAddCouponToCart.mockRejectedValue(error);

    await expect(
      addCouponToCartS({ userId, couponId })
    ).rejects.toThrow("Update Failed");
  });
});