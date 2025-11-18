"use client"

import { GroceryItem } from "@/utils/types"
import { useEffect, useState } from "react"
import VitaminsContentLoader from "../skeletonLoaders/vitaminsContentLoader"

type Groceries = {
  necessaryGroceries: GroceryItem[] | null | undefined

}

const ContentOfMeal: React.FC<Groceries> = ({
necessaryGroceries
}) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!necessaryGroceries) {
            setLoading(false)
            return
        }
        //console.log(meal, "dsfas")

        //setNextMeal(nextMealProp)
        setLoading(false)
    }, [necessaryGroceries])

    if (loading) {
        return (
           <VitaminsContentLoader/>
        )
    }

    if (!necessaryGroceries || necessaryGroceries?.length === 0) {
        return (
            <div className="shadow-Combined font-Poppins flex h-full min-h-[200px] flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black md:flex-row">
                <p>No meal instructions found.</p> {/* UI for no meals */}
            </div>
        )
    }

    return (
        <div className="shadow-Combined font-Poppins flex h-full flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
            <div className="flex w-full gap-2 flex-col">
                <h3 className="text-DarkGreen text-xl font-normal">
                Waiting for backend to figure outh what should i show and if i should calculate the vitamins depending on grocery amount

                </h3>
                <h4 className=" text-xs font-medium text-[#2D3748]">Lorem ipsum dolor sit amet</h4>
            </div>
            <div className="flex flex-col gap-4   ">
                <div className="flex w-full items-center justify-between border-b border-[#E2E8F0] pb-[10px]">
                    <h4 className="text-xs font-semibold text-[#A0AEC0]">GROCERIES</h4>
                    <h4 className="text-xs font-semibold text-[#A0AEC0]">AMOUNT</h4>
                </div>
                {necessaryGroceries?.map((grocery) => (
                    <div key={grocery.groceryId} className="flex w-full items-center justify-between pb-[10px] border-b border-[#E2E8F0] ">
                        <h4 className="text-sm font-medium text-[#2D3748]">{grocery.name}</h4>
                        <h4 className="text-xs font-normal text-[#2D3748] pr-4">{grocery.amount}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContentOfMeal
