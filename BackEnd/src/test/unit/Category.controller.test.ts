import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

import { addCategoryS, deleteCategoryS, getCategoriesS, getCategoryS, updateCategoryS } from "../../modules/Categories/Category.service";
import { addCategoryC, deleteCategoryC, getCategoriesC, getCategoryC, updateCategoryC } from "../../modules/Categories/Category.controller";
import { be } from "zod/locales";
import { responseStatus } from "../../utils/responseStatus";

vi.mock("../../modules/categories/Category.service", () => ({
  addCategoryS: vi.fn(),
  deleteCategoryS: vi.fn(),
  getCategoriesS: vi.fn(),
  getCategoryS: vi.fn(),
  updateCategoryS: vi.fn(),
}));

describe("addCategoryC", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      body: {
        name: "Science Fiction",
        description: "Science fiction books",
      },
    } as Request;

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    next = vi.fn();
  });

  it("should add a category and return success response", async () => {
    const newCategory = {
      id: "category-1",
      name: "Science Fiction",
      description: "Science fiction books",
      slug: "science-fiction",
    };

    vi.mocked(addCategoryS).mockResolvedValue(newCategory as any);

    await addCategoryC(req, res, next);

    expect(addCategoryS).toHaveBeenCalledWith({
      name: "Science Fiction",
      description: "Science fiction books",
      slug: "",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Category Added Successfully",
      data: newCategory,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass the error to next if adding a category fails", async () => {
    const error = new Error("Category Already Exist");

    vi.mocked(addCategoryS).mockRejectedValue(error);

    await addCategoryC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
describe("getCategoriesC", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {} as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    next = vi.fn();
  });
  it("should get all categories and return success response", async () => {
    const categories = [
      { name: "Science Fiction", slug: "science-fiction" },
      { name: "History", slug: "history" },
    ];

    vi.mocked(getCategoriesS).mockResolvedValue(categories as any);

    await getCategoriesC(req, res, next);

    expect(getCategoriesS).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Categories Found Successfully",
      data: categories,
    });
    expect(next).not.toHaveBeenCalled();
  })
  it("pass the error to next if getting categories fails", async () => {
    const error = new Error("Failed to get categories");

    vi.mocked(getCategoriesS).mockRejectedValue(error);

    await getCategoriesC(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });
});
describe("getCategoryC", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
        params: {
            slug: "science-fiction",
        },
    } as unknown as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    next = vi.fn();
  });
  it("should get a category and return success response", async () => {
    const category = {
      id: "category-1",
      name: "Science Fiction",
      description: "Science fiction books",
      slug: "science-fiction",
    };

    vi.mocked(getCategoryS).mockResolvedValue(category as any);

    await getCategoryC(req, res, next);

    expect(getCategoryS).toHaveBeenCalledWith("science-fiction");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Category Found Successfully",
      data: category,
    });
    expect(next).not.toHaveBeenCalled();
  })
  it("should pass the error to next if getting a category fails", async () => {
      const error = new Error("Category Not Found");

      vi.mocked(getCategoryS).mockRejectedValue(error);

      await getCategoryC(req, res, next);
     
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
  })
  it("should pass an error to next if slug is missing", async () => {
    req.params = {} as Request["params"];

    await getCategoryC(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: "slug is required",
      statusCode: 400,
      statusText: responseStatus.FAILED,
    }));

    expect(getCategoryS).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
describe ("deleteCategoryC",()=>{
    let req: Request;
    let res: Response;
    let next: NextFunction;
    beforeEach(() => {
        vi.clearAllMocks();
        req = {
            params: {
                id: "category-1",
            },
        } as unknown as Request;
        res = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn().mockReturnThis(),
        } as unknown as Response;
        next = vi.fn();
    })
    it("should delete a category and return success response",async()=>{
        
        vi.mocked(deleteCategoryS).mockResolvedValue(undefined)
        await deleteCategoryC(req,res,next)
        expect(deleteCategoryS).toHaveBeenCalledWith("category-1")
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status:"success",
            message:"Category Deleted Successfully",
            data:undefined
        })
        expect(next).not.toHaveBeenCalled()
    })
    it("should pass the error to next if deleting a category fails",async()=>{
        const error=new Error("Category Has Products")
        vi.mocked(deleteCategoryS).mockRejectedValue(error)
        await deleteCategoryC(req,res,next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res.json).not.toHaveBeenCalled()
    })
    it("should pass an error to next if id is missing", async () => {
    req.params = {} as Request["params"];

    await deleteCategoryC(req, res, next);

    expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
        message: "id is required",
         statusCode: 400,
         statusText: responseStatus.FAILED,
        })
    );

    expect(deleteCategoryS).not.toHaveBeenCalled();
    });
})
describe ("updateCategoryC",()=>{
    let req: Request;
    let res: Response;
    let next: NextFunction;
    beforeEach(() => {
        vi.clearAllMocks();
        req = {
            params: {
                slug: "science-fiction",
            },
            body: {
                description: "Science fiction books",
            },
        } as unknown as Request;
        res = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn().mockReturnThis(),
        } as unknown as Response;
        next = vi.fn();
    })
    it("should update a category and return success response",async()=>{
        const category={
            id:"category-1",
            name:"Science Fiction",
            description:"Science fiction books",
            slug:"science-fiction"
        }
        vi.mocked(updateCategoryS).mockResolvedValue(category)
        await updateCategoryC(req,res,next)
        expect(updateCategoryS).toHaveBeenCalledWith("science-fiction","Science fiction books")
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status:"success",
            message:"Category Updated Successfully",
            data:category
        })
        expect(next).not.toHaveBeenCalled()
    })
    it("should pass the error to next if updating a category fails",async()=>{
        const error=new Error("Category Not Found")
        vi.mocked(updateCategoryS).mockRejectedValue(error)
        await updateCategoryC(req,res,next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res.json).not.toHaveBeenCalled()
    })
    it("should pass an error to next if slug is missing", async () => {
        req.params = {} as Request["params"];
    
        await updateCategoryC(req, res, next);
    
        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "slug is required",
             statusCode: 400,
             statusText: responseStatus.FAILED,
          })
        );
    
        expect(updateCategoryS).not.toHaveBeenCalled();
      });
})
