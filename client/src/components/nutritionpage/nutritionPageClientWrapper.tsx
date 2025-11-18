"use client"

import { useEffect, useState } from "react"
import TodaysFoodInteake from "../dashboardpage/todaysFoodIntakes";
import WaterConsumption from "./waterConsumption";
import DatePicker from "./datePicker";
import { DailyPlan } from "@/utils/types";
import { useNutritionPageCtx } from "./nutritionPageProvider";
import MealTimeline from "./mealTimeline";
import MealVitamins from "./mealVitamins";
import GrocerysForNextMeal from "../dashboardpage/grocerysForNextMeal";

interface ActivitiesForIdClientWrapperProps {
    initialDailyPlanForId: DailyPlan[] | undefined
    userId?: string
}

export default function NutritionPageClientWrapper({
    initialDailyPlanForId
}: ActivitiesForIdClientWrapperProps) {
      const { setMeals, setWaterConsumption, selectedDate, setUserSubscribed, meals} = useNutritionPageCtx()


//fetch user to see if userId is subscribed if or not
interface GroceryForMeal {
    id:  number;
    name: string;
    grocerys: { name: string; amount: string, groceryId:number }[];
}

const [grocerysForMeal, setGrocerysForMeal] = useState<GroceryForMeal[]>([]);


  useEffect(() => {
        if (initialDailyPlanForId) {
            setMeals(initialDailyPlanForId[0].mealPlan.map(({ meal, mealType, time }) => ({
                meal,
                mealType,
                time,
            })))
        }

   
        setUserSubscribed(true)


        if(initialDailyPlanForId?.[0]?.waterConsumption) {
            setWaterConsumption(initialDailyPlanForId[0].waterConsumption)
        }
    }, [initialDailyPlanForId, setMeals, setWaterConsumption, selectedDate, setUserSubscribed]) // UPDATE WHEN GET DATA FROM REAL API ON DATE CHANGE IT WILL BE IN PROVIDER

    useEffect(() => {
        if (meals && meals.length > 0) {
          const grocerysWithMeals = meals.map((meal) => ({
            id: typeof meal.meal.id === "string" ? parseInt(meal.meal.id, 10) : meal.meal.id,
            name: meal.meal.name,
            grocerys: meal.meal.grocerys.map((grocery) => ({
              name: grocery.name,
              amount: grocery.amount || "0", 
              groceryId: grocery.groceryId ,
            })),
          }));
          setGrocerysForMeal(grocerysWithMeals);
        }
      }, [meals]);

      console.log(grocerysForMeal, "grocerysForMeal")
 

  

    return (
        <>
                <div className="flex flex-col-reverse gap-6 lg:flex-row">
                        <div className="flex w-full flex-col gap-6 lg:w-9/12">
                            <TodaysFoodInteake
                                glycemicIndex={40}
                                glycemicLoad={20}
                            />
                            <WaterConsumption waterConsumption={initialDailyPlanForId?.[0]?.waterConsumption ? [initialDailyPlanForId[0].waterConsumption] : null}/>
                            <MealTimeline />
                            <MealVitamins/>
                            <GrocerysForNextMeal grocerysProp={grocerysForMeal} />
                        </div>
                        <div className="flex w-full flex-col gap-6 lg:w-3/12 lg:pr-[24px]">
                            <DatePicker />
                            <div className="shadow-Combined font-Poppins text-p-[10px] hidden min-h-[260px] w-full  items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] text-[#2D3748] lg:flex lg:h-fit">
                                Reklama
                            </div>
                        </div>
                    </div>

        </>
    )
}
