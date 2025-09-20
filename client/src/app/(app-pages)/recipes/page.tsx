"use server"

import { cookies } from "next/headers"
import SideMenu from "@/components/util/SideMenu"
import Header from "@/components/util/AppHeader"

import { redirect } from "next/navigation"
import AppContainer from "@/components/util/AppContainer"
import { authenticateUser } from "@/utils/authenticateUser"
import RecipesClientWrapper from "@/components/recipes/recipedClientWrapper"
import { CartModalProvider } from "@/components/recipes/cartModalCtx"

export default async function Recipes() {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwtNutrifyS")?.value

    if (!token) {
        redirect("/login")
    }

    const user = await authenticateUser(token)
    console.log("User from dashboard:", user)
    if (!user) {
        redirect("/login")
    }

    return (
        <div className="h-screen w-full bg-[#FAF9F6]">
            <SideMenu />
            <Header />
            <div className="bg-[#FAF9F6] pt-[100px] pb-10">
                <AppContainer>
                    <CartModalProvider>
                        <div className="flex flex-col gap-6">
                            <RecipesClientWrapper />
                        </div>
                    </CartModalProvider>
                </AppContainer>
            </div>
        </div>
    )
}
