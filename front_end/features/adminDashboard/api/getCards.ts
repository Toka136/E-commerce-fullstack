import { api } from "@/axios/api"
import { DashboardCardsResponse } from "../types/adminDashboard"
import { apiServer } from "@/axios/apiServer"

export const getCards = async (): Promise<DashboardCardsResponse> => {
  const res = await apiServer.get("adminDashboard/Cards")
  console.log("card",res.data)
  return res.data
}