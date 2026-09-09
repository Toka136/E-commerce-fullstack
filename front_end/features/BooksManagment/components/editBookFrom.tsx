import { useFormik } from "formik";
import { addBookSchema } from "../schema/addBookSchema";
import { addBookT, editBookT } from "../types/Books";
import {  GetSingleBook } from "../api/booksApi";
import { UseAddBook } from "../hooks/useAddBook";
import { UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseEditBook } from "../hooks/useEditBook";
import { Category } from "@/features/categories/types/categories";

export const EditBookForm = ({handleClose,book,categories}:{handleClose:()=>void,book:editBookT,categories:Category[]}) => {
  console.log("booformk",book)
    const [isDragging,setIsDragging]=useState(false)
    const [imagePreview,setImagePreview]=useState<string|null>(book.coverImage??null)
    const imageRef=useRef<HTMLInputElement>(null)
    const[loading,setLoading]=useState(true)
    const {mutateAsync:editBook,isPending:editPending}=UseEditBook()
    const handleEditBook=async(data:editBookT)=>{
      try{
        await editBook(data)
        handleClose()
      }catch(error){
        console.log(error)
      }
    }
    const bookFormik=useFormik<editBookT>(
        {enableReinitialize: true,

            initialValues: {
              _id:book?._id??"",
              title: book?.title??"",
              author: book?.author??"",
              slug: book?.category?.slug??"",
              description: book?.description??"",
              coverImage: book?.coverImage??undefined,
              price: book?.price??0,
              stock: book?.stock??0,
              pages: book?.pages??0
            },
            onSubmit: handleEditBook        
            ,
            validationSchema: addBookSchema
          }
    )
     
    const handleCancel=()=>{
        bookFormik.resetForm()
        bookFormik.setFieldValue("coverImage",null)
        handleClose()
    }
    const handleImageFile=(file:File)=>{
        if(file.type.startsWith("image/")){
            bookFormik.setFieldValue("coverImage",file)
            const reader=new FileReader()
            reader.onloadend=()=>{
              setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)

        }
    }
    const handleDragOver=(e:React.DragEvent)=>{
      e.preventDefault();
      setIsDragging(true)
    }
    const handleDragLeave=(e:React.DragEvent)=>{
      e.preventDefault();
      setIsDragging(false)
    }
    const handleDrop=(e:React.DragEvent)=>{
      e.preventDefault();
      setIsDragging(false);
      if(e.dataTransfer.files&&e.dataTransfer.files[0]){
        handleImageFile(e.dataTransfer.files[0])
      }

    }
    return(
        <>
        {book&&
          <div>
            <form onSubmit={bookFormik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              readOnly
              value={bookFormik.values.title}
              placeholder="e.g. The Great Adventure"
              className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-lowfocus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface-variant">
                Author
              </label>
              <input
                type="text"
                name="author"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.author}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-lowfocus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {bookFormik.errors.author && bookFormik.touched.author && <p className="text-red-500">{bookFormik.errors.author}</p>}
           
          <div className="space-y-1">
                        <label className="text-sm font-semibold text-on-surface-variant">
                          Category
                        </label>
          
                        <div>
                          <select
                            name="slug"
                            onChange={bookFormik.handleChange}
                            onBlur={bookFormik.handleBlur}
                            value={bookFormik.values.slug}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                          >
                            <option value="">Select a category</option>
          
                            {categories.map((category: Category) => (
                              <option key={category._id} value={category.slug}>
                                {category.name}
                              </option>
                            ))}
                          </select>
          
                          {bookFormik.errors.slug && bookFormik.touched.slug && (
                            <p className="text-red-500">{bookFormik.errors.slug}</p>
                          )}
                        </div>
                      </div>
                      {bookFormik.errors.slug && bookFormik.touched.slug && <p className="text-red-500">{bookFormik.errors.slug}</p>}
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface-variant">
                Retail Price ($)
              </label>
              <input
                type="number"
                name="price"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.price}
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-lowfocus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {bookFormik.errors.price && bookFormik.touched.price && <p className="text-red-500">{bookFormik.errors.price}</p>}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface-variant">
                Opening Stock
              </label>
              <input
                type="number"
                name="stock"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.stock}
                step="1"
                className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-lowfocus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {bookFormik.errors.stock && bookFormik.touched.stock && <p className="text-red-500">{bookFormik.errors.stock}</p>}
          </div>
            {/* pages */}
          <div className="grid grid-cols-2 gap-4">
        
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface-variant">
                Pages Number
              </label>
              <input
                type="number"
                name="pages"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.pages}
                step="1"
                className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-low focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {bookFormik.errors.pages && bookFormik.touched.pages && <p className="text-red-500">{bookFormik.errors.pages}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant">
              Book Description
            </label>
            <textarea
              rows={4}
              name="description"
              onChange={bookFormik.handleChange}
              value={bookFormik.values.description}
              
              placeholder="Brief summary of the book..."
              className="w-full px-4 py-3 rounded-xl border-none bg-surface-container-lowfocus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          {bookFormik.errors.description && bookFormik.touched.description && <p className="text-red-500">{bookFormik.errors.description}</p>}
  <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            
            <input 
            type="file"
            className="hidden"
            accept="image/*"
            ref={imageRef}
            onChange={(e)=>{
              if(e.target.files && e.target.files[0]){
                handleImageFile(e.target.files[0])
              }
            }}
            />

            {!imagePreview ? (
              <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              onClick={()=>imageRef.current?.click()}
              
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/30' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                }`}
              >
                <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-xs font-medium text-gray-600 text-center">
                  <span className="text-blue-500 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, or GIF</p>
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto group">
                <img 
                  src={`http://localhost:4000/api/Uploads/${imagePreview}`} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-full ring-2 ring-gray-100"
                />
                <button
                  type="button"
                
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
           
          </div>
             <footer className="p-6 border-t border-outline-variant/20 flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-md hover:shadow-lg active:scale-95 transition-all">
            Save Book
          </button>
        </footer>
        </form>

     
    </div>
}
        
        </>
    )
   
};