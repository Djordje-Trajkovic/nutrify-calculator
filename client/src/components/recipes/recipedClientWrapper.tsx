"use client"

import { MealType } from "@/app/enum/enums"

import { ShoppingCartSimple, MagnifyingGlass } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import SingleMealPlan from "./singleMealPlan"
import SingleWeaklyPlan from "./singleWeaklyPlan"
import { useCartModal as useCartModalCtx } from "./cartModalCtx"
import CartModal from "./cartModal"
import RecipesLoader from "../skeletonLoaders/recipesLoader"
import SearchModal from "./searchModal"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { getAllOrSearchByNameRecipes } from "@/utils/api"
import { Recipe } from "@/utils/types"

const fetchedRecipes = [
    {
        id: 1,
        name: "Chicken Salad",
        description: "Lorem Ipsum is simply dummy text of the",
        calories: 350,
        proteins: 30,
        fats: 10,
        carbohydrates: 40,
        grocerys: [
            { name: "Chicken", amount: "200g", groceryId: 1 },
            { name: "Lettuce", amount: "100g", groceryId: 2 },
            { name: "Tomato", amount: "50g", groceryId: 3 },
        ],
        authorUserId: 1,
        image: null,
        videoUrl: "ovo je video",
        detailePreparation: [
            {
                stepTitle: "Priprema luka",
                instructions: [
                    "Iseckaj luk",
                    "Stavi ga u tiganj",
                    "Dodaj malo ulja",
                ],
            },
            {
                stepTitle: "Prženje piletine",
                instructions: [
                    "Dodaj piletinu",
                    "Prži dok ne porumeni",
                    "Začini po ukusu",
                ],
            },
        ],
        mealType: MealType.Lunch,
    },
    {
        id: 2,
        name: "Obrok 2",
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        calories: 350,
        proteins: 30,
        fats: 10,
        carbohydrates: 40,
        grocerys: [
            { name: "Chicken", amount: "200g", groceryId: 1 },
            { name: "Lettuce", amount: "100g", groceryId: 2 },
            { name: "Tomato", amount: "50g", groceryId: 3 },
        ],
        authorUserId: 1,
        image: null,
        videoUrl: "ovo je video",
        detailePreparation: [
            {
                stepTitle: "Priprema luka",
                instructions: [
                    "Iseckaj luk",
                    "Stavi ga u tiganj",
                    "Dodaj malo ulja",
                ],
            },
            {
                stepTitle: "Prženje piletine",
                instructions: [
                    "Dodaj piletinu",
                    "Prži dok ne porumeni",
                    "Začini po ukusu",
                ],
            },
        ],
        mealType: MealType.Lunch,
    },
]

const fetchedSingleRecipes = [
    {
        meals: [
            { mealType: MealType.Breakfast, recipe: fetchedRecipes[1] },
            { mealType: MealType.Lunch, recipe: fetchedRecipes[0] },
            { mealType: MealType.Breakfast, recipe: fetchedRecipes[1] },
            { mealType: MealType.Lunch, recipe: fetchedRecipes[0] },
        ],
    },
]

const fetchedWeaklyPlanRecipes: listOfPlans[] = [
    {
        weeklyPlan: {
            title: "Weakly Plan 1",
            authorId: "23",
            days: "7",
            mealsPerDay: "3",
            authorName: "Marko Markovic",
            description: "Neki opiis",
            meals: {
                Monday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[0] },
                ],
                Tuesday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[1] },
                ],
                Wednesday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[0] },
                ],
                Thursday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[1] },
                ],
                Friday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[0] },
                ],
                Saturday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[1] },
                ],
                Sunday: [
                    { mealType: MealType.Breakfast, recipe: fetchedRecipes[0] },
                    { mealType: MealType.Lunch, recipe: fetchedRecipes[1] },
                    { mealType: MealType.Dinner, recipe: fetchedRecipes[0] },
                ],
            },
        },
    },
]

export interface Meal {
    mealType: MealType
    recipe: {
        id: number
        name: string
        description: string
        calories: number
        proteins: number
        fats: number
        carbohydrates: number
        grocerys: { name: string; amount: string; groceryId: number }[]
        authorUserId: number
        image: string | null
        videoUrl: string
        detailePreparation: { stepTitle: string; instructions: string[] }[]
        mealType: MealType
    }
}

