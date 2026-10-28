import { beforeEach, describe, expect, vi ,it} from "vitest";
import { addBookWishListS, deleteBookWS, getWishListS } from "../../modules/Wishlist/WishList.service";
import { deleteBookW } from "../../modules/Wishlist/WishList.repo";
import { responseStatus } from "../../utils/responseStatus";
import appError from "../../utils/errorClass";

const{
  mockAddEmptyWishList,
  mockAddBookW,
  mockAddWishList,
  mockDeleteBookW, 
  mockGetWishListByUserId, 
  mockWHasBook
}=vi.hoisted(()=>({
  mockAddEmptyWishList: vi.fn(),
  mockAddBookW: vi.fn(),
  mockAddWishList: vi.fn(),
  mockDeleteBookW: vi.fn(),
  mockGetWishListByUserId: vi.fn(),
  mockWHasBook: vi.fn()
}))
vi.mock("../../modules/Wishlist/WishList.repo", () => ({
  addEmptyWishList: mockAddEmptyWishList,
  addBookW: mockAddBookW,
  addWishList: mockAddWishList,
  deleteBookW: mockDeleteBookW,
  getWishListByUserId: mockGetWishListByUserId,
  WHasBook: mockWHasBook
}))
describe("wishList Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })
  describe("getWishListS",()=>{
    beforeEach(() => {
      vi.clearAllMocks();
    })
    it("should return  existing wishList",async()=>{
      const userId="1"
      const wishList={
        "id":"1",
        "userId":"1",
        "items":[{"title":"1","coverImage":"1","price":1,"stock":1,"author":"1","id":"1"}]
      }
      mockGetWishListByUserId.mockResolvedValue(wishList)
      const result=await getWishListS(userId)
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(result).toEqual(wishList)
      expect(mockAddEmptyWishList).not.toHaveBeenCalled()

    })
    it("should create and return a new wishList",async()=>{
      const userId="1"
      mockGetWishListByUserId.mockResolvedValue(null)
      mockAddEmptyWishList.mockResolvedValue({
        "id":"1",
        "userId":"1",
        "items":[]
      })
      const result=await getWishListS(userId)
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockAddEmptyWishList).toHaveBeenCalledWith(userId)
      expect(result).toEqual({
        "id":"1",
        "userId":"1",
        "items":[]
      })
    })
  })
  describe("addBookWishListS",()=>{
    beforeEach(() => {
      vi.clearAllMocks();
    })
    const userId="1"
    const bookId="1"
    it("should create new wishlist and add book",async()=>{
      mockGetWishListByUserId.mockResolvedValue(null)
      
      const result=await addBookWishListS(userId,bookId)
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockAddWishList).toHaveBeenCalledWith(userId,[bookId])
      expect(result).toEqual(bookId)
      expect(mockAddBookW).not.toHaveBeenCalled()
      expect(mockWHasBook).not.toHaveBeenCalled()

    })
    it("return existing bookId",async()=>{
      mockGetWishListByUserId.mockResolvedValue({
        "id":"1",
        "userId":"1",
        "items":[{"id":"1"}]
      })
      mockWHasBook.mockResolvedValue("1")
      const result=await addBookWishListS(userId,bookId)
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockWHasBook).toHaveBeenCalledWith(userId,bookId)
      expect(result).toEqual("1")
      expect(mockAddWishList).not.toHaveBeenCalled()
      expect(mockAddBookW).not.toHaveBeenCalled()

    })
    it("should add book to existing wishlist",async()=>{
      mockGetWishListByUserId.mockResolvedValue({
        "id":"1",
        "userId":"1",
        "items":[]
      })
      mockWHasBook.mockResolvedValue(null)
      mockAddBookW.mockResolvedValue("1")
      const result=await addBookWishListS(userId,bookId)
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockWHasBook).toHaveBeenCalledWith(userId,bookId)
      expect(result).toEqual("1")
      expect(mockAddBookW).toHaveBeenCalledWith(bookId, userId);
      expect(mockAddWishList).not.toHaveBeenCalled()
    })
      it("should propagate error if adding book fails", async () => {
    mockGetWishListByUserId.mockResolvedValue({
      id: "1",
      userId,
      items: [],
    });

    mockWHasBook.mockResolvedValue(null);

    const error = new Error("Failed to add book");
    mockAddBookW.mockRejectedValue(error);

    await expect(addBookWishListS(userId, bookId)).rejects.toThrow(
      "Failed to add book"
    );

    expect(mockAddBookW).toHaveBeenCalledWith(bookId, userId);
  });
  })
  describe("deleteBookWS",()=>{
    beforeEach(() => {
      vi.clearAllMocks();
    })
    const userId="1"
    const bookId="1"
    it("should delete book from wishlist",async()=>{
      mockGetWishListByUserId.mockResolvedValue({
        "id":"1",
        "userId":"1",
        "items":[{"id":"1"}]
      })
      mockWHasBook.mockResolvedValue("1")
      mockDeleteBookW.mockResolvedValue("1")
      const result=await deleteBookWS(userId,bookId)
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockWHasBook).toHaveBeenCalledWith(userId,bookId)
      expect(result).toEqual("1")
      expect(mockDeleteBookW).toHaveBeenCalledWith(userId,bookId)
    })
    it("should throw error if wishlist not found",async()=>{
      mockGetWishListByUserId.mockResolvedValue(null)
      
      const error = await deleteBookWS(userId, bookId).catch((err) => err);

    expect(error).toBeInstanceOf(appError);
    expect(error).toMatchObject({
      message: "WishList Not Found",
      statusCode: 404,
      statusText: responseStatus.FAILED,
      });
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockWHasBook).not.toHaveBeenCalled()
      expect(mockDeleteBookW).not.toHaveBeenCalled()
    })
    it("should throw error if book not found",async()=>{
      mockGetWishListByUserId.mockResolvedValue({
        "id":"1",
        "userId":"1",
        "items":[]
      })
      mockWHasBook.mockResolvedValue(null)
      
      const error = await deleteBookWS(userId, bookId).catch((err) => err);

    expect(error).toBeInstanceOf(appError);
    expect(error).toMatchObject({
      message: "book Not Found In Wishlist",
      statusCode: 404,
      statusText: responseStatus.FAILED,
      });
      expect(mockGetWishListByUserId).toHaveBeenCalledWith(userId)
      expect(mockWHasBook).toHaveBeenCalledWith(userId,bookId)
      expect(mockDeleteBookW).not.toHaveBeenCalled()
    })
  })
});