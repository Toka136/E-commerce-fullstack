import BookDetail from "@/features/booksStore/components/bookDetails";
import { getBookA } from "@/features/userDashboard/api/getBook"

type params={
        params:Promise<{id:string}>
    }
export default async function BookDeatils({params}:params){
    const id=(await params).id
    const book=await getBookA(id);
    return(
        <BookDetail book={book.data.book} bookReviews={book.data.bookReviews}/>
    )
}
