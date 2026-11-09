import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Prisma methods
const {
  mockCreate,
  mockFindUnique,
  mockFindMany,
  mockUpdate,
  mockDelete,
} = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindUnique: vi.fn(),
  mockFindMany: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    coupon: {
      create: mockCreate,
      findUnique: mockFindUnique,
      findMany: mockFindMany,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}));

import {
  addCoupon,
  getCouponByCode,
  getCouponById,
  getCoupons,
  editCoupon,
  deleteCoupon,
  deactivateCoupon,
  activateCoupon,
} from "../../modules/Coupon/Coupon.repo";

// Test data
const couponId = "coupon-123";

const couponData = {
  id: couponId,
  code: "SUMMER20",
  type: "FIXED",
  discount: 20,
  minAmount: 50,
  maxAmount: 500,
  maxUses: 100,
  useCount: 5,
  maxUsesPerUser: 2,
  isActive: true,
  startDate: new Date("2026-01-01"),
  endDate: new Date("2027-01-01"),
};

const newCoupon = {
  code: "SUMMER20",
  type: "FIXED",
  discount: 20,
  minAmount: 50,
  maxAmount: 500,
  maxUses: 100,
  maxUsesPerUser: 2,
  startDate: new Date("2026-01-01"),
  endDate: new Date("2027-01-01"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// =====================================
// addCoupon
// =====================================

describe("addCoupon", () => {
  it("should create a coupon successfully", async () => {
    mockCreate.mockResolvedValue(couponData);

    const result = await addCoupon(newCoupon as any);

    expect(mockCreate).toHaveBeenCalledWith({
      data: newCoupon,
    });

    expect(result).toEqual(couponData);
  });

  it("should pass repository error if creating coupon fails", async () => {
    const error = new Error("Create Failed");
    mockCreate.mockRejectedValue(error);

    await expect(addCoupon(newCoupon as any)).rejects.toBe(error);
  });
});

// =====================================
// getCouponByCode
// =====================================

describe("getCouponByCode", () => {
  it("should return coupon by code", async () => {
    mockFindUnique.mockResolvedValue(couponData);

    const result = await getCouponByCode("SUMMER20");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { code: "SUMMER20" },
    });

    expect(result).toEqual(couponData);
  });

  it("should return null if coupon does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getCouponByCode("INVALID");

    expect(result).toBeNull();
  });

  it("should pass repository error", async () => {
    const error = new Error("Database Error");
    mockFindUnique.mockRejectedValue(error);

    await expect(getCouponByCode("SUMMER20")).rejects.toBe(error);
  });
});

// =====================================
// getCouponById
// =====================================

describe("getCouponById", () => {
  it("should return coupon by ID", async () => {
    mockFindUnique.mockResolvedValue(couponData);

    const result = await getCouponById(couponId);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: couponId },
    });

    expect(result).toEqual(couponData);
  });

  it("should return null if coupon does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getCouponById(couponId);

    expect(result).toBeNull();
  });

  it("should pass repository error", async () => {
    const error = new Error("Database Error");
    mockFindUnique.mockRejectedValue(error);

    await expect(getCouponById(couponId)).rejects.toBe(error);
  });
});

// =====================================
// getCoupons
// =====================================

describe("getCoupons", () => {
  it("should return all coupons", async () => {
    mockFindMany.mockResolvedValue([couponData]);

    const result = await getCoupons();

    expect(mockFindMany).toHaveBeenCalledOnce();
    expect(result).toEqual([couponData]);
  });

  it("should return empty array if no coupons exist", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getCoupons();

    expect(result).toEqual([]);
  });

  it("should pass repository error", async () => {
    const error = new Error("Database Error");
    mockFindMany.mockRejectedValue(error);

    await expect(getCoupons()).rejects.toBe(error);
  });
});

// =====================================
// editCoupon
// =====================================

describe("editCoupon", () => {
  it("should update coupon successfully", async () => {
    const updates = { discount: 30 };

    const updatedCoupon = {
      ...couponData,
      discount: 30,
    };

    mockUpdate.mockResolvedValue(updatedCoupon);

    const result = await editCoupon(couponId, updates as any);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: couponId },
      data: updates,
    });

    expect(result).toEqual(updatedCoupon);
  });

  it("should pass repository error if updating coupon fails", async () => {
    const error = new Error("Update Failed");
    mockUpdate.mockRejectedValue(error);

    await expect(
      editCoupon(couponId, { discount: 30 } as any)
    ).rejects.toBe(error);
  });
});

// =====================================
// deleteCoupon
// =====================================

describe("deleteCoupon", () => {
  it("should delete coupon successfully", async () => {
    mockDelete.mockResolvedValue(couponData);

    const result = await deleteCoupon(couponId);

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: couponId },
    });

    expect(result).toEqual(couponData);
  });

  it("should pass repository error if deleting coupon fails", async () => {
    const error = new Error("Delete Failed");
    mockDelete.mockRejectedValue(error);

    await expect(deleteCoupon(couponId)).rejects.toBe(error);
  });
});

// =====================================
// deactivateCoupon
// =====================================

describe("deactivateCoupon", () => {
  it("should deactivate coupon successfully", async () => {
    const deactivatedCoupon = {
      ...couponData,
      isActive: false,
    };

    mockUpdate.mockResolvedValue(deactivatedCoupon);

    const result = await deactivateCoupon(couponId);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: couponId },
      data: { isActive: false },
    });

    expect(result).toEqual(deactivatedCoupon);
  });

  it("should pass repository error", async () => {
    const error = new Error("Deactivate Failed");
    mockUpdate.mockRejectedValue(error);

    await expect(deactivateCoupon(couponId)).rejects.toBe(error);
  });
});

// =====================================
// activateCoupon
// =====================================

describe("activateCoupon", () => {
  it("should activate coupon successfully", async () => {
    const activatedCoupon = {
      ...couponData,
      isActive: true,
    };

    mockUpdate.mockResolvedValue(activatedCoupon);

    const result = await activateCoupon(couponId);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: couponId },
      data: { isActive: true },
    });

    expect(result).toEqual(activatedCoupon);
  });

  it("should pass repository error", async () => {
    const error = new Error("Activate Failed");
    mockUpdate.mockRejectedValue(error);

    await expect(activateCoupon(couponId)).rejects.toBe(error);
  });
});