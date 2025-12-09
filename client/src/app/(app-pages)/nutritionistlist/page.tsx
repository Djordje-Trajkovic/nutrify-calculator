"use server"

import AppContainer from "@/components/util/AppContainer"
import NutritionistListClientWrapper from "@/components/nutritionlistpage/nutritionistListClientWraper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { authenticateUser } from "@/utils/authenticateUser"

const NutritionistListPage = async () => {
          const cookieStore = await cookies()
            const token = cookieStore.get("jwtNutrifyS")?.value
        
            if (!token) {
                redirect("/login")
            }
        
            const user = await authenticateUser(token)
            if (!user) {
                redirect("/login")
            }


    return (
        <AppContainer>
            <div className="flex h-full flex-col gap-6 bg-[#FAF9F6]">
                <NutritionistListClientWrapper />
            </div>
        </AppContainer>
    )
}

export default NutritionistListPage
