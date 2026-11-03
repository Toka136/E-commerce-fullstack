import { beforeEach, describe, expect, it, vi } from "vitest";
import { Request, Response, NextFunction } from "express";

// 1. Mock service functions
const {
  mockAddAddressS,
  mockDeleteAddressS,
  mockGetAddressesS,
  mockGetAddressS,
  mockSetAddressDefaultS,
  mockUpdateAddressS,
} = vi.hoisted(() => ({
  mockAddAddressS: vi.fn(),
  mockDeleteAddressS: vi.fn(),
  mockGetAddressesS: vi.fn(),
  mockGetAddressS: vi.fn(),
  mockSetAddressDefaultS: vi.fn(),
  mockUpdateAddressS: vi.fn(),
}));

vi.mock("../../modules/Address/Address.service", () => ({
  addAddressS: mockAddAddressS,
  deleteAddressS: mockDeleteAddressS,
  getAddressesS: mockGetAddressesS,
  getAddressS: mockGetAddressS,
  setAddressDefaultS: mockSetAddressDefaultS,
  updateAddressS: mockUpdateAddressS,
}));

import {
  addAddressC,
  deleteAddressC,
  getAddressesC,
  getAddressC,
  setAddressDefaultC,
  updateAddressC,
} from "../../modules/Address/Address.controller";

// Test data
const userId = "user-123";
const addressId = "address-123";

const addressData = {
  street: "Main Street",
  city: "Cairo",
  country: "Egypt",
  isDefault: false,
};

const savedAddress = {
  id: addressId,
  ...addressData,
  userId,
};

const addresses = [savedAddress];

// Create request and response mocks
const createMocks = (
  user: { id: string } | null = { id: userId },
  body = {},
  params: Record<string, string | string[]> = {}
) => {
  const req = {
    user,
    body,
    params,
  } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as unknown as NextFunction;

  return { req, res, next };
};

beforeEach(() => {
  vi.clearAllMocks();
});

// =====================================
// addAddressC
// =====================================

describe("addAddressC", () => {
  it("should add address successfully", async () => {
    mockAddAddressS.mockResolvedValue(savedAddress);

    const { req, res, next } = createMocks(
      { id: userId },
      addressData
    );

    await addAddressC(req, res, next);

    expect(mockAddAddressS).toHaveBeenCalledWith(addressData, userId);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Address Added Successfully",
      data: savedAddress,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null, addressData);

    await addAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not logged in",
      })
    );

    expect(mockAddAddressS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service error to next", async () => {
    const error = new Error("Database Error");
    mockAddAddressS.mockRejectedValue(error);

    const { req, res, next } = createMocks(
      { id: userId },
      addressData
    );

    await addAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// =====================================
// getAddressesC
// =====================================

describe("getAddressesC", () => {
  it("should return all user addresses successfully", async () => {
    mockGetAddressesS.mockResolvedValue(addresses);

    const { req, res, next } = createMocks();

    await getAddressesC(req, res, next);

    expect(mockGetAddressesS).toHaveBeenCalledWith(userId);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Address Found Successfully",
      data: addresses,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null);

    await getAddressesC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not logged in",
      })
    );

    expect(mockGetAddressesS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service error to next", async () => {
    const error = new Error("Database Error");
    mockGetAddressesS.mockRejectedValue(error);

    const { req, res, next } = createMocks();

    await getAddressesC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// =====================================
// getAddressC
// =====================================

describe("getAddressC", () => {
  it("should return address successfully", async () => {
    mockGetAddressS.mockResolvedValue(savedAddress);

    const { req, res, next } = createMocks(
      { id: userId },
      { addressId }
    );

    await getAddressC(req, res, next);

    expect(mockGetAddressS).toHaveBeenCalledWith(userId, addressId);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Address Found Successfully",
      data: savedAddress,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(null, { addressId });

    await getAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not logged in",
      })
    );

    expect(mockGetAddressS).not.toHaveBeenCalled();
  });

  it("should pass an error to next if addressId is missing", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      {}
    );

    await getAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Address Id is required",
      })
    );

    expect(mockGetAddressS).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should pass service error to next", async () => {
    const error = new Error("Address Not Found");
    mockGetAddressS.mockRejectedValue(error);

    const { req, res, next } = createMocks(
      { id: userId },
      { addressId }
    );

    await getAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// =====================================
