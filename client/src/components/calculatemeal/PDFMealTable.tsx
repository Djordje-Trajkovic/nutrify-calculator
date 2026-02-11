import { View, Text, StyleSheet } from "@react-pdf/renderer"
import { Ingredient, Meal, NutritionalFields } from "../../utils/types"

type Props = {
    meals: Meal[]
    fields: (keyof NutritionalFields)[]
    planCalories: number
    showMealKcalPercent?: boolean
}

const styles = StyleSheet.create({
    tableContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#cbd5e0",
        alignSelf: "flex-start",
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e0",
    },
    cell: {
        borderRightWidth: 1,
        borderRightColor: "#cbd5e0",
        padding: 4,
        fontSize: 8,
        justifyContent: "center",
    },
    mealCell: {
        fontWeight: "bold",
        backgroundColor: "#f9fafb",
    },
    recipeCell: {
        fontWeight: "bold",
        backgroundColor: "#f7fafc",
    },
    headerCell: {
        fontWeight: "bold",
        backgroundColor: "#00473C",
        color: "#ffffff",
    },
    headerText: {
        color: "#ffffff",
        fontSize: 7,
    },
    mealTotalRow: {
        backgroundColor: "#edf2f7",
    },
    overallTotalRow: {
        backgroundColor: "#e2e8f0",
    },
    customAdditionRow: {
        backgroundColor: "#fef9c3",
    },
    totalCell: {
        fontWeight: "bold",
    },
    rightAlign: {
        textAlign: "right",
    },
})

const isRawField = (field: keyof NutritionalFields) =>
    field === "Volume_per_Unit" || field === "Amount"

const formatFieldName = (field: string): string => {
    return field
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .trim()
}

/**
 * Safely extracts a nutritional field value from an ingredient
 */
const getIngredientFieldValue = (
    ingredient: Ingredient,
    field: keyof NutritionalFields,
): number | undefined => {
    return ingredient[field]
}

/**
 * Calculates the contribution of an ingredient field to the totals
 */
const calculateFieldContribution = (
    ingredient: Ingredient,
    field: keyof NutritionalFields,
): number => {
    const value = getIngredientFieldValue(ingredient, field)
    if (value == null) return 0

    if (isRawField(field)) {
        return value
    }

    const amount = ingredient.Amount ?? 0
    return (value * amount) / 100 || 0
}

/**
 * Formats a field value for display in the table
 */
const formatFieldValue = (
    ingredient: Ingredient,
    field: keyof NutritionalFields,
): string => {
    const value = getIngredientFieldValue(ingredient, field)
    if (value == null) return ""

    if (isRawField(field)) {
        return value.toString()
    }

    const amount = ingredient.Amount ?? 0
    return ((value * amount) / 100).toFixed(2)
}

/**
 * Calculates the Meal Kcal % for an ingredient
 */
const calculateMealKcalPercent = (
    ingredient: Ingredient,
    planCalories: number,
): string => {
    const kcal = ingredient.Kcal ?? 0
    const amount = ingredient.Amount ?? 0
    const ingredientKcal = (kcal * amount) / 100
    if (planCalories <= 0 || ingredientKcal <= 0) return "-"
    return ((ingredientKcal / planCalories) * 100).toFixed(2) + "%"
}

// Fixed column widths
const MEAL_COL_WIDTH = 55
const RECIPE_COL_WIDTH = 55
const INGREDIENT_COL_WIDTH = 65
const FIELD_COL_WIDTH = 50

