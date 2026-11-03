import { beforeEach, describe, expect, it, vi } from "vitest";

// ==================== Mocks ====================

const {
  mockCreate,
  mockFindMany,
  mockFindUnique,
  mockUpdate,
  mockDelete,
  mockUpdateMany,
  mockFindFirst,
} = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockUpdateMany: vi.fn(),
  mockFindFirst: vi.fn(),
}));

vi.mock("../../config/prisma", () => ({
  prisma: {
    address: {
      create: mockCreate,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      update: mockUpdate,
      delete: mockDelete,
      updateMany: mockUpdateMany,
      findFirst: mockFindFirst,
    },
  },
}));

import {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  removeDefaultAddress,
  setAddressDefault,
  setAddressUnDefault,
  thereisDefault,
} from "../../modules/Address/Address.repo";
import { address } from "../../modules/Address/Address.types";

// ==================== Test Data ====================

const userId = "user-123";
const addressId = "address-123";

const addressData:address = {
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    title: "Home",
    city: "Cairo",
    state: "Giza",
    country: "Egypt",
    isDefault: false,
    postalCode: "12345",
    mobile: "123-456-7890",
};

const addressCreated = {
  id: addressId,
  userId,
  ...addressData,
};

const addresses = [addressCreated, {
  id: "address-456",
  userId,
  street: "Second Street",
  city: "Giza",
  country: "Egypt",
  isDefault: true,
}];

// ==================== Reset Mocks ====================

beforeEach(() => {
  vi.clearAllMocks();
});

// ======================================================
// addAddress
// ======================================================

describe("addAddress", () => {
  it("should create a new address with userId", async () => {
    const input = {
      address: addressData,
      userId,
    } as Parameters<typeof addAddress>[0];

    mockCreate.mockResolvedValue(addressCreated);

    const result = await addAddress(input);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        ...addressData,
        userId,
      },
    });

    expect(result).toEqual(addressCreated);
  });

  it("should throw an error if Prisma create fails", async () => {
    const input = {
      address: addressData,
      userId,
    } as Parameters<typeof addAddress>[0];

    const error = new Error("Database Error");

    mockCreate.mockRejectedValue(error);

    await expect(addAddress(input)).rejects.toThrow("Database Error");
  });
});

// ======================================================
// getAddresses
// ======================================================

describe("getAddresses", () => {
  it("should return all addresses belonging to the user", async () => {
    mockFindMany.mockResolvedValue(addresses);

    const result = await getAddresses(userId);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(result).toEqual(addresses);
  });

  it("should return an empty array if user has no addresses", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getAddresses(userId);

    expect(result).toEqual([]);
  });
});

// ======================================================
// getAddress
// ======================================================

describe("getAddress", () => {
  it("should return an address by its ID", async () => {
    mockFindUnique.mockResolvedValue(addressCreated);

    const result = await getAddress(addressId);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: addressId },
    });

    expect(result).toEqual(addressCreated);
  });

  it("should return null if address does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await getAddress(addressId);

    expect(result).toBeNull();
  });
});

// ======================================================
// updateAddress
// ======================================================

describe("updateAddress", () => {
  it("should update an address by its ID", async () => {
    const updatedData = {
        updatedAt: new Date(),
      city: "Alexandria",
      street: "New Street",
    } as Parameters<typeof updateAddress>[1];

    const updatedAddress = {
      ...addressCreated,
      ...updatedData,
    };

    mockUpdate.mockResolvedValue(updatedAddress);

    const result = await updateAddress(addressId, updatedData);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: addressId },
      data: { ...updatedData },
    });

    expect(result).toEqual(updatedAddress);
  });
});

// ======================================================
// deleteAddress
// ======================================================

describe("deleteAddress", () => {
  it("should delete an address by its ID", async () => {
    mockDelete.mockResolvedValue(addressCreated);

    const result = await deleteAddress(addressId);

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: addressId },
    });

    expect(result).toEqual(addressCreated);
  });
});

// ======================================================
// removeDefaultAddress
// ======================================================

describe("removeDefaultAddress", () => {
  it("should remove default status from all user's default addresses", async () => {
    const updateResult = {
      count: 1,
    };

    mockUpdateMany.mockResolvedValue(updateResult);

    const result = await removeDefaultAddress(userId);

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    expect(result).toEqual(updateResult);
  });
});

// ======================================================
// setAddressDefault
// ======================================================

describe("setAddressDefault", () => {
  it("should set an address as default", async () => {
    const defaultAddress = {
      ...addressCreated,
      isDefault: true,
    };

    mockUpdate.mockResolvedValue(defaultAddress);

    const result = await setAddressDefault(addressId);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: addressId },
      data: { isDefault: true },
    });

    expect(result).toEqual(defaultAddress);
  });
});

// ======================================================
// setAddressUnDefault
// ======================================================

describe("setAddressUnDefault", () => {
  it("should remove default status from an address", async () => {
    const nonDefaultAddress = {
      ...addressCreated,
      isDefault: false,
    };

    mockUpdate.mockResolvedValue(nonDefaultAddress);

    const result = await setAddressUnDefault(addressId);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: addressId },
      data: { isDefault: false },
    });

    expect(result).toEqual(nonDefaultAddress);
  });
});

// ======================================================
// thereisDefault
// ======================================================

describe("thereisDefault", () => {
  it("should return the user's default address", async () => {
    const defaultAddress = {
      ...addressCreated,
      isDefault: true,
    };

    mockFindFirst.mockResolvedValue(defaultAddress);

    const result = await thereisDefault(userId);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        userId,
        isDefault: true,
      },
    });

    expect(result).toEqual(defaultAddress);
  });

  it("should return null if user has no default address", async () => {
    mockFindFirst.mockResolvedValue(null);

    const result = await thereisDefault(userId);

    expect(result).toBeNull();
  });
});
