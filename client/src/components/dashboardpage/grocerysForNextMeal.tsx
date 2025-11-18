"use client"

//we will get this data fetching it from backend
const nextMeal = [
    {
        id: 1,
        name: "Ovsena kaša",
        grocerys: [
            { name: "Ovsene pahuljice", amount: "100g", groceryId: 1 },
            { name: "Mleko", amount: "200ml", groceryId: 2 },
            { name: "Med", amount: "1 kašika", groceryId: 3 },
        ],
    },
]

const todaysMeals = [
    {
        id: 1,
        name: "Ovsena kaša",
        grocerys: [
            { name: "Ovsene pahuljice", amount: "100g", groceryId: 1 },
            { name: "Mleko", amount: "200ml", groceryId: 2 },
            { name: "Med", amount: "1 kašika", groceryId: 3 },
        ],
    },
    {
        id: 2,
        name: "Piletina sa povrćem",
        grocerys: [
            { name: "Piletina", amount: "200g", groceryId: 4 },
            { name: "Tikvice", amount: "150g", groceryId: 5 },
            { name: "Maslinovo ulje", amount: "1 kašika", groceryId: 6 },
        ],
    },
    {
        id: 3,
        name: "Tuna salata",
        grocerys: [
            { name: "Tunjevina", amount: "100g", groceryId: 7 },
            { name: "Zelena salata", amount: "50g", groceryId: 8 },
            { name: "Maslinovo ulje", amount: "1 kašika", groceryId: 9 },
        ],
    },
]

const weeksMeals = [
    {
        id: 1,
        name: "Greek yougurt with bluberries",
        grocerys: [
            { name: "Greek yogurt", amount: "200g", groceryId: 1 },
            { name: "Granola", amount: "50g", groceryId: 2 },
            { name: "Blueberries", amount: "50g", groceryId: 3 },
        ],
    },
    {
        id: 2,
        name: "Sandwich",
        grocerys: [
            { name: "Turkey sandwich", amount: "1 serving", groceryId: 4 },
            { name: "Mixed greens", amount: "100g", groceryId: 5 },
            { name: "Apple", amount: "1 medium", groceryId: 6 },
        ],
    },
    {
        id: 3,
        name: "Chicken with brocooli and rice",
        grocerys: [
            { name: "Grilled chicken", amount: "150g", groceryId: 7 },
            { name: "Brown rice", amount: "100g", groceryId: 8 },
            { name: "Broccoli", amount: "100g", groceryId: 9 },
        ],
    },
    {
        id: 4,
        name: "Green Smoothie",
        grocerys: [
            { name: "Smoothie", amount: "1 serving", groceryId: 10 },
            { name: "Spinach", amount: "30g", groceryId: 11 },
            { name: "Protein powder", amount: "1 scoop", groceryId: 12 },
        ],
    },
    {
        id: 5,
        name: "Salad",
        grocerys: [
            { name: "Quinoa salad", amount: "1 bowl", groceryId: 13 },
            { name: "Chickpeas", amount: "100g", groceryId: 14 },
            { name: "Cucumber", amount: "50g", groceryId: 15 },
        ],
    },
    {
        id: 6,
        name: "Beef noodles",
        grocerys: [
            { name: "Beef stir-fry", amount: "200g", groceryId: 16 },
            { name: "Bell peppers", amount: "100g", groceryId: 17 },
            { name: "Noodles", amount: "150g", groceryId: 18 },
        ],
    },
]

import { GroceryItem } from "@/utils/types"
import { useEffect, useState } from "react"
import ProgressBar from "../util/ProgressBar"
import { Checkbox } from "@mui/material"
import { percentageOfTotal } from "@/utils/procentageCalculator"
import GrocerysForNextMealLoader from "../skeletonLoaders/grocerysForNextMealLoader"

type Grocerys = {
    id: number
    name: string
    grocerys: GroceryItem[] | null
}

type grocerysForNextMealProp = {
    grocerysProp?: Grocerys[] | null
}

