"use client"

import React, { useState, useEffect } from "react"

import { MealData as Meal, MealType } from "@/utils/types"

import { useNutritionPageCtx } from "./nutritionPageProvider"
import SingleActivityFromTimeline from "../dashboardpage/singleActivityFromTimeline"
import { ListPlus } from "@phosphor-icons/react"
import AddMealModal from "./addMealModal"
import TodayTimelineLoader from "../skeletonLoaders/todayTimelineLoader"

const MealTimeline = () => {
    const { meals, setAddMealModalOpen, addMealModalOpen } =
        useNutritionPageCtx()
    const [sortedMeals, setSortedMeals] = useState<
        { meal: Meal; mealType: MealType; time: string }[] | null
    >([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!meals) {
            setLoading(false)
            return
        }

        const sortedMeal = [
            ...(meals.map((meal) => ({
                ...meal,
            })) || []),
        ].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
        )

        setSortedMeals(sortedMeal)
        //console.log(sortedMeal, "sorted")
        setLoading(false)
    }, [meals])

    //console.log(sortedTodaysActivities, "sorted")

    if (loading) {
        return (
           <TodayTimelineLoader/>
        )
    }

    if (!sortedMeals || sortedMeals.length === 0) {
        return (
            <div className="shadow-Combined font-Poppins flex min-h-[300px] flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <p>No upcoming Activities.</p> {/* UI for no activities */}
            </div>
        )
    }

    return (
        <>
            <div className="shadow-Combined font-Poppins flex min-h-fit w-full h-full flex-col gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <div
                    className={`flex flex-col justify-between gap-4 sm:flex-row md:items-center`}
                >
                    <div
                        className={`flex w-full flex-col gap-6 sm:flex-row sm:justify-between`}
                    >
                        <div>
                            <h3 className="text-DarkGreen text-xl font-medium">
                                Meals
                            </h3>
                            <h4 className="text-sm font-normal text-[#757575]">
                                Lorem ipsum dolor sit amet
                            </h4>
                        </div>
                        <button
                            onClick={() => setAddMealModalOpen(true)}
                            className="bg-LightGreen flex flex-row items-center justify-center gap-4 rounded-lg p-3 text-lg font-medium text-[#FFFFFF]"
                        >
                            Add Meal
                            <span className="flex h-fit items-center">
                                <ListPlus color={"#FFFFFF"} size={16} />
                            </span>
                        </button>
                    </div>
                </div>
                <div className="custom-scrollbar flex snap-x flex-row min-h-fit gap-x-6 overflow-x-scroll scroll-smooth whitespace-nowrap">
                    {sortedMeals.map((meal) => {
                        //console.log(exercise, "exercise")
                        return (
                            <SingleActivityFromTimeline
                                key={meal.meal.id}
                                activity={{
                                    type: "meal",
                                    meal: meal.meal,
                                    mealType: meal.mealType,
                                    time: meal.time,
                                }}
                            />
                        )
                    })}
                </div>
            </div>
            {addMealModalOpen && <AddMealModal />}
        </>
    )
}

export default MealTimeline
