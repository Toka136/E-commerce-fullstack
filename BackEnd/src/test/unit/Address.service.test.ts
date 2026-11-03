import { beforeEach, describe, expect, it, vi } from "vitest";

// 1. Mock repository functions
const {
  mockAddAddress,
  mockDeleteAddress,
  mockGetAddress,
  mockGetAddresses,
  mockRemoveDefaultAddress,
  mockSetAddressDefault,
  mockSetAddressUnDefault,
  mockThereisDefault,
  mockUpdateAddress,
} = vi.hoisted(() => ({
  mockAddAddress: vi.fn(),
  mockDeleteAddress: vi.fn(),
  mockGetAddress: vi.fn(),
  mockGetAddresses: vi.fn(),
  mockRemoveDefaultAddress: vi.fn(),
  mockSetAddressDefault: vi.fn(),
  mockSetAddressUnDefault: vi.fn(),
  mockThereisDefault: vi.fn(),
  mockUpdateAddress: vi.fn(),
}));

vi.mock("../../modules/Address/Address.repo", () => ({
  addAddress: mockAddAddress,
  deleteAddress: mockDeleteAddress,
  getAddress: mockGetAddress,
  getAddresses: mockGetAddresses,
  removeDefaultAddress: mockRemoveDefaultAddress,
  setAddressDefault: mockSetAddressDefault,
  setAddressUnDefault: mockSetAddressUnDefault,
  thereisDefault: mockThereisDefault,
  updateAddress: mockUpdateAddress,
}));

import {
  addAddressS,
  deleteAddressS,
  getAddressS,
  getAddressesS,
  setAddressDefaultS,
  setAddressUnDefaultS,
  updateAddressS,
} from "../../modules/Address/Address.service";

// Test data
const userId = "user-123";
const addressId = "address-123";

const addressData = {
    title: "Home",
    addressLine1: "123 Main St",
    state: "CA",
    postalCode: "90001",
    mobile: "1234567890",
  street: "Main Street",
  city: "Cairo",
  country: "Egypt",
  isDefault: false,
} as Parameters<typeof addAddressS>[0];

const savedAddress = {
  id: addressId,
  ...addressData,
  userId,
};

const addresses = [savedAddress];

beforeEach(() => {
  vi.clearAllMocks();
});

// =====================================
// addAddressS
// =====================================

describe("addAddressS", () => {
  it("should add address as default if user has no default address", async () => {
    mockThereisDefault.mockResolvedValue(null);
    mockAddAddress.mockResolvedValue(savedAddress);

    const result = await addAddressS(addressData, userId);

    expect(mockThereisDefault).toHaveBeenCalledWith(userId);

    expect(mockAddAddress).toHaveBeenCalledWith({
      address: expect.objectContaining({
        isDefault: true,
      }),
      userId,
    });

    expect(result).toEqual(savedAddress);
  });

  it("should add address as non-default if user already has a default address", async () => {
    mockThereisDefault.mockResolvedValue(savedAddress);
    mockAddAddress.mockResolvedValue(savedAddress);

    const result = await addAddressS(addressData, userId);

    expect(mockThereisDefault).toHaveBeenCalledWith(userId);

    expect(mockAddAddress).toHaveBeenCalledWith({
      address: expect.objectContaining({
        isDefault: false,
      }),
      userId,
    });

    expect(result).toEqual(savedAddress);
  });

  it("should throw an error if thereisDefault fails", async () => {
    const error = new Error("Database Error");

    mockThereisDefault.mockRejectedValue(error);

    await expect(addAddressS(addressData, userId)).rejects.toThrow(
      "Database Error"
    );

    expect(mockAddAddress).not.toHaveBeenCalled();
  });
});

// =====================================
// getAddressesS
// =====================================

describe("getAddressesS", () => {
  it("should return all addresses of the user", async () => {
    mockGetAddresses.mockResolvedValue(addresses);

    const result = await getAddressesS(userId);

    expect(mockGetAddresses).toHaveBeenCalledWith(userId);
    expect(result).toEqual(addresses);
  });

  it("should return empty array if user has no addresses", async () => {
    mockGetAddresses.mockResolvedValue([]);

    const result = await getAddressesS(userId);

    expect(result).toEqual([]);
  });
});

