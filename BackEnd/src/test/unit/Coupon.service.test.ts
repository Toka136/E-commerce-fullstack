import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "../../generated/prisma/client";

// Mock repository functions
const {
  mockGetCouponByCode,
  mockGetCouponById,
  mockGetCoupons,
  mockAddCoupon,
  mockEditCoupon,
  mockDeleteCoupon,
  mockDeactivateCoupon,
  mockActivateCoupon,
} = vi.hoisted(() => ({
  mockGetCouponByCode: vi.fn(),
  mockGetCouponById: vi.fn(),
  mockGetCoupons: vi.fn(),
  mockAddCoupon: vi.fn(),
  mockEditCoupon: vi.fn(),
  mockDeleteCoupon: vi.fn(),
  mockDeactivateCoupon: vi.fn(),
  mockActivateCoupon: vi.fn(),
}));

vi.mock("../../modules/Coupon/Coupon.repo", () => ({
  getCouponByCode: mockGetCouponByCode,
  getCouponById: mockGetCouponById,
  getCoupons: mockGetCoupons,
  addCoupon: mockAddCoupon,
  editCoupon: mockEditCoupon,
  deleteCoupon: mockDeleteCoupon,
  deactivateCoupon: mockDeactivateCoupon,
  activateCoupon: mockActivateCoupon,
}));

import {
  addCouponS,
  getCouponS,
  getCouponsS,
  editCouponS,
  deleteCouponS,
  deactivateCouponS,
  activateCouponS,
} from "../../modules/Coupon/Coupon.service";

// Test data
const couponId = "coupon-123";

