import { useFormik } from "formik";
import { addBookSchema } from "../schema/addBookSchema";
import { addBookT } from "../types/Books";
import { AddBook } from "../api/booksApi";
import { UseAddBook } from "../hooks/useAddBook";
import { UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

export const AddBookForm = ({handleClose}:{handleClose:()=>void}) => {
    const [isDragging,setIsDragging]=useState(false)
    const [imagePreview,setImagePreview]=useState<string|null>(null)
    const imageRef=useRef<HTMLInputElement>(null)
    const bookFormik=useFormik<addBookT>(
        {
            initialValues: {
              title: '',
              author: '',
              genre: '',
              description: '',
              coverImage: null,
              price: 0,
              stock: 0
            },
            onSubmit:()=>{
              UseAddBook(bookFormik.values)
              handleClose()
            },
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
    return <div>
            <form onSubmit={bookFormik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#444652]">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              onChange={bookFormik.handleChange}
              value={bookFormik.values.title}
              placeholder="e.g. The Great Adventure"
              className="w-full px-4 py-3 rounded-xl border-none bg-[#eff4ff] focus:ring-2 focus:ring-[#3455b9] transition-all"
            />
          </div>
          {bookFormik.errors.title && bookFormik.touched.title && <p className="text-red-500">{bookFormik.errors.title}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#444652]">
                Author
              </label>
              <input
                type="text"
                name="author"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.author}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl border-none bg-[#eff4ff] focus:ring-2 focus:ring-[#3455b9] transition-all"
              />
            </div>
            {bookFormik.errors.author && bookFormik.touched.author && <p className="text-red-500">{bookFormik.errors.author}</p>}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#444652]">
                Genre
              </label>
             <input
                type="text"
                name="genre"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.genre}
                placeholder="e.g. Fiction"
                />
            </div>
            {bookFormik.errors.genre && bookFormik.touched.genre && <p className="text-red-500">{bookFormik.errors.genre}</p>}
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#444652]">
                Retail Price ($)
              </label>
              <input
                type="number"
                name="price"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.price}
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border-none bg-[#eff4ff] focus:ring-2 focus:ring-[#3455b9] transition-all"
              />
            </div>
            {bookFormik.errors.price && bookFormik.touched.price && <p className="text-red-500">{bookFormik.errors.price}</p>}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#444652]">
                Opening Stock
              </label>
              <input
                type="number"
                name="stock"
                onChange={bookFormik.handleChange}
                value={bookFormik.values.stock}
                step="1"
                className="w-full px-4 py-3 rounded-xl border-none bg-[#eff4ff] focus:ring-2 focus:ring-[#3455b9] transition-all"
              />
            </div>
            {bookFormik.errors.stock && bookFormik.touched.stock && <p className="text-red-500">{bookFormik.errors.stock}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#444652]">
              Book Description
            </label>
            <textarea
              rows={4}
              name="description"
              onChange={bookFormik.handleChange}
              value={bookFormik.values.description}
              
              placeholder="Brief summary of the book..."
              className="w-full px-4 py-3 rounded-xl border-none bg-[#eff4ff] focus:ring-2 focus:ring-[#3455b9] transition-all"
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
                  src={imagePreview} 
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
             <footer className="p-6 border-t border-[#c4c5d5]/20 flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-[#444652] hover:bg-[#dce9ff] transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 px-6 py-3 rounded-xl font-semibold bg-[#3455b9] text-white shadow-md hover:shadow-lg active:scale-95 transition-all">
            Save Book
          </button>
        </footer>
        </form>

     
    </div>;
};