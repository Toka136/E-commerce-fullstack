import { CursorTimeoutMode } from "mongodb";
import appError from "../../utils/errorClass";
import { responseStatus } from "../../utils/responseStatus";
import { deleteBook, findBookById, findBookByName, findBooks, getBooksCount, insertBook, updateBook } from "./book.repo";
import { editBookI, bookI, queryI, addBookBodyI, insertBookI } from "./book.types";
import fs from "fs"
import path from "path";
import { getCategory } from "../Categories/Category.repo";
import { getBookReviews } from "../Reviews/review.repo";
import redis from "../../config/redis";
import invalidateCache from "../../utils/invalidateCache";
import cloudinary from "../../config/cloudinaryconfig";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { Prisma } from "../../generated/prisma/client";
export const addBook_S = async (
  body: addBookBodyI,
  file?: Express.Multer.File
) => {
  if (!file) {
    throw new appError(
      "Book Cover Image Is Required",
      400,
      responseStatus.FAILED
    );
  }

  const {
    title,
    author,
    slug,
    price,
    description,
    stock,
    pages,
  } = body;

  const bookCategory = await getCategory(slug);

  if (!bookCategory) {
    throw new appError(
      "Category Not Found",
      400,
      responseStatus.FAILED
    );
  }

  const oldBook = await findBookByName(title);

  if (oldBook) {
    throw new appError(
      "Book Already Exists",
      400,
      responseStatus.FAILED
    );
  }

  const newBook: insertBookI = {
    title,
    author,
    categoryId: bookCategory.id,
    price: Number(price),
    description,
    stock: Number(stock),
    coverImage: "",
    pages: Number(pages),
    imagePublicId: "",
  };

  let uploadedImage;

  try {
    uploadedImage = await uploadToCloudinary(
      file.buffer,
      "books"
    );

    newBook.coverImage = uploadedImage.secure_url;
    newBook.imagePublicId = uploadedImage.public_id;

    const result = await insertBook(newBook);

    await invalidateCache("books:list:");

    return result;
  } catch (error) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(
        uploadedImage.public_id
      );
    }

    throw error;
  }
};

export const editBook_S = async (
  body: editBookI,
  file?: Express.Multer.File
) => {
  const book = await findBookById(body.id);

  if (!book) {
    throw new appError(
      "Book Not Found",
      400,
      responseStatus.FAILED
    );
  }

  let bookCategory = book.categoryId;

  if (body.slug) {
    const category = await getCategory(body.slug);

    if (!category) {
      throw new appError(
        "Category Not Found",
        400,
        responseStatus.FAILED
      );
    }

    bookCategory = category.id;
  }

  if (!file && !book.coverImage) {
    throw new appError(
      "Book Cover Image Is Required",
      400,
      responseStatus.FAILED
    );
  }

  const newBook: insertBookI = {
    title: book.title,
    author: body.author ?? book.author,
    categoryId: bookCategory,
    price: body.price != null
      ? Number(body.price)
      : book.price.toNumber(),
    description: body.description ?? book.description,
    stock: body.stock != null
      ? Number(body.stock)
      : book.stock,
    coverImage: book.coverImage,
    pages: body.pages != null
      ? Number(body.pages)
      : book.pages,
    imagePublicId: book.imagePublicId ?? "",
  };

  let uploadedImage;

  try {
    if (file) {
      uploadedImage = await uploadToCloudinary(
        file.buffer,
        "books"
      );

      newBook.coverImage = uploadedImage.secure_url;
      newBook.imagePublicId = uploadedImage.public_id;
    }

    const result = await updateBook(
      newBook,
      body.id
    );

    if (file && book.imagePublicId) {
      await cloudinary.uploader.destroy(
        book.imagePublicId
      );
    }

    await invalidateCache("books:list:");
    await invalidateCache(`book:${body.id}`);

    return result;
  } catch (error) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(
        uploadedImage.public_id
      );
    }

    throw error;
  }
};

export const deleteBook_S = async (id: string) => {
  const book = await findBookById(id);

  if (!book) {
    throw new appError(
      "Book Not Found",
      400,
      responseStatus.FAILED
    );
  }

  // Delete book from database first
  await deleteBook(id);

  // Delete image from Cloudinary
  if (book.imagePublicId) {
    await cloudinary.uploader.destroy(
      book.imagePublicId
    );
  }

  await invalidateCache("books:list:");
  await invalidateCache(`book:${id}`);
};
export const getBook_S = async (id: string) => {
  const cachKey = `book:${id}`;
  const cachedBook = await redis.get(cachKey);

  if (cachedBook) {
    return typeof cachedBook === "string"
      ? JSON.parse(cachedBook)
      : cachedBook;
  }

  const book = await findBookById(id);

  if (!book) {
    throw new appError("Book Not Found", 400, responseStatus.FAILED);
  }

  const bookReviews = await getBookReviews(id);

  const data = { book, bookReviews };

  await redis.set(cachKey, JSON.stringify(data), { ex: 300 });

  return data;
};

export const getBooks_S=async(query:queryI)=>{
 const pageSize=query.pageSize?parseInt(String(query.pageSize)):10
    const currentPage=query.currentPage?parseInt(String(query.currentPage)):1
    const skip=(pageSize*(currentPage-1))
     const filter: Prisma.BookWhereInput = {};
    if (query.searchText) {
        const searchText = query.searchText;
        filter.OR = [{title:{contains:searchText,mode:"insensitive"}},{author:{contains:searchText,mode:"insensitive"}},{description:{contains:searchText,mode:"insensitive"}}]
    }
    if(query.category){
        const category=await getCategory(query.category)
        if(!category){
            throw new appError("Category Not Found",400,responseStatus.FAILED)
        }
        filter.categoryId=category.id
    }
    if(query.minPrice||query.maxPrice){
        filter.price={}
        if(query.minPrice){
        filter.price.gte= Number(query.minPrice);
    }
        if(query.maxPrice){
        filter.price.lte= Number(query.maxPrice);
    }
    }
    
let sort: Prisma.BookOrderByWithRelationInput[] = [];

switch (query.sort) {
  case "price-asc":
    sort = [{ price: "asc" }, { id: "asc" }];
    break;

  case "price-desc":
    sort = [{ price: "desc" }, { id: "desc" }];
    break;

  case "newest":
    sort = [{ createdAt: "desc" }, { id: "desc" }];
    break;

  case "oldest":
    sort = [{ createdAt: "asc" }, { id: "asc" }];
    break;

  default:
    sort = [{ createdAt: "desc" }, { id: "desc" }];
}
    query.pageSize=pageSize
   const cacheKey =
        `books:list:${currentPage}:${pageSize}:` +
        `${query.searchText || ""}:` +
        `${query.category || ""}:` +
        `${query.minPrice || ""}:` +
        `${query.maxPrice || ""}:` +
        `${query.sort || "newest"}`;

    // Check Redis
   const cached = await redis.get(cacheKey);



if (cached) {
    return typeof cached === "string"
      ? JSON.parse(cached)
      : cached;
}
    const resultData=await findBooks(query,skip,filter ,sort)
    const totalCount=await getBooksCount(filter)
    const result={
        books:resultData,
       currentPage:query.currentPage?parseInt(String(query.currentPage)):1,
       pageSize:query.pageSize?query.pageSize:10,
       totalPage:Math.ceil(totalCount/(query.pageSize?query.pageSize:10)),
       totalCount
    }
    await redis.set(cacheKey,JSON.stringify(result),{
        ex:60
    })
  
    return result
}