// updateAddressC
// =====================================

describe("updateAddressC", () => {
  it("should update address successfully", async () => {
    const updatedAddress = {
      ...savedAddress,
      city: "Alexandria",
    };

    const updatedData = {
      city: "Alexandria",
    };

    mockUpdateAddressS.mockResolvedValue(updatedAddress);

    const { req, res, next } = createMocks(
      { id: userId },
      updatedData,
      { addressId }
    );

    await updateAddressC(req, res, next);

    expect(mockUpdateAddressS).toHaveBeenCalledWith(
      addressId,
      updatedData
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Address Updated Successfully",
      data: updatedAddress,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if addressId is missing", async () => {
    const { req, res, next } = createMocks(
      { id: userId },
      addressData,
      {}
    );

    await updateAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Address Id is required",
      })
    );

    expect(mockUpdateAddressS).not.toHaveBeenCalled();
  });

  it("should pass service error to next", async () => {
    const error = new Error("Update Failed");
    mockUpdateAddressS.mockRejectedValue(error);

    const { req, res, next } = createMocks(
      { id: userId },
      addressData,
      { addressId }
    );

    await updateAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// =====================================
// deleteAddressC
// =====================================

describe("deleteAddressC", () => {
  it("should delete address successfully", async () => {
    mockDeleteAddressS.mockResolvedValue(savedAddress);

    const { req, res, next } = createMocks(
      { id: userId },
      {},
      { addressId }
    );

    await deleteAddressC(req, res, next);

    expect(mockDeleteAddressS).toHaveBeenCalledWith(addressId);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Address Deleted Successfully",
      data: savedAddress,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if addressId is missing", async () => {
    const { req, res, next } = createMocks();

    await deleteAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Address Id is required",
      })
    );

    expect(mockDeleteAddressS).not.toHaveBeenCalled();
  });

  it("should pass service error to next", async () => {
    const error = new Error("Delete Failed");
    mockDeleteAddressS.mockRejectedValue(error);

    const { req, res, next } = createMocks(
      { id: userId },
      {},
      { addressId }
    );

    await deleteAddressC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// =====================================
// setAddressDefaultC
// =====================================

describe("setAddressDefaultC", () => {
  it("should set address as default successfully", async () => {
    const defaultAddress = {
      ...savedAddress,
      isDefault: true,
    };

    mockSetAddressDefaultS.mockResolvedValue(defaultAddress);

    const { req, res, next } = createMocks(
      { id: userId },
      {},
      { addressId }
    );

    await setAddressDefaultC(req, res, next);

    expect(mockSetAddressDefaultS).toHaveBeenCalledWith(
      userId,
      addressId
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Address Set as Default Successfully",
      data: defaultAddress,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass an error to next if user is not logged in", async () => {
    const { req, res, next } = createMocks(
      null,
      {},
      { addressId }
    );

    await setAddressDefaultC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You are not logged in",
      })
    );

    expect(mockSetAddressDefaultS).not.toHaveBeenCalled();
  });

  it("should pass an error to next if addressId is missing", async () => {
    const { req, res, next } = createMocks();

    await setAddressDefaultC(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Address Id is required",
      })
    );

    expect(mockSetAddressDefaultS).not.toHaveBeenCalled();
  });

  it("should pass service error to next", async () => {
    const error = new Error("Set Default Failed");
    mockSetAddressDefaultS.mockRejectedValue(error);

    const { req, res, next } = createMocks(
      { id: userId },
      {},
      { addressId }
    );

    await setAddressDefaultC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});