const GrocerysForNextMeal: React.FC<grocerysForNextMealProp> = ({
    grocerysProp,
}) => {
    const [grocerys, setGrocerys] = useState<Grocerys[] | null>(null)
    const [choseGrocerys, setChoseGrocerys] = useState<string>("nextMeal")
    const [loading, setLoading] = useState(true)
    const [checkedItems, setCheckedItems] = useState<{
        [key: string]: boolean
    }>({})

    //console.log(choseGrocerys)

    useEffect(() => {
        if (grocerysProp) {
            setGrocerys(grocerysProp)
            setLoading(false)
            return
        }

        if (!choseGrocerys) {
            setLoading(false)
            return
        } else if (choseGrocerys === "nextMeal") {
            //...fetch nextMeal grocerys ako ne return i UI for no grocerys
            setGrocerys(nextMeal)
        } else if (choseGrocerys === "todaysMeals") {
            setGrocerys(todaysMeals)
        } else if (choseGrocerys === "weeksMeals") {
            setGrocerys(weeksMeals)
        } else {
            setGrocerys([]) // Ako slučajno dođe nevažeći unos
        }

        setLoading(false)
    }, [choseGrocerys, grocerysProp])

    const handleCheckboxChange = (groceryId: number, ingName: string) => {
        setCheckedItems((prev) => ({
            ...prev,
            [`${groceryId}-${ingName}`]: !prev[`${groceryId}-${ingName}`],
        }))
    }

    const totalItems =
        grocerys?.reduce(
            (acc, meal) => acc + (meal.grocerys ? meal.grocerys.length : 0),
            0,
        ) || 0
    const checkedCount = Object.values(checkedItems).filter(Boolean).length
    const progress =
        totalItems > 0 ? percentageOfTotal(checkedCount, totalItems) : 0

    if (loading) {
        return (
            <GrocerysForNextMealLoader/>
        )
    }

    if (!grocerys || grocerys.length === 0) {
        return (
            <div className="shadow-Combined font-Poppins flex min-h-[300px] flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <p>No grocerys to show at this moment.</p>{" "}
                {/* UI for no activities */}
            </div>
        )
    }

    return (
        <div className="shadow-Combined font-Poppins flex cursor-pointer flex-col gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
            <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                    <h3 className="text-DarkGreen text-xl font-medium">
                        Necessary Groceries
                    </h3>
                    <p className="text-sm font-normal text-[#757575]">
                        Lorem ipsum dolor sit amet
                    </p>
                </div>
                <div className="flex flex-col items-baseline gap-[10px] py-[10px] sm:flex-row sm:px-[10px]">
                    <div className="w-[120px] text-sm font-medium sm:w-[150px]">
                        <p className="text-DarkGreen mb-[-10px] sm:pb-0">
                            {progress}%
                        </p>
                        <div className="h-[3px] w-full">
                            <ProgressBar value={progress} />
                        </div>
                    </div>
                    <div className="flex pt-2 sm:pt-0">
                        <select
                            onChange={(e) => {
                                setChoseGrocerys(e.target.value)
                                setCheckedItems({})
                                setGrocerys(null)
                            }}
                            value={choseGrocerys}
                            className="w-fit cursor-pointer rounded-md bg-transparent py-2 text-sm font-medium text-[#757575] focus:outline-none sm:px-4"
                        >
                            <option value="nextMeal">Next Meal</option>
                            <option value="todaysMeals">
                                Today&apos;s Meals
                            </option>
                            <option value="weeksMeals">
                                This Week&apos;s Meals
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="custom-scrollbar flex flex-col overflow-x-auto">
                <div className="flex flex-col gap-2">
                    <div className="grid w-full grid-cols-6 pb-1 text-sm text-[#A0AEC0]">
                        <p className="col-span-4 min-w-[300px] border-b-1 border-[#E2E8F0] pb-2 font-medium">
                            GROCERIES
                        </p>

                        <p className="col-span-1 min-w-[200px] border-b-1 border-[#E2E8F0] pb-2 font-normal">
                            QUANTITY
                        </p>

                        <p className="col-span-1 min-w-[300px] border-b-1 border-[#E2E8F0] pb-2 text-right font-normal">
                            FOR THE MEAL
                        </p>
                    </div>

                    {grocerys.map((grocery) => (
                        <div key={grocery.id} className="flex flex-col gap-2">
                            {grocery.grocerys &&
                                grocery.grocerys.map((ing, index) => (
                                    <div
                                        key={index}
                                        className="grid w-full grid-cols-6 pb-1 text-sm text-[#2D3748]"
                                    >
                                        {/* Naziv sastojka */}
                                        <div className="col-span-4 flex min-w-[300px] gap-2 border-b-1 border-[#E2E8F0] pb-2 font-medium">
                                            <Checkbox
                                                checked={
                                                    !!checkedItems[
                                                        `${grocery.id}-${ing.name}`
                                                    ]
                                                }
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        grocery.id,
                                                        ing.name,
                                                    )
                                                }
                                                color="primary"
                                                className="h-3 w-3"
                                                sx={{
                                                    color: "#e7eef2", // Default boja kada nije čekirano
                                                    borderColor: "#E7E7E7",
                                                    borderRadius: "25%",
                                                    "&.Mui-checked": {
                                                        color: "#00473C", // Boja kada je čekirano
                                                        backgroundColor:
                                                            "#ffffff", // Pozadina kada je čekirano
                                                        borderRadius: "50%", // Zaobljeni uglovi
                                                        border: "1px",
                                                    },
                                                    "&:hover": {
                                                        borderRadius: "50%", // Zaobljeni uglovi pri hoveru
                                                    },
                                                }}
                                            />

                                            <p>{ing.name}</p>
                                        </div>

                                        {/* Količina */}
                                        <p className="col-span-1 min-w-[200px] border-b-1 border-[#E2E8F0] pb-2 font-normal">
                                            {ing.amount}
                                        </p>

                                        {/* Naziv jela */}
                                        <p className="col-span-1 min-w-[300px] border-b-1 border-[#E2E8F0] pb-2 text-right font-normal">
                                            {grocery.name}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GrocerysForNextMeal
