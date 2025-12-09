"use server"

import DashboardContainer from "@/components/util/AppContainer"
import { DailyPlan } from "@/app/api/mealsTest/route"

import { NutritionPageCtxProvider } from "@/components/nutritionpage/nutritionPageProvider"
import NutritionPageClientWrapper from "@/components/nutritionpage/nutritionPageClientWrapper"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { authenticateUser } from "@/utils/authenticateUser"



export default async function NutritionPage() {
        const cookieStore = await cookies()
        const token = cookieStore.get("jwtNutrifyS")?.value
    
        if (!token) {
            redirect("/login")
        }
    
        const user = await authenticateUser(token)
        if (!user) {
            redirect("/login")
        }


    const res = await fetch("http://localhost:3000/api/mealsTest")
    const personActivites: DailyPlan[] = await res.json()

    const personActivitiesForId = personActivites.find(
        (activity) => activity.personId === 11,
    )

    //console.log(personActivitiesForId?.waterConsumption, "personActivites")

    //fetching data for user

 
    return (
        <DashboardContainer>
        <h2 className="text-DarkGreen pb-6 text-xl font-medium">
                Nutrition
            </h2>
            <NutritionPageCtxProvider> 
                <NutritionPageClientWrapper initialDailyPlanForId={personActivitiesForId ? [personActivitiesForId] : undefined}  />
    
            </NutritionPageCtxProvider>
        </DashboardContainer>
    )
}