export interface DayPlan {
    day?: string
    meals: Meal[]
}

export interface DailyMeals {
    [day: string]: Meal[] // npr. Monday: [Meal, Meal, Meal]
}

export interface WeaklyPlan {
    title: string
    authorId: string
    authorName: string
    description: string
    days: string
    mealsPerDay: string
    meals: DailyMeals
}

interface listOfPlans {
    meals?: Meal[] // za dnevni plan
    weeklyPlan?: WeaklyPlan // za nedeljni plan
}

const RecipesClientWrapper = () => {
    const {
        cartModalIsOpen,
        openModal,
        searchTerm,
        openSearchModal,
        searchModalIsOpen,
    } = useCartModalCtx()

    const [listOfPlans, setListOfPlans] = useState<listOfPlans[]>([])

    const [loading, setLoading] = useState(true)
    const [activeOption, setActiveOption] = useState("dailyPlan")

    const [recipes, setRecipes] = useState<Recipe[]>([])
    //const [weaklyPlan, setWeaklyPlan] = useState([])

    useEffect(() => {
        const getData = async () => {
            setLoading(true)

            try {
                const token = Cookies.get("jwtNutrifyS")

                if (!token) {
                    toast.error("You are not authenticated.")
                    return
                }

                const data = await getAllOrSearchByNameRecipes(
                    token,
                    searchTerm,
                )

                toast.success("Data fetched successfully.")

                setRecipes(data)

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: unknown | any) {
                console.error(error)

                if (error.response?.status === 403) {
                    toast.error(
                        "Access forbidden. You might not have permission.",
                    )
                } else if (error.response?.status === 401) {
                    toast.error("Unauthorized. Please log in again.")
                } else {
                    toast.error("Failed to fetch data.")
                }

                setRecipes([]) //kako app neb krashovao
            }

            setLoading(false)
        }
        getData()
    }, [searchTerm])

    console.log(recipes, "ovo su recepti")

    useEffect(() => {
        setLoading(true)

        if (activeOption === "dailyPlan") {
            setListOfPlans(fetchedSingleRecipes)
        } else {
            setListOfPlans(fetchedWeaklyPlanRecipes)
        }
        setLoading(false)
    }, [activeOption])

    return (
        <>
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <div className="flex flex-col gap-2 text-black">
                    <h2 className="text-DarkGreen font-Poppins text-2xl font-medium">
                        Recipes
                    </h2>
                    <p className="text-lg font-normal text-[#757575]">
                        Lorem ipsum dolor sit amet
                    </p>
                </div>
                <div className="flex max-h-[42px] gap-6">
                    <div className="bg-LightGreen flex h-full w-full items-center justify-center rounded-xl p-3 sm:w-fit">
                        <select
                            value={activeOption}
                            onChange={(e) => setActiveOption(e.target.value)}
                            className="custom-select w-full cursor-pointer rounded-md bg-transparent text-sm font-medium text-[#ffffff] focus:outline-none sm:px-4"
                        >
                            <option value="dailyPlan">Daily Plan</option>
                            <option value="weaklyPlan">Weakly Plan</option>
                        </select>
                    </div>
                    <button
                        className="bg-DarkGreen flex h-[42px] min-w-[42px] items-center justify-center rounded-xl"
                        onClick={() => openModal()}
                    >
                        <ShoppingCartSimple size={16} />
                    </button>
                    <button
                        className="bg-DarkGreen flex h-[42px] min-w-[42px] items-center justify-center rounded-xl"
                        onClick={() => openSearchModal()}
                    >
                        <MagnifyingGlass size={16} />
                    </button>
                </div>
            </div>
            {loading ? (
                <RecipesLoader /> // Loader se prikazuje dok se podaci učitavaju
            ) : recipes.length === 0 ? (
                <div className="text-black">Trenutno nema recepata</div> // Poruka kad nema podataka
            ) : activeOption === "dailyPlan" ? (
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe, planIndex) => (
                        <div key={planIndex}>
                            <SingleMealPlan recipe={recipe} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {listOfPlans.map((plan, index) => (
                        <div key={index}>
                            <SingleWeaklyPlan weaklyPlan={plan.weeklyPlan} />
                        </div>
                    ))}
                </div>
            )}
            {cartModalIsOpen && <CartModal />}
            {searchModalIsOpen && <SearchModal />}
        </>
    )
}

export default RecipesClientWrapper
