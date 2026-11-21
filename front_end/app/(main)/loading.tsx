import { CircularProgress } from "@mui/material";

export default function Loading(){
    return <div className="flex justify-center items-center h-screen bg-[#F8F9FF]">
        <CircularProgress color="primary" />
    </div>
}