const couponData = {
  id: couponId,
  code: "SUMMER20",
  type: "FIXED",
  discount: 20,
  minAmount: new Prisma.Decimal(50),
  maxAmount: new Prisma.Decimal(500),
  maxUses: 100,
  useCount: 0,
  maxUsesPerUser: 2,
  isActive: true,
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

const setupValidCoupon = () => {
  mockGetCouponByCode.mockResolvedValue(null);
  mockGetCouponById.mockResolvedValue(couponData);
  mockGetCoupons.mockResolvedValue([couponData]);
  mockAddCoupon.mockResolvedValue(couponData);
  mockEditCoupon.mockResolvedValue(couponData);
  mockDeleteCoupon.mockResolvedValue(couponData);
  mockDeactivateCoupon.mockResolvedValue({
    ...couponData,
    isActive: false,
  });
  mockActivateCoupon.mockResolvedValue({
    ...couponData,
    isActive: true,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
});

// =====================================
// addCouponS
// =====================================

describe("addCouponS", () => {
  it("should add coupon successfully", async () => {
    setupValidCoupon();

    const newCoupon = {
      code: "SUMMER20",
      type: "FIXED",
      discount: 20,
    };

    const result = await addCouponS(newCoupon as any);

    expect(mockGetCouponByCode).toHaveBeenCalledWith("SUMMER20");
    expect(mockAddCoupon).toHaveBeenCalledWith(newCoupon);
    expect(result).toEqual(couponData);
  });

  it("should throw an error if coupon already exists", async () => {
    setupValidCoupon();
    mockGetCouponByCode.mockResolvedValue(couponData);

    await expect(
      addCouponS({ code: "SUMMER20" } as any)
    ).rejects.toThrow("Coupon Already Exists");

    expect(mockAddCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if checking coupon fails", async () => {
    const error = new Error("Database Error");
    mockGetCouponByCode.mockRejectedValue(error);

    await expect(
      addCouponS({ code: "SUMMER20" } as any)
    ).rejects.toBe(error);

    expect(mockAddCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if adding coupon fails", async () => {
    setupValidCoupon();

    const error = new Error("Insert Failed");
    mockAddCoupon.mockRejectedValue(error);

    await expect(
      addCouponS({ code: "SUMMER20" } as any)
    ).rejects.toBe(error);
  });
});

// =====================================
// getCouponS
// =====================================

describe("getCouponS", () => {
  it("should return coupon if it exists", async () => {
    setupValidCoupon();
    mockGetCouponByCode.mockResolvedValue(couponData);
    const result = await getCouponS("SUMMER20");

    expect(mockGetCouponByCode).toHaveBeenCalledWith("SUMMER20");
    expect(result).toEqual(couponData);
  });

  it("should throw an error if coupon does not exist", async () => {
    mockGetCouponByCode.mockResolvedValue(null);

    await expect(
      getCouponS("INVALID")
    ).rejects.toThrow("Coupon Not Found");
  });

  it("should pass repository error", async () => {
    const error = new Error("Database Error");
    mockGetCouponByCode.mockRejectedValue(error);

    await expect(
      getCouponS("SUMMER20")
    ).rejects.toBe(error);
  });
});

// =====================================
// getCouponsS
// =====================================

describe("getCouponsS", () => {
  it("should return all coupons", async () => {
    setupValidCoupon();

    const result = await getCouponsS();

    expect(mockGetCoupons).toHaveBeenCalledOnce();
    expect(result).toEqual([couponData]);
  });

  it("should return empty array if there are no coupons", async () => {
    mockGetCoupons.mockResolvedValue([]);

    const result = await getCouponsS();

    expect(result).toEqual([]);
  });

  it("should pass repository error", async () => {
    const error = new Error("Database Error");
    mockGetCoupons.mockRejectedValue(error);

    await expect(getCouponsS()).rejects.toBe(error);
  });
});

// =====================================
// editCouponS
// =====================================

describe("editCouponS", () => {
  it("should edit coupon successfully", async () => {
    setupValidCoupon();
  

    const updates = {
      discount: 30,
    };

    const result = await editCouponS(couponId, updates as any);

    expect(mockGetCouponById).toHaveBeenCalledWith(couponId);
    expect(mockEditCoupon).toHaveBeenCalledWith(couponId, updates);
    expect(result).toEqual(couponData);
  });

  it("should throw an error if coupon does not exist", async () => {
    mockGetCouponById.mockResolvedValue(null);

    await expect(
      editCouponS(couponId, { discount: 30 } as any)
    ).rejects.toThrow("Coupon Not Found");

    expect(mockEditCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon was already used", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      useCount: 1,
    });

    await expect(
      editCouponS(couponId, { discount: 30 } as any)
    ).rejects.toThrow("Coupon Already Used please create a new one");

    expect(mockEditCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if percentage discount exceeds 90", async () => {
    setupValidCoupon();

    const updates = {
      type: "PERCENTAGE",
      discount: 95,
    };

    await expect(
      editCouponS(couponId, updates as any)
    ).rejects.toThrow("Percentage discount cannot exceed 90%");

    expect(mockEditCoupon).not.toHaveBeenCalled();
  });

  it("should allow percentage discount equal to 90", async () => {
    setupValidCoupon();

    const updates = {
      type: "PERCENTAGE",
      discount: 90,
    };

    await editCouponS(couponId, updates as any);

    expect(mockEditCoupon).toHaveBeenCalledWith(couponId, updates);
  });

  it("should throw an error if endDate is before startDate", async () => {
    setupValidCoupon();

    const updates = {
      startDate: new Date("2027-01-10"),
      endDate: new Date("2027-01-05"),
    };

    await expect(
      editCouponS(couponId, updates as any)
    ).rejects.toThrow("End date must be after start date");

    expect(mockEditCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if endDate equals startDate", async () => {
    setupValidCoupon();

    const sameDate = new Date("2027-01-10");

    await expect(
      editCouponS(couponId, {
        startDate: sameDate,
        endDate: sameDate,
      } as any)
    ).rejects.toThrow("End date must be after start date");
  });

  it("should throw an error if maxAmount is less than minAmount", async () => {
    setupValidCoupon();

    const updates = {
      minAmount: new Prisma.Decimal(200),
      maxAmount: new Prisma.Decimal(100),
    };

    await expect(
      editCouponS(couponId, updates as any)
    ).rejects.toThrow("Max amount cannot be less than min amount");

    expect(mockEditCoupon).not.toHaveBeenCalled();
  });

  it("should allow maxAmount equal to minAmount", async () => {
    setupValidCoupon();

    const updates = {
      minAmount: new Prisma.Decimal(100),
      maxAmount: new Prisma.Decimal(100),
    };

    await editCouponS(couponId, updates as any);

    expect(mockEditCoupon).toHaveBeenCalledWith(couponId, updates);
  });

  it("should pass repository error if getting coupon fails", async () => {
    const error = new Error("Database Error");
    mockGetCouponById.mockRejectedValue(error);

    await expect(
      editCouponS(couponId, { discount: 30 } as any)
    ).rejects.toBe(error);

    expect(mockEditCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if updating coupon fails", async () => {
    setupValidCoupon();

    const error = new Error("Update Failed");
    mockEditCoupon.mockRejectedValue(error);

    await expect(
      editCouponS(couponId, { discount: 30 } as any)
    ).rejects.toBe(error);
  });
});

// =====================================
// deleteCouponS
// =====================================

describe("deleteCouponS", () => {
  it("should delete coupon successfully", async () => {
    setupValidCoupon();

    const result = await deleteCouponS(couponId);

    expect(mockGetCouponById).toHaveBeenCalledWith(couponId);
    expect(mockDeleteCoupon).toHaveBeenCalledWith(couponId);
    expect(result).toEqual(couponData);
  });

  it("should throw an error if coupon does not exist", async () => {
    mockGetCouponById.mockResolvedValue(null);

    await expect(
      deleteCouponS(couponId)
    ).rejects.toThrow("Coupon Not Found");

    expect(mockDeleteCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon was already used", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      useCount: 1,
    });

    await expect(
      deleteCouponS(couponId)
    ).rejects.toThrow("Coupon Already Used please deactivate it");

    expect(mockDeleteCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if getting coupon fails", async () => {
    const error = new Error("Database Error");
    mockGetCouponById.mockRejectedValue(error);

    await expect(
      deleteCouponS(couponId)
    ).rejects.toBe(error);

    expect(mockDeleteCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if deleting coupon fails", async () => {
    setupValidCoupon();

    const error = new Error("Delete Failed");
    mockDeleteCoupon.mockRejectedValue(error);

    await expect(
      deleteCouponS(couponId)
    ).rejects.toBe(error);
  });
});

// =====================================
// deactivateCouponS
// =====================================

describe("deactivateCouponS", () => {
  it("should deactivate coupon successfully", async () => {
    setupValidCoupon();

    const result = await deactivateCouponS(couponId);

    expect(mockGetCouponById).toHaveBeenCalledWith(couponId);
    expect(mockDeactivateCoupon).toHaveBeenCalledWith(couponId);
    expect(result.isActive).toBe(false);
  });

  it("should throw an error if coupon does not exist", async () => {
    mockGetCouponById.mockResolvedValue(null);

    await expect(
      deactivateCouponS(couponId)
    ).rejects.toThrow("Coupon Not Found");

    expect(mockDeactivateCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon is already deactivated", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
    });

    await expect(
      deactivateCouponS(couponId)
    ).rejects.toThrow("Coupon Already Deactivated");

    expect(mockDeactivateCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if getting coupon fails", async () => {
    const error = new Error("Database Error");
    mockGetCouponById.mockRejectedValue(error);

    await expect(
      deactivateCouponS(couponId)
    ).rejects.toBe(error);

    expect(mockDeactivateCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if deactivating coupon fails", async () => {
    setupValidCoupon();

    const error = new Error("Update Failed");
    mockDeactivateCoupon.mockRejectedValue(error);

    await expect(
      deactivateCouponS(couponId)
    ).rejects.toBe(error);
  });
});

// =====================================
// activateCouponS
// =====================================

describe("activateCouponS", () => {
  it("should activate coupon successfully", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
    });

    const result = await activateCouponS(couponId);

    expect(mockGetCouponById).toHaveBeenCalledWith(couponId);
    expect(mockActivateCoupon).toHaveBeenCalledWith(couponId);
    expect(result.isActive).toBe(true);
  });

  it("should throw an error if coupon does not exist", async () => {
    mockGetCouponById.mockResolvedValue(null);

    await expect(
      activateCouponS(couponId)
    ).rejects.toThrow("Coupon Not Found");

    expect(mockActivateCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon is already activated", async () => {
    setupValidCoupon();

    await expect(
      activateCouponS(couponId)
    ).rejects.toThrow("Coupon Already Activated");

    expect(mockActivateCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon is expired", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
      endDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });

    await expect(
      activateCouponS(couponId)
    ).rejects.toThrow("Coupon is expired");

    expect(mockActivateCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon is not available yet", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await expect(
      activateCouponS(couponId)
    ).rejects.toThrow("Coupon is not available yet");

    expect(mockActivateCoupon).not.toHaveBeenCalled();
  });

  it("should throw an error if coupon usage limit is reached", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
      useCount: 100,
      maxUses: 100,
    });

    await expect(
      activateCouponS(couponId)
    ).rejects.toThrow("Coupon usage limit reached");

    expect(mockActivateCoupon).not.toHaveBeenCalled();
  });

  it("should allow activation if maxUses is null", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
      maxUses: null,
    });

    await activateCouponS(couponId);

    expect(mockActivateCoupon).toHaveBeenCalledWith(couponId);
  });

  it("should pass repository error if getting coupon fails", async () => {
    const error = new Error("Database Error");
    mockGetCouponById.mockRejectedValue(error);

    await expect(
      activateCouponS(couponId)
    ).rejects.toBe(error);

    expect(mockActivateCoupon).not.toHaveBeenCalled();
  });

  it("should pass repository error if activating coupon fails", async () => {
    setupValidCoupon();

    mockGetCouponById.mockResolvedValue({
      ...couponData,
      isActive: false,
    });

    const error = new Error("Update Failed");
    mockActivateCoupon.mockRejectedValue(error);

    await expect(
      activateCouponS(couponId)
    ).rejects.toBe(error);
  });
});
