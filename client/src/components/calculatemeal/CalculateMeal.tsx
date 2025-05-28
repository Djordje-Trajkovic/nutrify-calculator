"use client"
import { Ingredient, Meal, Recipe } from "@/utils/types"
import { Autocomplete, Button, Input, Stack, TextField } from "@mui/material"
import React, { useState } from "react"
import Cookies from "js-cookie"
import { Check, Minus, PencilSimple } from "@phosphor-icons/react"
import CustomModal from "../util/CustomModal"

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
            recipes: [
                {
                    Name: "",
                    carbohydrates: 0,
                    fat: 0,
                    glycemicLoad: 0,
                    kcal: 0,
                    protein: 0,
                    preparation: "",
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
    const [open, setOpen] = useState(false)
    const [chosenMeal, setChosenMeal] = useState<Meal | null>(null)

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
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/recipes?filters[Name][$contains]=${searchValue}&populate[Ingredients][populate]=*`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: "no-store",
                },
            )
            const data = await res.json()
            console.log("Data from search:", data)
            const recipes: Recipe[] = data.data.map((item: Recipe) => {
                const ingredients: Ingredient[] = item.Ingredients.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (ing: any) => {
                        const ingData = ing.ingredient
                        return {
                            Name: ingData.Name,
                            Code: ingData.Code,
                            Amount: ing.Amount,
                            Kcal: ingData.Kcal,
                            Protein_plant: ingData.Protein_plant,
                            Protein_animal: ingData.Protein_animal,
                            Protein_total: ingData.Protein_total,
                            Fat_saturated: ingData.Fat_saturated,
                            Fat_unsaturated: ingData.Fat_unsaturated,
                            Fat_total: ingData.Fat_total,
                            Cholesterol: ingData.Cholesterol,
                            Carbohydrates_mono: ingData.Carbohydrates_mono,
                            Carbohydrates_poli: ingData.Carbohydrates_poli,
                            Carbohydrates_total: ingData.Carbohydrates_total,
                            Ashes: ingData.Ashes,
                            Cellulose: ingData.Cellulose,
                            Mineral_Na: ingData.Mineral_Na,
                            Mineral_K: ingData.Mineral_K,
                            Mineral_Ca: ingData.Mineral_Ca,
                            Mineral_Mg: ingData.Mineral_Mg,
                            Mineral_P: ingData.Mineral_P,
                            Mineral_Fe: ingData.Mineral_Fe,
                            Mineral_Zn: ingData.Mineral_Zn,
                            Mineral_Cu: ingData.Mineral_Cu,
                            Vitamin_RE: ingData.Vitamin_RE,
                            Vitamin_B1: ingData.Vitamin_B1,
                            Vitamin_B2: ingData.Vitamin_B2,
                            Vitamin_B6: ingData.Vitamin_B6,
                            Vitamin_PP: ingData.Vitamin_PP,
                            Vitamin_C: ingData.Vitamin_C,
                            Vitamin_E: ingData.Vitamin_E,
                            Glycemic_index: ingData.Glycemic_index,
                            Glycemic_load: ingData.Glycemic_load,
                            Atherogenic_index: ingData.Atherogenic_index,
                        }
                    },
                )

                const totalKcal = ingredients.reduce(
                    (sum, ing) =>
                        sum + (ing.Kcal ?? 0) * ((ing.Amount ?? 0) / 100),
                    0,
                )
                const totalProtein = ingredients.reduce(
                    (sum, ing) =>
                        sum +
                        ((ing.Protein_plant ?? 0) + (ing.Protein_animal ?? 0)) *
                            ((ing.Amount ?? 0) / 100),
                    0,
                )
                const totalFat = ingredients.reduce(
                    (sum, ing) =>
                        sum + (ing.Fat_total ?? 0) * ((ing.Amount ?? 0) / 100),
                    0,
                )
                const totalCarbs = ingredients.reduce(
                    (sum, ing) =>
                        sum +
                        (ing.Carbohydrates_total ?? 0) *
                            ((ing.Amount ?? 0) / 100),
                    0,
                )

                const totalGlycemicLoad = ingredients.reduce((sum, ing) => {
                    if (ing.Glycemic_index != null) {
                        return (
                            sum +
                            (ing.Glycemic_index *
                                (ing.Carbohydrates_total ?? 0) *
                                (ing.Amount ?? 0)) /
                                10000
                        )
                    }
                    return sum
                }, 0)

                return {
                    Name: item.Name,
                    Ingredients: ingredients,
                    kcal: totalKcal,
                    protein: totalProtein,
                    fat: totalFat,
                    carbohydrates: totalCarbs,
                    glycemicLoad: totalGlycemicLoad,
                    preparation: item.preparation ?? undefined,
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
            const newRecipes = [...(targetMeal.recipes ?? [])]
            const newRecipe: Recipe = {
                Name: `Recipe #${newRecipes.length + 1}`,
                Ingredients: [
                    {
                        Name: "",
                        Code: "",
                        Amount: 100,
                        Kcal: 0,
                    },
                ],
                kcal: 0,
                protein: 0,
                fat: 0,
                carbohydrates: 0,
                glycemicLoad: 0,
            }
            newRecipes.push(newRecipe)
            targetMeal.recipes = newRecipes
            newMeals[mealIndex] = targetMeal

            return newMeals
        })
    }
    const handleRemoveRecipe = (mealIndex: number, recIndex: number) => {
        setMeals((prev) => {
            const newMeals = [...prev]
            const targetMeal = { ...newMeals[mealIndex] }
            const newRecipes = [...(targetMeal.recipes ?? [])]
            newRecipes.splice(recIndex, 1)
            targetMeal.recipes = newRecipes
            newMeals[mealIndex] = targetMeal

            return newMeals
        })
    }
    const handleAddNewMeal = () => {
        setMeals((prev) => [
            ...prev,
            {
                Name: `Meal #${prev.length + 1}`,
                recipes: [
                    {
                        Name: "Recipe #1",
                        Ingredients: [
                            {
                                Name: "",
                                Code: "",
                                Amount: 100,
                                Kcal: 0,
                            },
                        ],
                        kcal: 0,
                        protein: 0,
                        fat: 0,
                        carbohydrates: 0,
                        glycemicLoad: 0,
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
        newMeals[mealIndex].recipes[recIndex].Ingredients.push({
            Name: "",
            Code: "",
            Amount: 100,
            Kcal: 0,
        })
        setMeals(newMeals)
    }
    const handleRemoveIngredient = (
        mealIndex: number,
        recIndex: number,
        ingIndex: number,
    ) => {
        setMeals((prevMeals) => {
            const updatedMeals = [...prevMeals]
            const updatedMeal = { ...updatedMeals[mealIndex] }
            const updatedRecipes = [...updatedMeal.recipes]
            const updatedRecipe = { ...updatedRecipes[recIndex] }
            const updatedIngredients = [...updatedRecipe.Ingredients]

            updatedIngredients.splice(ingIndex, 1)

            updatedRecipe.Ingredients = updatedIngredients
            updatedRecipes[recIndex] = updatedRecipe
            updatedMeal.recipes = updatedRecipes

            const recalculatedMeal = calculateMealNutrition(updatedMeal)

            updatedMeals[mealIndex] = recalculatedMeal

            return updatedMeals
        })
    }
    const calculateMealNutrition = (meal: Meal): Meal => {
        const nutritionTotals = {
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
        }

        let totalCarbsForGlycemicIndex = 0
        let weightedGlycemicIndex = 0

        for (const recipe of meal.recipes) {
            for (const ingredient of recipe.Ingredients) {
                const amount = ingredient.Amount ?? 0
                const factor = amount / 100

                nutritionTotals.Kcal += (ingredient.Kcal ?? 0) * factor
                nutritionTotals.Protein_total +=
                    (ingredient.Protein_total ?? 0) * factor
                nutritionTotals.Protein_plant +=
                    (ingredient.Protein_plant ?? 0) * factor
                nutritionTotals.Protein_animal +=
                    (ingredient.Protein_animal ?? 0) * factor
                nutritionTotals.Fat_total +=
                    (ingredient.Fat_total ?? 0) * factor
                nutritionTotals.Fat_saturated +=
                    (ingredient.Fat_saturated ?? 0) * factor
                nutritionTotals.Fat_unsaturated +=
                    (ingredient.Fat_unsaturated ?? 0) * factor
                nutritionTotals.Carbohydrates_total +=
                    (ingredient.Carbohydrates_total ?? 0) * factor
                nutritionTotals.Carbohydrates_mono +=
                    (ingredient.Carbohydrates_mono ?? 0) * factor
                nutritionTotals.Carbohydrates_poli +=
                    (ingredient.Carbohydrates_poli ?? 0) * factor
                nutritionTotals.Cholesterol +=
                    (ingredient.Cholesterol ?? 0) * factor
                nutritionTotals.Ashes += (ingredient.Ashes ?? 0) * factor
                nutritionTotals.Cellulose +=
                    (ingredient.Cellulose ?? 0) * factor
                nutritionTotals.Mineral_Na +=
                    (ingredient.Mineral_Na ?? 0) * factor
                nutritionTotals.Mineral_K +=
                    (ingredient.Mineral_K ?? 0) * factor
                nutritionTotals.Mineral_Ca +=
                    (ingredient.Mineral_Ca ?? 0) * factor
                nutritionTotals.Mineral_Mg +=
                    (ingredient.Mineral_Mg ?? 0) * factor
                nutritionTotals.Mineral_P +=
                    (ingredient.Mineral_P ?? 0) * factor
                nutritionTotals.Mineral_Fe +=
                    (ingredient.Mineral_Fe ?? 0) * factor
                nutritionTotals.Mineral_Zn +=
                    (ingredient.Mineral_Zn ?? 0) * factor
                nutritionTotals.Mineral_Cu +=
                    (ingredient.Mineral_Cu ?? 0) * factor
                nutritionTotals.Vitamin_RE +=
                    (ingredient.Vitamin_RE ?? 0) * factor
                nutritionTotals.Vitamin_B1 +=
                    (ingredient.Vitamin_B1 ?? 0) * factor
                nutritionTotals.Vitamin_B2 +=
                    (ingredient.Vitamin_B2 ?? 0) * factor
                nutritionTotals.Vitamin_B6 +=
                    (ingredient.Vitamin_B6 ?? 0) * factor
                nutritionTotals.Vitamin_PP +=
                    (ingredient.Vitamin_PP ?? 0) * factor
                nutritionTotals.Vitamin_C +=
                    (ingredient.Vitamin_C ?? 0) * factor
                nutritionTotals.Vitamin_E +=
                    (ingredient.Vitamin_E ?? 0) * factor

                const carbsInIngredient =
                    (ingredient.Carbohydrates_total ?? 0) * factor
                if (carbsInIngredient > 0 && ingredient.Glycemic_index) {
                    weightedGlycemicIndex +=
                        carbsInIngredient * (ingredient.Glycemic_index ?? 0)
                    totalCarbsForGlycemicIndex += carbsInIngredient
                }
                nutritionTotals.Atherogenic_index +=
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
    const calculateTotalNutrition = () => {
        const totals = {
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
        }

        let totalCarbsForGlycemicIndex = 0
        let weightedGlycemicIndex = 0

        for (const meal of meals) {
            totals.Kcal += meal.Kcal ?? 0
            totals.Protein_total += meal.Protein_total ?? 0
            totals.Protein_plant += meal.Protein_plant ?? 0
            totals.Protein_animal += meal.Protein_animal ?? 0
            totals.Fat_total += meal.Fat_total ?? 0
            totals.Fat_saturated += meal.Fat_saturated ?? 0
            totals.Fat_unsaturated += meal.Fat_unsaturated ?? 0
            totals.Carbohydrates_total += meal.Carbohydrates_total ?? 0
            totals.Carbohydrates_mono += meal.Carbohydrates_mono ?? 0
            totals.Carbohydrates_poli += meal.Carbohydrates_poli ?? 0
            totals.Cholesterol += meal.Cholesterol ?? 0
            totals.Ashes += meal.Ashes ?? 0
            totals.Cellulose += meal.Cellulose ?? 0
            totals.Mineral_Na += meal.Mineral_Na ?? 0
            totals.Mineral_K += meal.Mineral_K ?? 0
            totals.Mineral_Ca += meal.Mineral_Ca ?? 0
            totals.Mineral_Mg += meal.Mineral_Mg ?? 0
            totals.Mineral_P += meal.Mineral_P ?? 0
            totals.Mineral_Fe += meal.Mineral_Fe ?? 0
            totals.Mineral_Zn += meal.Mineral_Zn ?? 0
            totals.Mineral_Cu += meal.Mineral_Cu ?? 0
            totals.Vitamin_RE += meal.Vitamin_RE ?? 0
            totals.Vitamin_B1 += meal.Vitamin_B1 ?? 0
            totals.Vitamin_B2 += meal.Vitamin_B2 ?? 0
            totals.Vitamin_B6 += meal.Vitamin_B6 ?? 0
            totals.Vitamin_PP += meal.Vitamin_PP ?? 0
            totals.Vitamin_C += meal.Vitamin_C ?? 0
            totals.Vitamin_E += meal.Vitamin_E ?? 0
            totals.Atherogenic_index += meal.Atherogenic_index ?? 0

            // For weighted glycemic index calculation
            const mealCarbs = meal.Carbohydrates_total ?? 0
            if (mealCarbs > 0 && meal.Glycemic_index != null) {
                weightedGlycemicIndex += mealCarbs * meal.Glycemic_index
                totalCarbsForGlycemicIndex += mealCarbs
            }
        }

        // Calculate weighted glycemic index if there are carbs
        if (totalCarbsForGlycemicIndex > 0) {
            totals.Glycemic_index =
                weightedGlycemicIndex / totalCarbsForGlycemicIndex
        }

        return totals
    }

    return (
        <>
            <CustomModal
                open={open}
                title={chosenMeal?.Name ?? ""}
                type="info"
                onClose={() => {
                    setOpen(false)
                }}
                content={
                    <div className="flex flex-col gap-5">
                        {chosenMeal?.recipes.map((recipe, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <h2 className="text-DarkGreen font-Poppins text-3xl">
                                    {recipe.Name}
                                </h2>
                                <p>{recipe.preparation}</p>
                            </div>
                        ))}
                    </div>
                }
            />
            <div className="w-full pt-30 pb-10">
                <div className="flex w-full justify-between gap-4 pb-10">
                    <div className="flex gap-10">
                        <h1 className="text-DarkGreen font-Poppins text-4xl">
                            Create Meal Plan
                        </h1>
                        <Button
                            variant="contained"
                            className="bg-DarkGreen! hover:bg-DarkGreen/80"
                            onClick={() => {
                                handleAddNewMeal()
                            }}
                        >
                            Add New Meal
                        </Button>
                    </div>
                    <div className="flex gap-10">
                        <Input
                            placeholder="Meal Plan Name"
                            className="w-full max-w-[300px] bg-white px-5"
                            slotProps={{
                                input: {
                                    type: "search",
                                },
                            }}
                            onChange={(e) => {
                                setMealPlanName(e.target.value)
                            }}
                            value={mealPlanName}
                        />
                        <Button
                            variant="contained"
                            className="bg-DarkGreen! hover:bg-DarkGreen/80 w-full"
                            onClick={() => {
                                console.log("Save meal plan")
                            }}
                        >
                            Save Meal Plan
                        </Button>
                    </div>
                </div>
                <div className="flex w-full gap-[10%]">
                    <div className="flex min-w-1/3 flex-col gap-10">
                        <form className="text-DarkGreen flex flex-col gap-10">
                            {meals.map((meal, index) => (
                                <div
                                    key={index + meal.Name}
                                    className="flex w-full flex-col items-start gap-3"
                                >
                                    <div className="flex w-full">
                                        <div className="flex w-full justify-between">
                                            <div className="flex items-center gap-3">
                                                {editMealName[index] ? (
                                                    <TextField
                                                        label="Meal Name"
                                                        value={
                                                            mealName[index] ??
                                                            meal.Name
                                                        }
                                                        onChange={(e) => {
                                                            setMealName(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [index]:
                                                                        e.target
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
                                                {!editMealName[index] ? (
                                                    <Button
                                                        className="block! min-w-0! px-2! py-2!"
                                                        onClick={() => {
                                                            setEditMealName(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [index]:
                                                                        true,
                                                                }),
                                                            )
                                                            setMealName(
                                                                (prev) => ({
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
                                                            setMeals((prev) => {
                                                                const newMeals =
                                                                    [...prev]
                                                                newMeals[
                                                                    index
                                                                ].Name =
                                                                    mealName[
                                                                        index
                                                                    ] ||
                                                                    meal.Name
                                                                return newMeals
                                                            })
                                                            setEditMealName(
                                                                (prev) => ({
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
                                                        className="bg-DarkGreen! hover:bg-DarkGreen/80 flex! h-9 w-9 min-w-0! justify-center px-0! py-0!"
                                                        onClick={() => {
                                                            const newMeals = [
                                                                ...meals,
                                                            ]
                                                            newMeals.splice(
                                                                index,
                                                                1,
                                                            )
                                                            setMeals(newMeals)
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
                                                    className="bg-DarkGreen! hover:bg-DarkGreen/80"
                                                    onClick={() =>
                                                        handleAddNewRecipe(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    Add Recipe
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {meal.recipes.map((recipe, recIndex) => (
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
                                                            searchRecipes || []
                                                        }
                                                        getOptionLabel={(
                                                            option,
                                                        ) =>
                                                            typeof option ===
                                                            "string"
                                                                ? option
                                                                : option.Name
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
                                                                    (prev) => {
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
                                                                                    meal.recipes.map(
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
                                                                                                kcal:
                                                                                                    value.kcal ??
                                                                                                    0,
                                                                                                protein:
                                                                                                    value.protein ??
                                                                                                    0,
                                                                                                fat:
                                                                                                    value.fat ??
                                                                                                    0,
                                                                                                carbohydrates:
                                                                                                    value.carbohydrates ??
                                                                                                    0,
                                                                                                glycemicLoad:
                                                                                                    value.glycemicLoad ??
                                                                                                    0,
                                                                                                preparation:
                                                                                                    value.preparation ??
                                                                                                    "",
                                                                                                Name:
                                                                                                    value.Name ??
                                                                                                    "Recipe",
                                                                                            }
                                                                                        },
                                                                                    )

                                                                                const updatedMeal: Meal =
                                                                                    {
                                                                                        ...meal,
                                                                                        recipes:
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
                                                                                    ].recipes[
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
                                                                {meal.recipes
                                                                    .length >
                                                                    1 && (
                                                                    <Button
                                                                        variant="contained"
                                                                        className="bg-DarkGreen! hover:bg-DarkGreen/80"
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
                                                (ingredient, ingIndex) => (
                                                    <div
                                                        key={
                                                            ingIndex +
                                                            recipe.Name +
                                                            ingredient.Name
                                                        }
                                                        className="flex gap-1"
                                                    >
                                                        <div className="flex w-full flex-col">
                                                            <Stack spacing={2}>
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
                                                                            : option.Name
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
                                                                                    ].recipes[
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
                                                                        ) || 0
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
                                                                            ].recipes[
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
                                                                        value: ingredient.Amount,
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
                                                        {recipe.Ingredients
                                                            .length > 1 && (
                                                            <Button
                                                                variant="contained"
                                                                className="bg-DarkGreen! hover:bg-DarkGreen/80"
                                                                onClick={() =>
                                                                    handleRemoveIngredient(
                                                                        index,
                                                                        recIndex,
                                                                        ingIndex,
                                                                    )
                                                                }
                                                            >
                                                                <Minus
                                                                    size={24}
                                                                    color="#FAF9F6"
                                                                    weight="regular"
                                                                ></Minus>
                                                            </Button>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                            <Button
                                                variant="contained"
                                                className="bg-DarkGreen! hover:bg-DarkGreen/80"
                                                onClick={() =>
                                                    handleAddNewIngredient(
                                                        index,
                                                        recIndex,
                                                    )
                                                }
                                            >
                                                Add Ingredient
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </form>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-DarkGreen font-Poppins pb-5 text-4xl">
                            Result
                        </h1>
                        {meals.map((meal, index: number) => (
                            <div
                                key={meal.Name + index}
                                className="flex w-full flex-col"
                            >
                                <div className="flex w-full justify-between">
                                    <h3
                                        onClick={() => {
                                            setOpen(true)
                                            setChosenMeal(meal)
                                        }}
                                        className="text-DarkGreen font-Poppins flex items-center pr-4 text-2xl"
                                    >
                                        {mealName[index] ?? meal.Name}
                                    </h3>
                                    <div className="flex max-w-[80%] gap-3">
                                        <TextField
                                            disabled
                                            label="Calories"
                                            className="max-w-[120px]!"
                                            value={meal.Kcal.toFixed(4)}
                                            slotProps={{
                                                input: {
                                                    type: "number",
                                                },
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            label="Protein"
                                            className="max-w-[120px]!"
                                            value={meal.Protein_total.toFixed(
                                                4,
                                            )}
                                            slotProps={{
                                                input: {
                                                    type: "number",
                                                },
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            label="Fat"
                                            className="max-w-[120px]!"
                                            value={meal.Fat_total.toFixed(4)}
                                            slotProps={{
                                                input: {
                                                    type: "number",
                                                },
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            label="Carbohydrates"
                                            className="max-w-[120px]!"
                                            value={meal.Carbohydrates_total.toFixed(
                                                4,
                                            )}
                                            slotProps={{
                                                input: {
                                                    type: "number",
                                                },
                                            }}
                                        />
                                        {/* <TextField
                                            disabled
                                            label="Glycemic Load"
                                            className="max-w-[120px]!"
                                            value={meal.Glycemic_index.toFixed(4)}
                                            slotProps={{
                                                input: {
                                                    type: "number",
                                                },
                                            }}
                                        /> */}
                                    </div>
                                </div>
                                {index === meals.length - 1 && (
                                    <div className="flex w-full flex-col gap-3 py-4">
                                        <div className="bg-DarkGreen h-[3px] w-full"></div>
                                        <div className="flex w-full justify-between">
                                            <h3 className="text-DarkGreen font-Poppins flex items-center pr-4 text-2xl">
                                                Total
                                            </h3>
                                            <div className="flex max-w-[80%] gap-3">
                                                <TextField
                                                    disabled
                                                    label="Calories"
                                                    className="max-w-[120px]!"
                                                    value={calculateTotalNutrition().Kcal.toFixed(
                                                        4,
                                                    )}
                                                    slotProps={{
                                                        input: {
                                                            type: "number",
                                                        },
                                                    }}
                                                />
                                                <TextField
                                                    disabled
                                                    label="Protein"
                                                    className="max-w-[120px]!"
                                                    value={calculateTotalNutrition().Protein_total.toFixed(
                                                        4,
                                                    )}
                                                    slotProps={{
                                                        input: {
                                                            type: "number",
                                                        },
                                                    }}
                                                />
                                                <TextField
                                                    disabled
                                                    label="Fat"
                                                    className="max-w-[120px]!"
                                                    value={meal.Fat_total.toFixed(
                                                        4,
                                                    )}
                                                    slotProps={{
                                                        input: {
                                                            type: "number",
                                                        },
                                                    }}
                                                />
                                                <TextField
                                                    disabled
                                                    label="Carbohydrates"
                                                    className="max-w-[120px]!"
                                                    value={calculateTotalNutrition().Carbohydrates_total.toFixed(
                                                        4,
                                                    )}
                                                    slotProps={{
                                                        input: {
                                                            type: "number",
                                                        },
                                                    }}
                                                />
                                                {/* <TextField
                                                    disabled
                                                    label="Glycemic Load"
                                                    className="max-w-[120px]!"
                                                    value={calculateTotalNutrition().glycemicLoad.toFixed(
                                                        4,
                                                    )}
                                                    slotProps={{
                                                        input: {
                                                            type: "number",
                                                        },
                                                    }}
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CalculateMeal
