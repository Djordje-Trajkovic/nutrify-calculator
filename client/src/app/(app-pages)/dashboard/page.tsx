import { cookies } from "next/headers"
import TodaysFoodInteake from "@/components/dashboardpage/todaysFoodIntakes"
import React from "react"
import AppContainer from "../../../components/util/AppContainer"
import YourNextMeal from "@/components/dashboardpage/yourNextMeal"
import YourNextTraining from "@/components/dashboardpage/yourNextTraining"
import TodaysTimeline from "@/components/dashboardpage/todaysTimeline"
import GrocerysForNextMeal from "@/components/dashboardpage/grocerysForNextMeal"

import {
    mealsSortedByTime,
    trainingSortedByTime,
} from "@/utils/activitySortByTime"
import { DailyPlan } from "@/app/api/mealsTest/route"
// import {Meal, MealType, Training} from "@/app/api/mealsTest/route"
import { redirect } from "next/navigation"

import { authenticateUser } from "@/utils/authenticateUser"

export default async function DashboardPage() {
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

    const res = await fetch("http://localhost:3000/api/mealsTest", {
        cache: "no-store",
    })
    const personActivities: DailyPlan[] = await res.json()

    let totalCalories = 0
    let totalProteins = 0
    let totalFats = 0
    let totalCarbohydrates = 0

    const personActivitiesForId = personActivities.find(
        (activity) => activity.personId === user.id,
    )

    if (personActivitiesForId) {
        personActivitiesForId.mealPlan.forEach((entry) => {
            if ("meal" in entry) {
                totalCalories += entry.meal.calories
                totalProteins += entry.meal.proteins
                totalFats += entry.meal.fats
                totalCarbohydrates += entry.meal.carbohydrates
            }
        })
    }

    const nextTraining = personActivitiesForId?.trainingPlan
        ? trainingSortedByTime(personActivitiesForId.trainingPlan)
        : null

    const nextMeal = personActivitiesForId?.mealPlan
        ? mealsSortedByTime(personActivitiesForId.mealPlan)
        : null

    const sortedActivities = [
        ...(personActivitiesForId?.mealPlan?.map((meal) => ({
            type: "meal" as const,
            ...meal,
        })) || []),
        ...(personActivitiesForId?.trainingPlan?.map((training) => ({
            type: "training" as const,
            ...training,
        })) || []),
    ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

    return (
        <AppContainer>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 text-black">
                    <h2 className="text-DarkGreen font-Poppins text-2xl font-medium">
                        Hi, {user.first_name ? user.first_name : "user"}
                    </h2>
                    <p className="text-lg font-normal text-[#757575]">
                        Lorem ipsum dolor sit amet
                    </p>
                </div>
                <TodaysFoodInteake
                    totalCalories={totalCalories}
                    totalProteins={totalProteins}
                    totalCarbohydrates={totalCarbohydrates}
                    totalFats={totalFats}
                />
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5 lg:grid-rows-1">
                    <div className="h-full w-full lg:col-span-3">
                        <YourNextMeal
                            nextMealProp={nextMeal}
                            isNextMealComponent={true}
                        />
                    </div>
                    <div className="h-full w-full lg:col-span-2">
                        <YourNextTraining
                            nextTrainingProp={nextTraining}
                        />
                    </div>
                </div>
                <TodaysTimeline
                    todaysActivityProps={sortedActivities}
                    totalCalories={totalCalories}
                    totalProteins={totalProteins}
                    totalCarbohydrates={totalCarbohydrates}
                    totalFats={totalFats}
                />
                <GrocerysForNextMeal />
            </div>
        </AppContainer>
    )
}
