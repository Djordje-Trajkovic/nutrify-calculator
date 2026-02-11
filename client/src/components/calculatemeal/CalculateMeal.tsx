"use client"
import { Ingredient, Meal, Recipe } from "@/utils/types"
import { Autocomplete, Button, Stack, TextField } from "@mui/material"
import React, { useState } from "react"
import Cookies from "js-cookie"
import { Check, Minus, PencilSimple, Plus } from "@phosphor-icons/react"
import { searchRecipesByName, saveMealPlan } from "@/utils/api"
import PDFPreviewModal from "./PDFPreviewModal"
import { toast } from "react-toastify"

const CalculateMeal: React.FC = () => {
    const token = Cookies.get("jwtNutrifyS")
    const [searchIngredients, setSearchIngredients] = useState<
        Ingredient[] | null
    >([])
    const [searchRecipes, setSearchRecipes] = useState<Recipe[] | null>([])
    const [editMealName, setEditMealName] = useState<{
        [key: number]: boolean
    }>({})
    const [mealName, setMealName] = useState<{ [key: number]: string }>({})
    const [meals, setMeals] = useState<Meal[]>([
        {
            Name: "Meal #1",
            Recipes: [
                {
                    Name: "",
                    Code: "",
                    Ingredients: [
                        {
                            Name: "",
                            Code: "",
                            Amount: 100,
                            Kcal: 0,
                            Protein_plant: 0,
                            Protein_animal: 0,
                            Protein_total: 0,
                            Fat_saturated: 0,
                            Fat_unsaturated: 0,
                            Fat_total: 0,
                            Cholesterol: 0,
                            Carbohydrates_mono: 0,
                            Carbohydrates_poli: 0,
                            Carbohydrates_total: 0,
                            Ashes: 0,
                            Cellulose: 0,
                            Mineral_Na: 0,
                            Mineral_K: 0,
                            Mineral_Ca: 0,
                            Mineral_Mg: 0,
                            Mineral_P: 0,
                            Mineral_Fe: 0,
                            Mineral_Zn: 0,
                            Mineral_Cu: 0,
                            Vitamin_RE: 0,
                            Vitamin_B1: 0,
                            Vitamin_B2: 0,
                            Vitamin_B6: 0,
                            Vitamin_PP: 0,
                            Vitamin_C: 0,
                            Vitamin_E: 0,
                            Glycemic_index: 0,
                            Atherogenic_index: 0,
                        },
                    ],
                },
            ],
            Kcal: 0,
            Protein_total: 0,
            Protein_plant: 0,
            Protein_animal: 0,
            Fat_total: 0,
            Fat_saturated: 0,
            Fat_unsaturated: 0,
            Carbohydrates_total: 0,
            Carbohydrates_mono: 0,
            Carbohydrates_poli: 0,
            Cholesterol: 0,
            Ashes: 0,
            Cellulose: 0,
            Mineral_Na: 0,
            Mineral_K: 0,
            Mineral_Ca: 0,
            Mineral_Mg: 0,
            Mineral_P: 0,
            Mineral_Fe: 0,
            Mineral_Zn: 0,
            Mineral_Cu: 0,
            Vitamin_RE: 0,
            Vitamin_B1: 0,
            Vitamin_B2: 0,
            Vitamin_B6: 0,
            Vitamin_PP: 0,
            Vitamin_C: 0,
            Vitamin_E: 0,
            Glycemic_index: 0,
            Atherogenic_index: 0,
        },
    ])
    const [mealPlanName, setMealPlanName] = useState("")
    const [planCalories, setPlanCalories] = useState(1800)
    const [viewReport, setViewReport] = useState(false)

    const handleIngredientSearch = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const searchValue = e.target.value.toLowerCase()
        setSearchIngredients(null)
        if (searchValue.length > 2) {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/ingredients?filters[Name][$contains]=${searchValue}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: "no-store",
                },
            )
            const data = await res.json()
            console.log("Data from search:", data)

            setSearchIngredients(data.data)
        } else {
            setSearchIngredients([])
        }
    }
    const handleRecipeSearch = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const searchValue = e.target.value.toLowerCase()
        setSearchRecipes(null)

        if (searchValue.length > 2) {
            const result = await searchRecipesByName(searchValue, token!)
            console.log("Data from search:", result)
            const recipes = result.map((recipe: Recipe) => {
                return {
                    Name: recipe.Name,
                    Ingredients: recipe.Ingredients,
                    Code: recipe.Code,
                }
            })

            setSearchRecipes(recipes)
        } else {
            setSearchRecipes([])
        }
    }
    const handleAddNewRecipe = (mealIndex: number) => {
        setMeals((prev) => {
            const newMeals = [...prev]
            const targetMeal = { ...newMeals[mealIndex] }
            const newRecipes = [...(targetMeal.Recipes ?? [])]
            const newRecipe: Recipe = {
                Name: `Recipe #${newRecipes.length + 1}`,
                Code: "",
                Ingredients: [
                    {
                        Name: "",
                        Code: "",
                        Amount: 100,
                        Kcal: 0,
                    },
                ],
            }
            newRecipes.push(newRecipe)
            targetMeal.Recipes = newRecipes
            newMeals[mealIndex] = targetMeal

            return newMeals
        })
    }
    const handleRemoveRecipe = (mealIndex: number, recIndex: number) => {
        setMeals((prev) => {
            const newMeals = [...prev]
            const targetMeal = { ...newMeals[mealIndex] }
            const newRecipes = [...(targetMeal.Recipes ?? [])]
            newRecipes.splice(recIndex, 1)
            targetMeal.Recipes = newRecipes

            // Recalculate the meal nutrition after removing recipe
            const recalculatedMeal = calculateMealNutrition(targetMeal)
            newMeals[mealIndex] = recalculatedMeal

            return newMeals
        })
    }
    const handleAddNewMeal = () => {
        setMeals((prev) => [
            ...prev,
            {
                Name: `Meal #${prev.length + 1}`,
                Recipes: [
                    {
                        Name: "Recipe #1",
                        Code: "",
                        Ingredients: [
                            {
                                Name: "",
                                Code: "",
                                Amount: 100,
                                Kcal: 0,
                            },
                        ],
                    },
                ],
                Kcal: 0,
                Protein_total: 0,
                Protein_plant: 0,
                Protein_animal: 0,
                Fat_total: 0,
                Fat_saturated: 0,
                Fat_unsaturated: 0,
                Carbohydrates_total: 0,
                Carbohydrates_mono: 0,
                Carbohydrates_poli: 0,
                Cholesterol: 0,
                Ashes: 0,
                Cellulose: 0,
                Mineral_Na: 0,
                Mineral_K: 0,
                Mineral_Ca: 0,
                Mineral_Mg: 0,
                Mineral_P: 0,
                Mineral_Fe: 0,
                Mineral_Zn: 0,
                Mineral_Cu: 0,
                Vitamin_RE: 0,
                Vitamin_B1: 0,
                Vitamin_B2: 0,
                Vitamin_B6: 0,
                Vitamin_PP: 0,
                Vitamin_C: 0,
                Vitamin_E: 0,
                Glycemic_index: 0,
                Atherogenic_index: 0,
            },
        ])
    }
    const handleAddNewIngredient = (mealIndex: number, recIndex: number) => {
        const newMeals = [...meals]
        newMeals[mealIndex].Recipes[recIndex].Ingredients.push({
            Name: "",
            Code: "",
            Amount: 100,
            Kcal: 0,
        })
        setMeals(newMeals)
    }
    const handleAddCustomItem = (mealIndex: number) => {
        setMeals((prev) => {
            const newMeals = [...prev]
            const targetMeal = { ...newMeals[mealIndex] }
            const newRecipes = [...(targetMeal.Recipes ?? [])]
            const customRecipe: Recipe = {
                Name: "Custom Item",
                Code: "CUSTOM",
                Ingredients: [
                    {
                        Name: "Custom Ingredient",
                        Code: "CUSTOM",
                        Amount: 100,
                        Kcal: 0,
                        Protein_total: 0,
                        Fat_total: 0,
                        Carbohydrates_total: 0,
                    },
                ],
            }
            newRecipes.push(customRecipe)
            targetMeal.Recipes = newRecipes
            newMeals[mealIndex] = targetMeal
            return newMeals
        })
    }
    const handleSaveMealPlan = async () => {
        if (!mealPlanName.trim()) {
            toast.error("Please enter a meal plan name")
            return
        }
        if (!token) {
            toast.error("You must be logged in to save a meal plan")
            return
        }
        try {
            await saveMealPlan(mealPlanName, planCalories, meals, token)
            toast.success("Meal plan saved successfully!")
        } catch (error) {
            console.error("Error saving meal plan:", error)
            toast.error("Failed to save meal plan. Please try again.")
        }
    }
    const updateCustomIngredient = (
        mealIndex: number,
        recIndex: number,
        ingIndex: number,
        field: keyof Ingredient,
        value: string | number,
    ) => {
        setMeals((prev) => {
            const newMeals = [...prev]
            const ingredient = newMeals[mealIndex].Recipes[recIndex].Ingredients[ingIndex]
            ;(ingredient as Record<string, unknown>)[field] = value
            newMeals[mealIndex] = calculateMealNutrition(newMeals[mealIndex])
            return newMeals
        })
    }
    const handleRemoveIngredient = (
        mealIndex: number,
        recIndex: number,
        ingIndex: number,
    ) => {
        setMeals((prevMeals) => {
            const updatedMeals = [...prevMeals]
            const updatedMeal = { ...updatedMeals[mealIndex] }
            const updatedRecipes = [...updatedMeal.Recipes]
            const updatedRecipe = { ...updatedRecipes[recIndex] }
            const updatedIngredients = [...updatedRecipe.Ingredients]

            updatedIngredients.splice(ingIndex, 1)

            updatedRecipe.Ingredients = updatedIngredients
            updatedRecipes[recIndex] = updatedRecipe
            updatedMeal.Recipes = updatedRecipes

            const recalculatedMeal = calculateMealNutrition(updatedMeal)

            updatedMeals[mealIndex] = recalculatedMeal

            return updatedMeals
        })
    }
    const calculateMealNutrition = (meal: Meal): Meal => {
        const nutritionTotals: Meal = {
            Name: meal.Name,
            Recipes: meal.Recipes,
            Glycemic_load: 0,
            Kcal: 0,
            Protein_total: 0,
            Protein_plant: 0,
            Protein_animal: 0,
            Fat_total: 0,
            Fat_saturated: 0,
            Fat_unsaturated: 0,
            Carbohydrates_total: 0,
            Carbohydrates_mono: 0,
            Carbohydrates_poli: 0,
            Cholesterol: 0,
            Ashes: 0,
            Cellulose: 0,
            Mineral_Na: 0,
            Mineral_K: 0,
            Mineral_Ca: 0,
            Mineral_Mg: 0,
            Mineral_P: 0,
            Mineral_Fe: 0,
            Mineral_Zn: 0,
            Mineral_Cu: 0,
            Vitamin_RE: 0,
            Vitamin_B1: 0,
            Vitamin_B2: 0,
            Vitamin_B6: 0,
            Vitamin_PP: 0,
            Vitamin_C: 0,
            Vitamin_E: 0,
            Atherogenic_index: 0,
            // Optional fields from NutritionalFields, initialized to 0 or undefined
            Amount: 0,
            Carbohydrates_fructose: 0,
            Carbohydrates_glucose: 0,
            Carbohydrates_isomaltulose: 0,
            Carbohydrates_lactose: 0,
            Carbohydrates_maltose: 0,
            Carbohydrates_Noncaloric_Carbohydrates: 0,
            Carbohydrates_Organic_Acids: 0,
            Carbohydrates_Polyols: 0,
            Carbohydrates_sucrose: 0,
            Carotenoids: 0,
            Fat_aa: 0,
            Fat_ala: 0,
            Fat_Arachidonic_Acid: 0,
            Fat_dha: 0,
            Fat_epa: 0,
            Fat_la: 0,
            Fat_mct: 0,
            Fatty_Acids_C10: 0,
            Fatty_Acids_C12: 0,
            Fatty_Acids_C14: 0,
            Fatty_Acids_C6: 0,
            Fatty_Acids_C8: 0,
            Fiber_Fructooligosaccharides: 0,
            Fiber_Galactooligosaccharides: 0,
            Fiber_Insoluble: 0,
            Fiber_Soluble: 0,
            Fiber_total: 0,
            Glycemic_index: 0,
            MCT_TCM_ratio: 0,
            Mineral_Cl: 0,
            Mineral_Cr: 0,
            Mineral_F: 0,
            Mineral_Jod: 0,
            Mineral_Mn: 0,
            Mineral_Mo: 0,
            Mineral_S: 0,
            Mineral_Se: 0,
            Nucleotides: 0,
            Omega3_Omega6_ratio: 0,
            Osmolality: 0,
            Osmolarity: 0,
            Phosphates: 0,
            Protein_Carnitine: 0,
            Protein_Casein: 0,
            Protein_Essential_Amino_Acids: 0,
            Protein_L_Arginin: 0,
            Protein_L_Leucin: 0,
            Protein_taurine: 0,
            Protein_Whey: 0,
            Sugars: 0,
            Vitamin_A: 0,
            Vitamin_B12: 0,
            Vitamin_B3: 0,
            Vitamin_B4_Holin: 0,
            Vitamin_B5: 0,
            Vitamin_B7: 0,
            Vitamin_B8_Inositol: 0,
            Vitamin_B9_Folic_Acid: 0,
            Vitamin_D: 0,
            Vitamin_K: 0,
            Volume_per_Unit: 0,
            Water: 0,
        }

        let totalCarbsForGlycemicIndex = 0
        let weightedGlycemicIndex = 0

        for (const recipe of meal.Recipes) {
            for (const ingredient of recipe.Ingredients) {
                const amount = ingredient.Amount ?? 0
                const factor = amount / 100

                nutritionTotals.Amount! += amount
                nutritionTotals.Water! += (ingredient.Water ?? 0) * factor

                nutritionTotals.Kcal! += (ingredient.Kcal ?? 0) * factor
                nutritionTotals.Protein_total! +=
                    (ingredient.Protein_total ?? 0) * factor
                nutritionTotals.Protein_plant! +=
                    (ingredient.Protein_plant ?? 0) * factor
                nutritionTotals.Protein_animal! +=
                    (ingredient.Protein_animal ?? 0) * factor
                nutritionTotals.Fat_total! +=
                    (ingredient.Fat_total ?? 0) * factor
                nutritionTotals.Fat_saturated! +=
                    (ingredient.Fat_saturated ?? 0) * factor
                nutritionTotals.Fat_unsaturated! +=
                    (ingredient.Fat_unsaturated ?? 0) * factor
                nutritionTotals.Carbohydrates_total! +=
                    (ingredient.Carbohydrates_total ?? 0) * factor
                nutritionTotals.Carbohydrates_mono! +=
                    (ingredient.Carbohydrates_mono ?? 0) * factor
                nutritionTotals.Carbohydrates_poli! +=
                    (ingredient.Carbohydrates_poli ?? 0) * factor
                nutritionTotals.Cholesterol! +=
                    (ingredient.Cholesterol ?? 0) * factor
                nutritionTotals.Ashes! += (ingredient.Ashes ?? 0) * factor
                nutritionTotals.Cellulose! +=
                    (ingredient.Cellulose ?? 0) * factor
                nutritionTotals.Mineral_Na! +=
                    (ingredient.Mineral_Na ?? 0) * factor
                nutritionTotals.Mineral_K! +=
                    (ingredient.Mineral_K ?? 0) * factor
                nutritionTotals.Mineral_Ca! +=
                    (ingredient.Mineral_Ca ?? 0) * factor
                nutritionTotals.Mineral_Mg! +=
                    (ingredient.Mineral_Mg ?? 0) * factor
                nutritionTotals.Mineral_P! +=
                    (ingredient.Mineral_P ?? 0) * factor
                nutritionTotals.Mineral_Fe! +=
                    (ingredient.Mineral_Fe ?? 0) * factor
                nutritionTotals.Mineral_Zn! +=
                    (ingredient.Mineral_Zn ?? 0) * factor
                nutritionTotals.Mineral_Cu! +=
                    (ingredient.Mineral_Cu ?? 0) * factor
                nutritionTotals.Vitamin_RE! +=
                    (ingredient.Vitamin_RE ?? 0) * factor
                nutritionTotals.Vitamin_B1! +=
                    (ingredient.Vitamin_B1 ?? 0) * factor
                nutritionTotals.Vitamin_B2! +=
                    (ingredient.Vitamin_B2 ?? 0) * factor
                nutritionTotals.Vitamin_B6! +=
                    (ingredient.Vitamin_B6 ?? 0) * factor
                nutritionTotals.Vitamin_PP! +=
                    (ingredient.Vitamin_PP ?? 0) * factor
                nutritionTotals.Vitamin_C! +=
                    (ingredient.Vitamin_C ?? 0) * factor
                nutritionTotals.Vitamin_E! +=
                    (ingredient.Vitamin_E ?? 0) * factor

                const carbsInIngredient =
                    (ingredient.Carbohydrates_total ?? 0) * factor
                if (carbsInIngredient > 0 && ingredient.Glycemic_index) {
                    weightedGlycemicIndex +=
                        carbsInIngredient * (ingredient.Glycemic_index ?? 0)
                    totalCarbsForGlycemicIndex += carbsInIngredient
                }
                nutritionTotals.Atherogenic_index! +=
                    (ingredient.Atherogenic_index ?? 0) * factor
            }
        }
        if (totalCarbsForGlycemicIndex > 0) {
            nutritionTotals.Glycemic_index =
                weightedGlycemicIndex / totalCarbsForGlycemicIndex
        }
        return {
            ...meal,
            ...nutritionTotals,
        }
    }

    return (
        <>
            <PDFPreviewModal
                open={viewReport}
                onClose={() => setViewReport(false)}
                meals={meals}
                mealPlanName={mealPlanName}
            />
            <div className="w-full pb-10">
                <div className="flex justify-between pb-10">
                    <h1 className="text-DarkGreen font-Poppins text-4xl font-semibold">
                        Create Meal Plan
                    </h1>
                    <Button
                        variant="contained"
                        className="bg-LightGreen! hover:bg-LightGreen/80! gap-4 normal-case!"
                        onClick={() => {
                            handleAddNewMeal()
                        }}
                    >
                        Add New Meal
                        <Plus size={18} color="#FAF9F6" weight="bold" />
                    </Button>
                </div>
                <div className="flex w-full flex-wrap lg:flex-nowrap justify-between gap-4 pb-10">
                    <div className="flex gap-10 rounded-2xl bg-white p-5 shadow-md">
                        <TextField
                            label="Meal Plan Name"
                            placeholder="Write name"
                            className="w-full min-w-[300px] bg-white px-5"
                            onChange={(e) => {
                                setMealPlanName(e.target.value)
                            }}
                            value={mealPlanName ?? "Meal Plan Name"}
                        />
                        <TextField
                            label="Total Calories"
                            placeholder="Set Meal Plan Calories"
                            className="w-full max-w-[300px] bg-white px-5"
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setPlanCalories(0)
                                    return
                                }
                                setPlanCalories(parseInt(e.target.value))
                            }}
                            value={planCalories}
                        />
                        <Button
                            variant="contained"
                            className="bg-LightGreen! hover:bg-LightGreen/80! w-full"
                            onClick={handleSaveMealPlan}
                        >
                            Save Meal Plan
                        </Button>
                    </div>
                    <div className="flex w-full max-w-3/5 items-center justify-between rounded-2xl bg-white p-5 shadow-md">
                        <h1 className="text-DarkGreen font-Poppins w-full text-3xl font-semibold">
                            Results
                        </h1>
                        <Button
                            variant="contained"
                            className="bg-LightGreen! hover:bg-LightGreen/80!"
                            onClick={() => {
                                setViewReport(true)
                            }}
                        >
                            View Report
                        </Button>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-10">
                    {meals.map((meal, index) => (
                        <div
                            className="flex w-full flex-wrap lg:flex-nowrap gap-10 bg-white p-10 shadow-md"
                            key={index + meal.Name}
                        >
                            <div className="flex w-full lg:max-w-1/3 flex-col gap-10">
                                <form className="text-DarkGreen flex flex-col gap-10">
                                    <div className="flex w-full flex-col items-start gap-3">
                                        <div className="flex w-full">
                                            <div className="flex w-full justify-between">
                                                <div className="flex w-full items-center justify-between gap-3">
                                                    {editMealName[index] ? (
                                                        <TextField
                                                            label="Meal Name"
                                                            value={
                                                                mealName[
                                                                    index
                                                                ] ?? meal.Name
                                                            }
                                                            onChange={(e) => {
                                                                setMealName(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [index]:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                )
                                                            }}
                                                        />
                                                    ) : (
                                                        <h2 className="text-DarkGreen font-Poppins text-3xl">
                                                            {meal.Name}
                                                        </h2>
                                                    )}
                                                    <div className="flex items-center gap-3">
                                                        {!editMealName[
                                                            index
                                                        ] ? (
                                                            <Button
                                                                className="block! min-w-0! px-2! py-2!"
                                                                onClick={() => {
                                                                    setEditMealName(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [index]:
                                                                                true,
                                                                        }),
                                                                    )
                                                                    setMealName(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [index]:
                                                                                meal.Name,
                                                                        }),
                                                                    )
                                                                }}
                                                            >
                                                                <PencilSimple
                                                                    size={24}
                                                                    className="text-DarkGreen"
                                                                    weight="bold"
                                                                ></PencilSimple>
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="block! min-w-0! px-2! py-2!"
                                                                onClick={() => {
                                                                    setMeals(
                                                                        (
                                                                            prev,
                                                                        ) => {
                                                                            const newMeals =
                                                                                [
                                                                                    ...prev,
                                                                                ]
                                                                            newMeals[
                                                                                index
                                                                            ].Name =
                                                                                mealName[
                                                                                    index
                                                                                ] ||
                                                                                meal.Name
                                                                            return newMeals
                                                                        },
                                                                    )
                                                                    setEditMealName(
                                                                        (
                                                                            prev,
                                                                        ) => ({
                                                                            ...prev,
                                                                            [index]:
                                                                                false,
                                                                        }),
                                                                    )
                                                                }}
                                                            >
                                                                <Check
                                                                    size={24}
                                                                    className="text-DarkGreen"
                                                                    weight="bold"
                                                                ></Check>
                                                            </Button>
                                                        )}
                                                        {meals.length > 1 && (
                                                            <Button
                                                                className="bg-LightGreen! hover:bg-LightGreen/80! flex! h-9 w-9 min-w-0! justify-center px-0! py-0!"
                                                                onClick={() => {
                                                                    const newMeals =
                                                                        [
                                                                            ...meals,
                                                                        ]
                                                                    newMeals.splice(
                                                                        index,
                                                                        1,
                                                                    )
                                                                    setMeals(
                                                                        newMeals,
                                                                    )
                                                                }}
                                                            >
                                                                <Minus
                                                                    size={24}
                                                                    color="#FAF9F6"
                                                                    weight="regular"
                                                                ></Minus>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="contained"
                                                            className="bg-LightGreen! hover:bg-LightGreen/80!"
                                                            onClick={() =>
                                                                handleAddNewRecipe(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Add Recipe
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            className="bg-Cream! hover:bg-Cream/80! text-DarkGreen! normal-case!"
                                                            onClick={() =>
                                                                handleAddCustomItem(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Add Custom Item
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {meal.Recipes.map(
                                            (recipe, recIndex) => (
                                                <div
                                                    key={recIndex + recipe.Name}
                                                    className="flex w-full flex-col gap-3"
                                                >
                                                    <div className="flex w-full flex-col">
                                                        <Stack spacing={2}>
                                                            <Autocomplete
                                                                freeSolo
                                                                id={`autocomplete-${index}`}
                                                                disableClearable
                                                                options={
                                                                    searchRecipes ||
                                                                    []
                                                                }
                                                                getOptionLabel={(
                                                                    option,
                                                                ) =>
                                                                    typeof option ===
                                                                    "string"
                                                                        ? option
                                                                        : option.Name ||
                                                                          ""
                                                                }
                                                                onChange={(
                                                                    event,
                                                                    value,
                                                                ) => {
                                                                    if (
                                                                        value &&
                                                                        typeof value !==
                                                                            "string"
                                                                    ) {
                                                                        setMeals(
                                                                            (
                                                                                prev,
                                                                            ) => {
                                                                                return prev.map(
                                                                                    (
                                                                                        meal,
                                                                                        mealIdx,
                                                                                    ) => {
                                                                                        if (
                                                                                            mealIdx !==
                                                                                            index
                                                                                        )
                                                                                            return meal

                                                                                        const updatedRecipes =
                                                                                            meal.Recipes.map(
                                                                                                (
                                                                                                    r,
                                                                                                    rIdx,
                                                                                                ) => {
                                                                                                    if (
                                                                                                        rIdx !==
                                                                                                        recIndex
                                                                                                    )
                                                                                                        return r

                                                                                                    return {
                                                                                                        ...value,
                                                                                                        Ingredients:
                                                                                                            value.Ingredients ??
                                                                                                            [],
                                                                                                        Name:
                                                                                                            value.Name ??
                                                                                                            "Recipe",
                                                                                                    }
                                                                                                },
                                                                                            )

                                                                                        const updatedMeal: Meal =
                                                                                            {
                                                                                                ...meal,
                                                                                                Recipes:
                                                                                                    updatedRecipes,
                                                                                            }

                                                                                        return calculateMealNutrition(
                                                                                            updatedMeal,
                                                                                        )
                                                                                    },
                                                                                )
                                                                            },
                                                                        )
                                                                    }
                                                                }}
                                                                renderInput={(
                                                                    params,
                                                                ) => (
                                                                    <div className="flex w-full gap-3">
                                                                        <TextField
                                                                            {...params}
                                                                            label={
                                                                                recipe.Name ||
                                                                                "Recipe #" +
                                                                                    (recIndex +
                                                                                        1)
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                handleRecipeSearch(
                                                                                    e,
                                                                                )
                                                                            }}
                                                                            onBlur={(
                                                                                e,
                                                                            ) => {
                                                                                const inputValue =
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                if (
                                                                                    inputValue &&
                                                                                    inputValue.length >
                                                                                        0
                                                                                ) {
                                                                                    setMeals(
                                                                                        (
                                                                                            prev,
                                                                                        ) => {
                                                                                            const newMeals =
                                                                                                [
                                                                                                    ...prev,
                                                                                                ]
                                                                                            newMeals[
                                                                                                index
                                                                                            ].Recipes[
                                                                                                recIndex
                                                                                            ].Name =
                                                                                                inputValue
                                                                                            return newMeals
                                                                                        },
                                                                                    )
                                                                                }
                                                                            }}
                                                                            slotProps={{
                                                                                input: {
                                                                                    ...params.InputProps,
                                                                                    type: "search",
                                                                                },
                                                                            }}
                                                                        />
                                                                        {meal
                                                                            .Recipes
                                                                            .length >
                                                                            1 && (
                                                                            <Button
                                                                                variant="contained"
                                                                                className="bg-LightGreen! hover:bg-LightGreen/80!"
                                                                                onClick={() =>
                                                                                    handleRemoveRecipe(
                                                                                        index,
                                                                                        recIndex,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Minus
                                                                                    size={
                                                                                        24
                                                                                    }
                                                                                    color="#FAF9F6"
                                                                                    weight="regular"
                                                                                ></Minus>
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            />
                                                        </Stack>
                                                    </div>
                                                    {recipe.Ingredients.map(
                                                        (
                                                            ingredient,
                                                            ingIndex,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    ingIndex +
                                                                    recipe.Name +
                                                                    ingredient.Name
                                                                }
                                                                className="flex gap-1"
                                                            >
                                                                {recipe.Code === "CUSTOM" ? (
                                                                    <div className="flex w-full flex-col gap-2">
                                                                        <TextField
                                                                            label="Custom Item Name"
                                                                            value={ingredient.Name || ""}
                                                                            onChange={(e) => updateCustomIngredient(index, recIndex, ingIndex, "Name", e.target.value)}
                                                                            fullWidth
                                                                        />
                                                                        <div className="flex gap-2">
                                                                            <TextField
                                                                                label="Kcal"
                                                                                type="number"
                                                                                value={ingredient.Kcal ?? 0}
                                                                                onChange={(e) => updateCustomIngredient(index, recIndex, ingIndex, "Kcal", parseFloat(e.target.value) || 0)}
                                                                                slotProps={{ input: { onFocus: (e) => e.target.select() } }}
                                                                            />
                                                                            <TextField
                                                                                label="Protein (g)"
                                                                                type="number"
                                                                                value={ingredient.Protein_total ?? 0}
                                                                                onChange={(e) => updateCustomIngredient(index, recIndex, ingIndex, "Protein_total", parseFloat(e.target.value) || 0)}
                                                                                slotProps={{ input: { onFocus: (e) => e.target.select() } }}
                                                                            />
                                                                            <TextField
                                                                                label="Fat (g)"
                                                                                type="number"
                                                                                value={ingredient.Fat_total ?? 0}
                                                                                onChange={(e) => updateCustomIngredient(index, recIndex, ingIndex, "Fat_total", parseFloat(e.target.value) || 0)}
                                                                                slotProps={{ input: { onFocus: (e) => e.target.select() } }}
                                                                            />
                                                                            <TextField
                                                                                label="Carbs (g)"
                                                                                type="number"
                                                                                value={ingredient.Carbohydrates_total ?? 0}
                                                                                onChange={(e) => updateCustomIngredient(index, recIndex, ingIndex, "Carbohydrates_total", parseFloat(e.target.value) || 0)}
                                                                                slotProps={{ input: { onFocus: (e) => e.target.select() } }}
                                                                            />
                                                                            <TextField
                                                                                label="Amount"
                                                                                type="number"
                                                                                value={ingredient.Amount ?? 100}
                                                                                onChange={(e) => updateCustomIngredient(index, recIndex, ingIndex, "Amount", parseInt(e.target.value) || 0)}
                                                                                slotProps={{ input: { onFocus: (e) => e.target.select() } }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                <>
                                                                <div className="flex w-full flex-col">
                                                                    <Stack
                                                                        spacing={
                                                                            2
                                                                        }
                                                                    >
                                                                        <Autocomplete
                                                                            freeSolo
                                                                            id={`autocomplete-${index}`}
                                                                            disableClearable
                                                                            options={
                                                                                searchIngredients ||
                                                                                []
                                                                            }
                                                                            getOptionLabel={(
                                                                                option,
                                                                            ) =>
                                                                                typeof option ===
                                                                                "string"
                                                                                    ? option
                                                                                    : option.Name ||
                                                                                      ""
                                                                            }
                                                                            onChange={(
                                                                                event,
                                                                                value,
                                                                            ) => {
                                                                                if (
                                                                                    value &&
                                                                                    typeof value !==
                                                                                        "string"
                                                                                ) {
                                                                                    setMeals(
                                                                                        (
                                                                                            prev,
                                                                                        ) => {
                                                                                            const newMeals =
                                                                                                [
                                                                                                    ...prev,
                                                                                                ]
                                                                                            newMeals[
                                                                                                index
                                                                                            ].Recipes[
                                                                                                recIndex
                                                                                            ].Ingredients[
                                                                                                ingIndex
                                                                                            ] =
                                                                                                {
                                                                                                    ...value,

                                                                                                    Amount:
                                                                                                        ingredient.Amount ??
                                                                                                        100,
                                                                                                }
                                                                                            newMeals[
                                                                                                index
                                                                                            ] =
                                                                                                calculateMealNutrition(
                                                                                                    newMeals[
                                                                                                        index
                                                                                                    ],
                                                                                                )
                                                                                            return newMeals
                                                                                        },
                                                                                    )
                                                                                }
                                                                            }}
                                                                            renderInput={(
                                                                                params,
                                                                            ) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label={
                                                                                        ingredient.Name ||
                                                                                        "Ingredient #" +
                                                                                            (ingIndex +
                                                                                                1)
                                                                                    }
                                                                                    onChange={
                                                                                        handleIngredientSearch
                                                                                    }
                                                                                    slotProps={{
                                                                                        input: {
                                                                                            ...params.InputProps,
                                                                                            type: "search",
                                                                                        },
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </Stack>
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <TextField
                                                                        label="Amount"
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const amount =
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ) ||
                                                                                0
                                                                            setMeals(
                                                                                (
                                                                                    prev,
                                                                                ) => {
                                                                                    const newMeals =
                                                                                        [
                                                                                            ...prev,
                                                                                        ]
                                                                                    newMeals[
                                                                                        index
                                                                                    ].Recipes[
                                                                                        recIndex
                                                                                    ].Ingredients[
                                                                                        ingIndex
                                                                                    ].Amount =
                                                                                        amount
                                                                                    newMeals[
                                                                                        index
                                                                                    ] =
                                                                                        calculateMealNutrition(
                                                                                            newMeals[
                                                                                                index
                                                                                            ],
                                                                                        )
                                                                                    return newMeals
                                                                                },
                                                                            )
                                                                        }}
                                                                        slotProps={{
                                                                            input: {
                                                                                type: "number",
                                                                                value: meals[
                                                                                    index
                                                                                ]
                                                                                    .Recipes[
                                                                                    recIndex
                                                                                ]
                                                                                    .Ingredients[
                                                                                    ingIndex
                                                                                ]
                                                                                    .Amount,
                                                                                onFocus:
                                                                                    (
                                                                                        e,
                                                                                    ) => {
                                                                                        e.target.select()
                                                                                    },
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                                </>
                                                                )}
                                                                {recipe
                                                                    .Ingredients
                                                                    .length >
                                                                    1 && (
                                                                    <Button
                                                                        variant="contained"
                                                                        className="bg-LightGreen! hover:bg-LightGreen/80!"
                                                                        onClick={() =>
                                                                            handleRemoveIngredient(
                                                                                index,
                                                                                recIndex,
                                                                                ingIndex,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Minus
                                                                            size={
                                                                                24
                                                                            }
                                                                            color="#FAF9F6"
                                                                            weight="regular"
                                                                        ></Minus>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                    <div className="flex w-full items-center justify-end">
                                                        <Button
                                                            variant="contained"
                                                            className="bg-Cream! hover:bg-Cream/80! text-DarkGreen! gap-2 text-sm! font-medium! normal-case!"
                                                            onClick={() =>
                                                                handleAddNewIngredient(
                                                                    index,
                                                                    recIndex,
                                                                )
                                                            }
                                                        >
                                                            Add Ingredient
                                                            <Plus
                                                                size={18}
                                                                color="#395B64"
                                                                weight="regular"
                                                            ></Plus>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                        <h5 className="text-DarkGreen font-Poppins flex w-full justify-end text-xl font-medium">
                                            Total Meal Calories:{" "}
                                            {meal.Kcal?.toFixed(2)}
                                        </h5>
                                    </div>
                                </form>
                            </div>
                            <div className="just flex w-full flex-row">
                                <div className="bg-Cream/40 flex h-full shrink-0 items-center border border-r-0 border-slate-300 px-4">
                                    <span className="text-DarkGreen font-Poppins text-lg font-medium">
                                        {meal.Name}
                                    </span>
                                </div>
                                <div className="flex w-full flex-col">
                                    <div className="flex h-20 w-full bg-white">
                                        <div className="w-full max-w-1/3 border-1 border-r-0 border-slate-300"></div>
                                        <div className="text-DarkGreen font-Poppins flex w-full flex-row items-center justify-around border-1 border-slate-300 px-4 py-2 font-semibold">
                                            <span>Amount</span>
                                            <span>Water</span>
                                            <span>Meal Kcal %</span>
                                            <span>Calories</span>
                                        </div>
                                    </div>
                                    <div className="flex h-full flex-col bg-white">
                                        {meal.Recipes.map(
                                            (recipe, recipeIndex) => (
                                                <div
                                                    className="flex h-full w-full"
                                                    key={recipeIndex}
                                                >
                                                    <div
                                                        key={
                                                            recipeIndex +
                                                            recipe.Name +
                                                            meal.Name
                                                        }
                                                        className="text-DarkGreen flex h-full w-full max-w-1/3 items-center border border-t-0 border-r-0 border-slate-300 bg-white"
                                                    >
                                                        <span className="text-DarkGreen font-Poppins w-full max-w-[120px] px-5">
                                                            {recipe.Name || "-"}
                                                        </span>
                                                        <div className="flex h-full w-full flex-col">
                                                            {recipe.Ingredients.map(
                                                                (
                                                                    ingredient,
                                                                    ingIndex,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            ingIndex +
                                                                            recipe.Name +
                                                                            ingredient.Name
                                                                        }
                                                                        className="text-DarkGreen flex h-full w-full items-center border border-t-0 border-slate-300 bg-white px-4"
                                                                    >
                                                                        {ingredient.Name ===
                                                                        ""
                                                                            ? "-"
                                                                            : ingredient.Name}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full flex-col items-center border border-t-0 border-r-0 border-l-0 border-slate-300">
                                                        {recipe.Ingredients.map(
                                                            (
                                                                ingredient,
                                                                ingIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        ingIndex +
                                                                        recipe.Name +
                                                                        ingredient.Name
                                                                    }
                                                                    className="text-DarkGreen flex h-full w-full items-center border border-t-0 border-slate-300 bg-white px-4"
                                                                >
                                                                    <span className="w-full text-center">
                                                                        {ingredient.Amount &&
                                                                        ingredient.Amount >
                                                                            0
                                                                            ? ingredient.Amount +
                                                                              "g"
                                                                            : "-"}
                                                                    </span>
                                                                    <span className="w-full text-center">
                                                                        {Number(
                                                                            ingredient.Water,
                                                                        ) > 0 &&
                                                                        (ingredient.Amount ??
                                                                            0) >
                                                                            0
                                                                            ? (
                                                                                  (Number(
                                                                                      ingredient.Water,
                                                                                  ) *
                                                                                      (ingredient.Amount ??
                                                                                          0)) /
                                                                                  100
                                                                              ).toFixed(
                                                                                  2,
                                                                              ) +
                                                                              "ml"
                                                                            : "-"}
                                                                    </span>
                                                                    <span className="w-full text-center">
                                                                        {planCalories >
                                                                            0 &&
                                                                        Number(
                                                                            ingredient.Kcal,
                                                                        ) > 0 &&
                                                                        (ingredient.Amount ??
                                                                            0) >
                                                                            0
                                                                            ? (
                                                                                  (Number(
                                                                                      ingredient.Kcal,
                                                                                  ) *
                                                                                      (ingredient.Amount ??
                                                                                          0)) /
                                                                                  planCalories
                                                                              ).toFixed(
                                                                                  2,
                                                                              ) +
                                                                              "%"
                                                                            : "-"}
                                                                    </span>
                                                                    <span className="w-full text-center">
                                                                        {meal.Kcal &&
                                                                        meal.Kcal >
                                                                            0 &&
                                                                        ingredient.Kcal
                                                                            ? (
                                                                                  (Number(
                                                                                      ingredient.Kcal,
                                                                                  ) *
                                                                                      ingredient.Amount!) /
                                                                                  100
                                                                              ).toFixed(
                                                                                  2,
                                                                              )
                                                                            : "-"}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CalculateMeal
