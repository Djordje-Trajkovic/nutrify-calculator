"use client"
import React, { useRef } from "react"
import { Meal } from "@/utils/types"
import { Button } from "@mui/material"
import { FileArrowDown } from "@phosphor-icons/react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface MealPreviewProps {
    meals: Meal[]
}

const MealPreview: React.FC<MealPreviewProps> = ({ meals }) => {
    const previewRef = useRef<HTMLDivElement>(null)

    const calculateTotalNutrition = () => {
        const totals = {
            kcal: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            glycemicLoad: 0,
        }
        for (const meal of meals) {
            totals.kcal += meal.kcal
            totals.protein += meal.protein
            totals.fat += meal.fat
            totals.carbohydrates += meal.carbohydrates
            totals.glycemicLoad += meal.glycemicLoad
        }
        return totals
    }

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return

        try {
            // Create canvas from the preview content
            const canvas = await html2canvas(previewRef.current, {
                useCORS: true,
                logging: false,
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
            const imgX = (pdfWidth - imgWidth * ratio) / 2
            const imgY = 10

            pdf.addImage(
                imgData,
                "PNG",
                imgX,
                imgY,
                imgWidth * ratio,
                imgHeight * ratio,
            )
            pdf.save("meal-plan.pdf")
        } catch (error) {
            console.error("Error generating PDF:", error)
        }
    }

    const totals = calculateTotalNutrition()

    return (
        <div className="flex w-full flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-DarkGreen font-Poppins text-3xl">
                    Meal Plan Preview
                </h2>
                <Button
                    variant="contained"
                    className="bg-DarkGreen! hover:bg-DarkGreen/80"
                    onClick={handleDownloadPDF}
                    startIcon={<FileArrowDown size={24} weight="bold" />}
                >
                    Download PDF
                </Button>
            </div>

            <div
                ref={previewRef}
                className="rounded-lg border-2 border-DarkGreen bg-white p-8"
            >
                <div className="mb-6 text-center">
                    <h1 className="text-DarkGreen font-Poppins mb-2 text-4xl font-bold">
                        Meal Plan
                    </h1>
                    <p className="text-DarkGreen/60 font-Poppins text-sm">
                        Generated on {new Date().toLocaleDateString()}
                    </p>
                </div>

                {meals.map((meal, mealIndex) => (
                    <div
                        key={`${meal.name}-${mealIndex}`}
                        className="mb-8 border-b-2 border-DarkGreen/20 pb-6 last:border-b-0"
                    >
                        <h3 className="text-DarkGreen font-Poppins mb-4 text-2xl font-semibold">
                            {meal.name}
                        </h3>

                        {/* Ingredients Table */}
                        <div className="mb-4">
                            <h4 className="text-DarkGreen font-Poppins mb-2 text-lg font-medium">
                                Ingredients:
                            </h4>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-DarkGreen/10">
                                        <th className="text-DarkGreen border border-DarkGreen/20 p-2 text-left">
                                            Name
                                        </th>
                                        <th className="text-DarkGreen border border-DarkGreen/20 p-2 text-left">
                                            Code
                                        </th>
                                        <th className="text-DarkGreen border border-DarkGreen/20 p-2 text-right">
                                            Amount (g)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meal.ingredients.map(
                                        (ingredient, ingIndex) => (
                                            <tr
                                                key={`${ingredient.Name}-${ingIndex}`}
                                            >
                                                <td className="text-DarkGreen border border-DarkGreen/20 p-2">
                                                    {ingredient.Name || "-"}
                                                </td>
                                                <td className="text-DarkGreen border border-DarkGreen/20 p-2">
                                                    {ingredient.Code || "-"}
                                                </td>
                                                <td className="text-DarkGreen border border-DarkGreen/20 p-2 text-right">
                                                    {ingredient.Amount ?? 0}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Nutrition Summary */}
                        <div className="rounded-md bg-DarkGreen/5 p-4">
                            <h4 className="text-DarkGreen font-Poppins mb-3 text-lg font-medium">
                                Nutritional Values:
                            </h4>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                <div className="rounded bg-white p-3 shadow-sm">
                                    <p className="text-DarkGreen/60 text-xs">
                                        Calories
                                    </p>
                                    <p className="text-DarkGreen font-Poppins text-xl font-semibold">
                                        {meal.kcal.toFixed(1)}
                                    </p>
                                </div>
                                <div className="rounded bg-white p-3 shadow-sm">
                                    <p className="text-DarkGreen/60 text-xs">
                                        Protein (g)
                                    </p>
                                    <p className="text-DarkGreen font-Poppins text-xl font-semibold">
                                        {meal.protein.toFixed(1)}
                                    </p>
                                </div>
                                <div className="rounded bg-white p-3 shadow-sm">
                                    <p className="text-DarkGreen/60 text-xs">
                                        Fat (g)
                                    </p>
                                    <p className="text-DarkGreen font-Poppins text-xl font-semibold">
                                        {meal.fat.toFixed(1)}
                                    </p>
                                </div>
                                <div className="rounded bg-white p-3 shadow-sm">
                                    <p className="text-DarkGreen/60 text-xs">
                                        Carbs (g)
                                    </p>
                                    <p className="text-DarkGreen font-Poppins text-xl font-semibold">
                                        {meal.carbohydrates.toFixed(1)}
                                    </p>
                                </div>
                                <div className="rounded bg-white p-3 shadow-sm">
                                    <p className="text-DarkGreen/60 text-xs">
                                        Glycemic Load
                                    </p>
                                    <p className="text-DarkGreen font-Poppins text-xl font-semibold">
                                        {meal.glycemicLoad.toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Total Nutrition */}
                <div className="mt-8 rounded-lg border-2 border-DarkGreen bg-DarkGreen/10 p-6">
                    <h3 className="text-DarkGreen font-Poppins mb-4 text-center text-2xl font-bold">
                        Total Daily Nutrition
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                        <div className="rounded-md bg-white p-4 text-center shadow">
                            <p className="text-DarkGreen/60 mb-1 text-sm">
                                Total Calories
                            </p>
                            <p className="text-DarkGreen font-Poppins text-2xl font-bold">
                                {totals.kcal.toFixed(1)}
                            </p>
                        </div>
                        <div className="rounded-md bg-white p-4 text-center shadow">
                            <p className="text-DarkGreen/60 mb-1 text-sm">
                                Total Protein (g)
                            </p>
                            <p className="text-DarkGreen font-Poppins text-2xl font-bold">
                                {totals.protein.toFixed(1)}
                            </p>
                        </div>
                        <div className="rounded-md bg-white p-4 text-center shadow">
                            <p className="text-DarkGreen/60 mb-1 text-sm">
                                Total Fat (g)
                            </p>
                            <p className="text-DarkGreen font-Poppins text-2xl font-bold">
                                {totals.fat.toFixed(1)}
                            </p>
                        </div>
                        <div className="rounded-md bg-white p-4 text-center shadow">
                            <p className="text-DarkGreen/60 mb-1 text-sm">
                                Total Carbs (g)
                            </p>
                            <p className="text-DarkGreen font-Poppins text-2xl font-bold">
                                {totals.carbohydrates.toFixed(1)}
                            </p>
                        </div>
                        <div className="rounded-md bg-white p-4 text-center shadow">
                            <p className="text-DarkGreen/60 mb-1 text-sm">
                                Total Glycemic Load
                            </p>
                            <p className="text-DarkGreen font-Poppins text-2xl font-bold">
                                {totals.glycemicLoad.toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MealPreview