export default function PDFMealTable({ meals, fields, planCalories, showMealKcalPercent }: Props) {
    // Calculate overall totals
    const overallTotals: Partial<Record<keyof NutritionalFields, number>> = {}
    fields.forEach((f) => (overallTotals[f] = 0))
    let overallKcalForPercent = 0

    return (
        <View style={styles.tableContainer} wrap={false}>
            {/* Header */}
            <View style={styles.row}>
                <View
                    style={[
                        styles.cell,
                        styles.headerCell,
                        { width: MEAL_COL_WIDTH, minWidth: MEAL_COL_WIDTH },
                    ]}
                >
                    <Text style={styles.headerText}>Meal</Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.headerCell,
                        { width: RECIPE_COL_WIDTH, minWidth: RECIPE_COL_WIDTH },
                    ]}
                >
                    <Text style={styles.headerText}>Recipe</Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.headerCell,
                        { width: INGREDIENT_COL_WIDTH, minWidth: INGREDIENT_COL_WIDTH },
                    ]}
                >
                    <Text style={styles.headerText}>Ingredient</Text>
                </View>
                {fields.map((f, idx) => {
                    const cols = []
                    cols.push(
                        <View
                            key={f}
                            style={[
                                styles.cell,
                                styles.headerCell,
                                { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                            ]}
                        >
                            <Text style={styles.headerText}>
                                {formatFieldName(f)}
                            </Text>
                        </View>
                    )
                    if (showMealKcalPercent && idx === 0) {
                        cols.push(
                            <View
                                key="meal-kcal-pct-header"
                                style={[
                                    styles.cell,
                                    styles.headerCell,
                                    { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                                ]}
                            >
                                <Text style={styles.headerText}>
                                    Meal Kcal %
                                </Text>
                            </View>
                        )
                    }
                    return cols
                })}
            </View>

            {/* Body */}
            {meals.map((meal) => {
                const mealTotals: Partial<
                    Record<keyof NutritionalFields, number>
                > = {}
                fields.forEach((f) => (mealTotals[f] = 0))
                let mealKcalTotal = 0

                const mealRows = meal.Recipes.flatMap(
                    (recipe, recipeIndex) => {
                        return recipe.Ingredients.map(
                            (ingredient, ingredientIndex) => {
                                fields.forEach((field) => {
                                    const contribution =
                                        calculateFieldContribution(
                                            ingredient,
                                            field,
                                        )

                                    mealTotals[field] =
                                        (mealTotals[field] ?? 0) + contribution
                                    overallTotals[field] =
                                        (overallTotals[field] ?? 0) +
                                        contribution
                                })

                                const ingredientKcal = ((ingredient.Kcal ?? 0) * (ingredient.Amount ?? 0)) / 100
                                mealKcalTotal += ingredientKcal
                                overallKcalForPercent += ingredientKcal

                                const isFirstInMeal =
                                    recipeIndex === 0 && ingredientIndex === 0
                                const isFirstInRecipe = ingredientIndex === 0

                                return (
                                    <View
                                        style={styles.row}
                                        key={`${meal.Name}-${recipe.Name}-${ingredient?.Name}-${ingredientIndex}`}
                                    >
                                        <View
                                            style={[
                                                styles.cell,
                                                isFirstInMeal ? styles.mealCell : {},
                                                { width: MEAL_COL_WIDTH, minWidth: MEAL_COL_WIDTH },
                                            ]}
                                        >
                                            <Text>{isFirstInMeal ? meal.Name : ""}</Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.cell,
                                                isFirstInRecipe ? styles.recipeCell : {},
                                                { width: RECIPE_COL_WIDTH, minWidth: RECIPE_COL_WIDTH },
                                            ]}
                                        >
                                            <Text>
                                                {isFirstInRecipe
                                                    ? (recipe.Name || "Unnamed Recipe")
                                                    : ""}
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.cell,
                                                { width: INGREDIENT_COL_WIDTH, minWidth: INGREDIENT_COL_WIDTH },
                                            ]}
                                        >
                                            <Text>
                                                {ingredient.Name || "-"}
                                            </Text>
                                        </View>

                                        {fields.map((f, idx) => {
                                            const displayValue =
                                                formatFieldValue(ingredient, f)

                                            const cols = []
                                            cols.push(
                                                <View
                                                    key={f}
                                                    style={[
                                                        styles.cell,
                                                        styles.rightAlign,
                                                        {
                                                            width: FIELD_COL_WIDTH,
                                                            minWidth: FIELD_COL_WIDTH,
                                                        },
                                                    ]}
                                                >
                                                    <Text>{displayValue}</Text>
                                                </View>
                                            )
                                            if (showMealKcalPercent && idx === 0) {
                                                cols.push(
                                                    <View
                                                        key="meal-kcal-pct"
                                                        style={[
                                                            styles.cell,
                                                            styles.rightAlign,
                                                            {
                                                                width: FIELD_COL_WIDTH,
                                                                minWidth: FIELD_COL_WIDTH,
                                                            },
                                                        ]}
                                                    >
                                                        <Text>
                                                            {calculateMealKcalPercent(ingredient, planCalories)}
                                                        </Text>
                                                    </View>
                                                )
                                            }
                                            return cols
                                        })}
                                    </View>
                                )
                            },
                        )
                    },
                )

                // Custom Additions row
                let customAdditionRow = null
                if (meal.CustomAdditions && meal.CustomAdditions.length > 0) {
                    meal.CustomAdditions.forEach((addition) => {
                        const key = addition.field as keyof NutritionalFields
                        if (fields.includes(key)) {
                            mealTotals[key] = (mealTotals[key] ?? 0) + addition.value
                            overallTotals[key] = (overallTotals[key] ?? 0) + addition.value
                        }
                    })

                    const additionsLabel = meal.CustomAdditions.map(
                        (a) => `${formatFieldName(a.field)}: ${a.value >= 0 ? "+" : ""}${a.value}`
                    ).join(", ")

                    customAdditionRow = (
                        <View
                            style={[styles.row, styles.customAdditionRow]}
                            key={`${meal.Name}-custom`}
                        >
                            <View
                                style={[
                                    styles.cell,
                                    { width: MEAL_COL_WIDTH, minWidth: MEAL_COL_WIDTH },
                                ]}
                            >
                                <Text></Text>
                            </View>
                            <View
                                style={[
                                    styles.cell,
                                    { width: RECIPE_COL_WIDTH, minWidth: RECIPE_COL_WIDTH },
                                ]}
                            >
                                <Text>Custom</Text>
                            </View>
                            <View
                                style={[
                                    styles.cell,
                                    { width: INGREDIENT_COL_WIDTH, minWidth: INGREDIENT_COL_WIDTH, fontSize: 7 },
                                ]}
                            >
                                <Text>{additionsLabel}</Text>
                            </View>
                            {fields.map((f, idx) => {
                                const addition = meal.CustomAdditions?.find((a) => a.field === f)
                                const cols = []
                                cols.push(
                                    <View
                                        key={`${meal.Name}-custom-${f}`}
                                        style={[
                                            styles.cell,
                                            styles.rightAlign,
                                            { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                                        ]}
                                    >
                                        <Text>
                                            {addition
                                                ? `${addition.value >= 0 ? "+" : ""}${addition.value}`
                                                : ""}
                                        </Text>
                                    </View>
                                )
                                if (showMealKcalPercent && idx === 0) {
                                    cols.push(
                                        <View
                                            key={`${meal.Name}-custom-kcal-pct`}
                                            style={[
                                                styles.cell,
                                                styles.rightAlign,
                                                { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                                            ]}
                                        >
                                            <Text></Text>
                                        </View>
                                    )
                                }
                                return cols
                            })}
                        </View>
                    )
                }

                // Meal total row
                const mealTotalRow = (
                    <View
                        style={[styles.row, styles.mealTotalRow]}
                        key={`${meal.Name}-total`}
                    >
                        <View
                            style={[
                                styles.cell,
                                styles.totalCell,
                                { width: MEAL_COL_WIDTH, minWidth: MEAL_COL_WIDTH },
                            ]}
                        >
                            <Text>Total ({meal.Name})</Text>
                        </View>
                        <View
                            style={[styles.cell, { width: RECIPE_COL_WIDTH, minWidth: RECIPE_COL_WIDTH }]}
                        >
                            <Text></Text>
                        </View>
                        <View
                            style={[styles.cell, { width: INGREDIENT_COL_WIDTH, minWidth: INGREDIENT_COL_WIDTH }]}
                        >
                            <Text></Text>
                        </View>
                        {fields.map((f, idx) => {
                            const cols = []
                            cols.push(
                                <View
                                    key={`${meal.Name}-${f}-total`}
                                    style={[
                                        styles.cell,
                                        styles.totalCell,
                                        styles.rightAlign,
                                        { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                                    ]}
                                >
                                    <Text>
                                        {isRawField(f)
                                            ? (mealTotals[f] ?? 0)
                                            : (mealTotals[f] ?? 0).toFixed(2)}
                                    </Text>
                                </View>
                            )
                            if (showMealKcalPercent && idx === 0) {
                                cols.push(
                                    <View
                                        key={`${meal.Name}-kcal-pct-total`}
                                        style={[
                                            styles.cell,
                                            styles.totalCell,
                                            styles.rightAlign,
                                            { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                                        ]}
                                    >
                                        <Text>
                                            {planCalories > 0 && mealKcalTotal > 0
                                                ? ((mealKcalTotal / planCalories) * 100).toFixed(2) + "%"
                                                : "-"}
                                        </Text>
                                    </View>
                                )
                            }
                            return cols
                        })}
                    </View>
                )

                return [mealRows, customAdditionRow, mealTotalRow]
            })}

            {/* Overall Total Row */}
            <View style={[styles.row, styles.overallTotalRow]}>
                <View
                    style={[
                        styles.cell,
                        styles.totalCell,
                        { width: MEAL_COL_WIDTH, minWidth: MEAL_COL_WIDTH },
                    ]}
                >
                    <Text>Total (All Meals)</Text>
                </View>
                <View style={[styles.cell, { width: RECIPE_COL_WIDTH, minWidth: RECIPE_COL_WIDTH }]}>
                    <Text></Text>
                </View>
                <View style={[styles.cell, { width: INGREDIENT_COL_WIDTH, minWidth: INGREDIENT_COL_WIDTH }]}>
                    <Text></Text>
                </View>
                {fields.map((f, idx) => {
                    const cols = []
                    cols.push(
                        <View
                            key={`overall-${f}`}
                            style={[
                                styles.cell,
                                styles.totalCell,
                                styles.rightAlign,
                                { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                            ]}
                        >
                            <Text>
                                {isRawField(f)
                                    ? (overallTotals[f] ?? 0)
                                    : (overallTotals[f] ?? 0).toFixed(2)}
                            </Text>
                        </View>
                    )
                    if (showMealKcalPercent && idx === 0) {
                        cols.push(
                            <View
                                key="overall-kcal-pct"
                                style={[
                                    styles.cell,
                                    styles.totalCell,
                                    styles.rightAlign,
                                    { width: FIELD_COL_WIDTH, minWidth: FIELD_COL_WIDTH },
                                ]}
                            >
                                <Text>
                                    {planCalories > 0 && overallKcalForPercent > 0
                                        ? ((overallKcalForPercent / planCalories) * 100).toFixed(2) + "%"
                                        : "-"}
                                </Text>
                            </View>
                        )
                    }
                    return cols
                })}
            </View>
        </View>
    )
}
