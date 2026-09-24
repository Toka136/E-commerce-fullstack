import { CircularProgress } from "@mui/material"

export const LoaderC=()=>{
   return <div className="flex justify-center items-center h-screen bg-[#F8F9FF]">
            <CircularProgress color="primary" />
        </div>
}