// =====================================
// getAddressS
// =====================================

describe("getAddressS", () => {
  it("should return address if it belongs to the user", async () => {
    mockGetAddress.mockResolvedValue(savedAddress);

    const result = await getAddressS(userId, addressId);

    expect(mockGetAddress).toHaveBeenCalledWith(addressId);
    expect(result).toEqual(savedAddress);
  });

  it("should throw an error if address belongs to another user", async () => {
    mockGetAddress.mockResolvedValue({
      ...savedAddress,
      userId: "another-user",
    });

    await expect(
      getAddressS(userId, addressId)
    ).rejects.toThrow("You are not authorized");

    expect(mockGetAddress).toHaveBeenCalledWith(addressId);
  });

  it("should return null if address does not exist", async () => {
    mockGetAddress.mockResolvedValue(null);

    const result = await getAddressS(userId, addressId);

    expect(result).toBeNull();
  });
});

// =====================================
// updateAddressS
// =====================================

describe("updateAddressS", () => {
  it("should update address and add updatedAt", async () => {
    const updatedData = {
      city: "Alexandria",
      street: "New Street",
      updatedAt: new Date(),
    
    } as Parameters<typeof updateAddressS>[1];

    mockUpdateAddress.mockResolvedValue({
      ...savedAddress,
      ...updatedData,
    });

    const result = await updateAddressS(addressId, updatedData);

    expect(mockUpdateAddress).toHaveBeenCalledWith(
      addressId,
      expect.objectContaining({
        ...updatedData,
        updatedAt: expect.any(Date),
      })
    );

    expect(result).toEqual({
      ...savedAddress,
      ...updatedData,
    });
  });
});

// =====================================
// setAddressDefaultS
// =====================================

describe("setAddressDefaultS", () => {
  it("should remove previous default address then set the new one as default", async () => {
    mockRemoveDefaultAddress.mockResolvedValue({ count: 1 });
    mockSetAddressDefault.mockResolvedValue({
      ...savedAddress,
      isDefault: true,
    });

    const result = await setAddressDefaultS(userId, addressId);

    expect(mockRemoveDefaultAddress).toHaveBeenCalledWith(userId);
    expect(mockSetAddressDefault).toHaveBeenCalledWith(addressId);

    // Make sure the previous default is removed first
    const removeCallOrder =
    mockRemoveDefaultAddress.mock.invocationCallOrder[0];

    const setCallOrder =
    mockSetAddressDefault.mock.invocationCallOrder[0];

    expect(removeCallOrder).toBeDefined();
    expect(setCallOrder).toBeDefined();

    expect(removeCallOrder!).toBeLessThan(setCallOrder!);
    
  });

  it("should not set new default if removing previous default fails", async () => {
    mockRemoveDefaultAddress.mockRejectedValue(
      new Error("Database Error")
    );

    await expect(
      setAddressDefaultS(userId, addressId)
    ).rejects.toThrow("Database Error");

    expect(mockSetAddressDefault).not.toHaveBeenCalled();
  });
});

// =====================================
// setAddressUnDefaultS
// =====================================

describe("setAddressUnDefaultS", () => {
  it("should set address as non-default", async () => {
    mockSetAddressUnDefault.mockResolvedValue({
      ...savedAddress,
      isDefault: false,
    });

    const result = await setAddressUnDefaultS(addressId);

    expect(mockSetAddressUnDefault).toHaveBeenCalledWith(addressId);

    expect(result).toEqual({
      ...savedAddress,
      isDefault: false,
    });
  });
});

// =====================================
// deleteAddressS
// =====================================

describe("deleteAddressS", () => {
  it("should delete address", async () => {
    mockDeleteAddress.mockResolvedValue(savedAddress);

    const result = await deleteAddressS(addressId);

    expect(mockDeleteAddress).toHaveBeenCalledWith(addressId);
    expect(result).toEqual(savedAddress);
  });
});