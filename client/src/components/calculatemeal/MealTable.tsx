import React from "react"
import type { JSX } from "react"
import { Ingredient, Meal, NutritionalFields } from "../../utils/types" // adjust import

type Props = {
    meals: Meal[]
    fields: (keyof NutritionalFields)[] // choose which fields to show
}

export default function CustomMealTable({ meals, fields }: Props) {
    return (
        <div style={{ overflow: "auto", maxWidth: "100%" }}>
            <table
                style={{
                    borderCollapse: "collapse",
                    border: "1px solid #cbd5e0",
                    fontSize: "9px",
                    width: "100%",
                    minWidth: "1000px",
                }}
            >
                <thead style={{ backgroundColor: "#f7fafc" }}>
                    <tr>
                        <th
                            style={{
                                border: "1px solid #cbd5e0",
                                padding: "0.25rem",
                            }}
                        >
                            Meal
                        </th>
                        <th
                            style={{
                                border: "1px solid #cbd5e0",
                                padding: "0.25rem",
                            }}
                        >
                            Recipe
                        </th>
                        <th
                            style={{
                                border: "1px solid #cbd5e0",
                                padding: "0.25rem",
                            }}
                        >
                            Ingredient
                        </th>
                        {fields.map((field) => (
                            <th
                                key={field}
                                style={{
                                    border: "1px solid #cbd5e0",
                                    padding: "0.25rem",
                                }}
                            >
                                {field}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const isRawField = (field: keyof NutritionalFields) =>
                            field === "Volume_per_Unit" || field === "Amount"

                        const rows: JSX.Element[] = []
                        const overallTotals: Partial<
                            Record<keyof NutritionalFields, number>
                        > = {}
                        fields.forEach((f) => (overallTotals[f] = 0))

                        meals.forEach((meal) => {
                            const mealRowSpan = meal.Recipes.reduce(
                                (sum, r) => sum + r.Ingredients.length,
                                0,
                            )
                            const mealTotals: Partial<
                                Record<keyof NutritionalFields, number>
                            > = {}
                            fields.forEach((f) => (mealTotals[f] = 0))

                            meal.Recipes.forEach((recipe, recipeIndex) => {
                                const recipeRowSpan = recipe.Ingredients.length
                                recipe.Ingredients.forEach(
                                    (ingredient, ingredientIndex) => {
                                        rows.push(
                                            <tr
                                                key={`${meal.Name}-${recipe.Name}-${ingredient?.Name}-${ingredientIndex}`}
                                            >
                                                {recipeIndex === 0 &&
                                                    ingredientIndex === 0 && (
                                                        <td
                                                            rowSpan={
                                                                mealRowSpan
                                                            }
                                                            style={{
                                                                border: "1px solid #cbd5e0",
                                                                padding:
                                                                    "0.25rem",
                                                                fontWeight: 700,
                                                                verticalAlign:
                                                                    "top",
                                                                backgroundColor:
                                                                    "#f9fafb",
                                                            }}
                                                        >
                                                            {meal.Name}
                                                        </td>
                                                    )}
                                                {ingredientIndex === 0 && (
                                                    <td
                                                        rowSpan={recipeRowSpan}
                                                        style={{
                                                            border: "1px solid #cbd5e0",
                                                            padding: "0.25rem",
                                                            fontWeight: 600,
                                                            verticalAlign:
                                                                "top",
                                                            backgroundColor:
                                                                "#f7fafc",
                                                        }}
                                                    >
                                                        {recipe.Name ||
                                                            "Unnamed Recipe"}
                                                    </td>
                                                )}
                                                <td
                                                    style={{
                                                        border: "1px solid #cbd5e0",
                                                        padding: "0.25rem",
                                                    }}
                                                >
                                                    {ingredient.Name || "-"}
                                                </td>

                                                {fields.map((field) => {
                                                    const val = (
                                                        ingredient as Ingredient
                                                    )[field] as
                                                        | number
                                                        | undefined

                                                    // numeric contribution for totals
                                                    const contribution =
                                                        val == null
                                                            ? 0
                                                            : isRawField(field)
                                                              ? val
                                                              : val *
                                                                    ((ingredient.Amount ??
                                                                        0) /
                                                                        100) ||
                                                                0

                                                    mealTotals[field] =
                                                        (mealTotals[field] ??
                                                            0) + contribution
                                                    overallTotals[field] =
                                                        (overallTotals[field] ??
                                                            0) + contribution

                                                    return (
                                                        <td
                                                            key={field}
                                                            style={{
                                                                border: "1px solid #cbd5e0",
                                                                padding:
                                                                    "0.25rem",
                                                                textAlign:
                                                                    "right",
                                                            }}
                                                        >
                                                            {(() => {
                                                                if (val == null)
                                                                    return ""
                                                                if (
                                                                    isRawField(
                                                                        field,
                                                                    )
                                                                )
                                                                    return val
                                                                const amt =
                                                                    ingredient.Amount ??
                                                                    0
                                                                return (
                                                                    val *
                                                                    (amt / 100)
                                                                ).toFixed(4)
                                                            })()}
                                                        </td>
                                                    )
                                                })}
                                            </tr>,
                                        )
                                    },
                                )
                            })

                            // Meal total row
                            rows.push(
                                <tr
                                    key={`${meal.Name}-total`}
                                    style={{ backgroundColor: "#edf2f7" }}
                                >
                                    <td
                                        style={{
                                            border: "1px solid #cbd5e0",
                                            padding: "0.25rem",
                                            fontWeight: 700,
                                            textAlign: "left",
                                        }}
                                    >
                                        Total ({meal.Name})
                                    </td>
                                    <td colSpan={2}></td>
                                    {fields.map((field) => (
                                        <td
                                            key={`${meal.Name}-${field}-total`}
                                            style={{
                                                border: "1px solid #cbd5e0",
                                                padding: "0.25rem",
                                                textAlign: "right",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {isRawField(field)
                                                ? (mealTotals[field] ?? 0)
                                                : (
                                                      (mealTotals[field] ??
                                                          0) as number
                                                  ).toFixed(4)}
                                        </td>
                                    ))}
                                </tr>,
                            )
                        })

                        return (
                            <>
                                {rows}
                                {/* Overall total row */}
                                <tr
                                    key="overall-total"
                                    style={{ backgroundColor: "#e2e8f0" }}
                                >
                                    <td
                                        colSpan={1}
                                        style={{
                                            border: "1px solid #cbd5e0",
                                            padding: "0.25rem",
                                            fontWeight: 800,
                                            textAlign: "left",
                                        }}
                                    >
                                        Total (All Meals)
                                    </td>
                                    <td colSpan={2}></td>
                                    {fields.map((field) => (
                                        <td
                                            key={`overall-${field}`}
                                            style={{
                                                border: "1px solid #cbd5e0",
                                                padding: "0.25rem",
                                                textAlign: "right",
                                                fontWeight: 800,
                                            }}
                                        >
                                            {isRawField(field)
                                                ? (overallTotals[field] ?? 0)
                                                : (
                                                      (overallTotals[field] ??
                                                          0) as number
                                                  ).toFixed(4)}
                                        </td>
                                    ))}
                                </tr>
                            </>
                        )
                    })()}
                </tbody>
            </table>
        </div>
    )
}
