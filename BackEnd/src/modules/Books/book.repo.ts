import { ClientSession } from "mongoose"
import Book  from "./book.modal"
import { bookI, editBookI, insertBookI, queryI } from "./book.types"
export const findBookByName=async(title:string)=>{
    return await Book.findOne({title})
}
export const insertBook=async(book:insertBookI)=>{
    const newBook=new Book(book)
     await newBook.save()
     return newBook
}
export const findBookById=async(id:string,session?:ClientSession)=>{
    return await Book.findById(id,null).populate({path:"category",select:{__v:0,description:0}}).session(session??null)
}
export const updateBook=async(book:bookI,id:string)=>{
     const newbook=await Book.findByIdAndUpdate(id,book,{new:true})
     return newbook
}
export const deleteBook=async(id:string)=>{
    const result=await Book.deleteOne({_id:id})
    return result
}
export const findBooks=async(query:queryI,skip:number,filter:any,sort?:any)=>{
   
    return await Book.find(filter).populate({path:"category",select:{__v:0,description:0}}).sort(sort).skip(skip).limit(query.pageSize!)
}
export const getBooksCount=async(filter:any)=>{
    return await Book.countDocuments(filter)
}
export const findOrderBooks=async(orderBooksIds:string[],session:ClientSession)=>{
    return await Book.find({_id:{$in:orderBooksIds}},null,{session})
}
export const updateStock=async(bookId:string,quantity:number,session:ClientSession)=>{
    const result=await Book.findByIdAndUpdate(bookId,{$inc:{stock:-quantity}},{new:true,session})
    return result
}
export const getBooksbyCategory=async(category:string)=>{
    return await Book.find({category})
}
export const addRate=async(bookId:string,rate:number)=>{
    console.log("rate",rate);
    return await Book.findByIdAndUpdate(
  bookId,
  [
    {
      $set: {
        "rate.average": {
          $divide: [
            {
              $add: [
                {
                  $multiply: ["$rate.average", "$rate.count"],
                },
                rate,
              ],
            },
            {
              $add: ["$rate.count", 1],
            },
          ],
        },
        "rate.count": {
          $add: ["$rate.count", 1],
        },
      },
    },
  ],
  {
    new: true,
    updatePipeline: true,
  }
);
}
export const editRate=async(bookId:string,rate:number,oldRate:number)=>{
    console.log("rate",rate);
    return await Book.findByIdAndUpdate(
  bookId,
  [
    {
      $set: {
        "rate.average": {
          $divide: [
            {
              $add: [
                {
                    $subtract: [
                        {
                  $multiply: ["$rate.average", "$rate.count"],
                },oldRate
                ]
                },
                rate,
              ],
            },
            "$rate.count"
           
          ],
        },
        
      },
    },
  ],
  {
    new: true,
    updatePipeline: true,
  }
);
}
export const deleteRate = async (bookId: string, rate: number) => {
  return await Book.findByIdAndUpdate(
    bookId,
    [
      {
        $set: {
          "rate.average": {
            $cond: [
              { $eq: ["$rate.count", 1] },
              0,
              {
                $divide: [
                  {
                    $subtract: [
                      {
                        $multiply: ["$rate.average", "$rate.count"],
                      },
                      rate,
                    ],
                  },
                  {
                    $subtract: ["$rate.count", 1],
                  },
                ],
              },
            ],
          },
          "rate.count": {
            $cond: [
              { $eq: ["$rate.count", 1] },
              0,
              {
                $subtract: ["$rate.count", 1],
              },
            ],
          },
        },
      },
    ],
    {
      new: true,
      updatePipeline: true,
    }
  );
};