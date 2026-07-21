import { bookT } from "@/features/BooksManagment/types/Books"
import { UseAddToCart } from "@/features/Cart/hooks/useAddToCart"
import { Plus } from "lucide-react"

export default function BookCard({book}:{book:bookT}){
  const {useHandleAddToCart}=UseAddToCart()
  const handleAddToCart = () => {
    useHandleAddToCart(book)
    
  }
    return (
        <div key={book._id} className="flex-none w-44 md:w-52 snap-start">
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="aspect-[2/3] w-full bg-[#d3e4fe]">
                    <img
                      src={`http://localhost:4000/api/Uploads/${book.coverImage}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-semibold text-[#6049c6] mb-1">
                      {book.genre}
                    </p>
                    <h3 className="text-base font-semibold truncate">{book.title}</h3>
                    <p className="text-sm text-[#444652] mb-2">{book.author}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#3455b9]">
                        {book.price}
                      </span>
                      <button
                        aria-label={`Add ${book.title} to cart`}
                        className="w-8 h-8 rounded-full bg-[#b6c4ff]/20 text-[#3455b9] flex items-center justify-center hover:bg-[#3455b9] hover:text-white transition-all"
                      >
                        <Plus onClick={handleAddToCart} size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
    )
}