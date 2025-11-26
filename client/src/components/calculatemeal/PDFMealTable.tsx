import { View, Text, StyleSheet } from "@react-pdf/renderer"
import { Ingredient, Meal, NutritionalFields } from "../../utils/types"

type Props = {
    meals: Meal[]
    fields: (keyof NutritionalFields)[]
}

// Calculate dynamic column width based on number of fields
const getFieldWidth = (numFields: number) => {
    // Total available width approximately 500 points (A4 page minus margins)
    const availableWidth = 400
    const fieldWidth = Math.max(35, availableWidth / numFields)
    return fieldWidth
}

const styles = StyleSheet.create({
    tableContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#cbd5e0",
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e0",
    },
    cell: {
        borderRightWidth: 1,
        borderRightColor: "#cbd5e0",
        padding: 3,
        fontSize: 7,
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
        fontSize: 6,
    },
    mealTotalRow: {
        backgroundColor: "#edf2f7",
    },
    overallTotalRow: {
        backgroundColor: "#e2e8f0",
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

export default function PDFMealTable({ meals, fields }: Props) {
    const fieldWidth = getFieldWidth(fields.length)

    // Calculate overall totals
    const overallTotals: Partial<Record<keyof NutritionalFields, number>> = {}
    fields.forEach((f) => (overallTotals[f] = 0))

    return (
        <View style={styles.tableContainer} wrap={false}>
            {/* Header */}
            <View style={styles.row}>
                <View
                    style={[
                        styles.cell,
                        styles.headerCell,
                        { width: 50, minWidth: 50 },
                    ]}
                >
                    <Text style={styles.headerText}>Meal</Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.headerCell,
                        { width: 50, minWidth: 50 },
                    ]}
                >
                    <Text style={styles.headerText}>Recipe</Text>
                </View>
                <View
                    style={[
                        styles.cell,
                        styles.headerCell,
                        { width: 60, minWidth: 60 },
                    ]}
                >
                    <Text style={styles.headerText}>Ingredient</Text>
                </View>
                {fields.map((f) => (
                    <View
                        key={f}
                        style={[
                            styles.cell,
                            styles.headerCell,
                            { width: fieldWidth, minWidth: fieldWidth },
                        ]}
                    >
                        <Text style={styles.headerText}>
                            {formatFieldName(f)}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Body */}
            {meals.map((meal) => {
                const mealTotals: Partial<
                    Record<keyof NutritionalFields, number>
                > = {}
                fields.forEach((f) => (mealTotals[f] = 0))

                const mealRows = meal.Recipes.flatMap(
                    (recipe, recipeIndex) => {
                        return recipe.Ingredients.map(
                            (ingredient, ingredientIndex) => {
                                // Calculate contributions for this ingredient
                                fields.forEach((field) => {
                                    const val = (ingredient as Ingredient)[
                                        field
                                    ] as number | undefined
                                    const contribution =
                                        val == null
                                            ? 0
                                            : isRawField(field)
                                              ? val
                                              : (val *
                                                    ((ingredient.Amount ?? 0) /
                                                        100)) ||
                                                0

                                    mealTotals[field] =
                                        (mealTotals[field] ?? 0) + contribution
                                    overallTotals[field] =
                                        (overallTotals[field] ?? 0) +
                                        contribution
                                })

                                const isFirstInMeal =
                                    recipeIndex === 0 && ingredientIndex === 0
                                const isFirstInRecipe = ingredientIndex === 0

                                return (
                                    <View
                                        style={styles.row}
                                        key={`${meal.Name}-${recipe.Name}-${ingredient?.Name}-${ingredientIndex}`}
                                    >
                                        {/* Meal Cell */}
                                        {isFirstInMeal && (
                                            <View
                                                style={[
                                                    styles.cell,
                                                    styles.mealCell,
                                                    { width: 50, minWidth: 50 },
                                                ]}
                                            >
                                                <Text>{meal.Name}</Text>
                                            </View>
                                        )}
                                        {!isFirstInMeal && (
                                            <View
                                                style={[
                                                    styles.cell,
                                                    { width: 50, minWidth: 50 },
                                                ]}
                                            >
                                                <Text></Text>
                                            </View>
                                        )}

                                        {/* Recipe Cell */}
                                        {isFirstInRecipe && (
                                            <View
                                                style={[
                                                    styles.cell,
                                                    styles.recipeCell,
                                                    { width: 50, minWidth: 50 },
                                                ]}
                                            >
                                                <Text>
                                                    {recipe.Name ||
                                                        "Unnamed Recipe"}
                                                </Text>
                                            </View>
                                        )}
                                        {!isFirstInRecipe && (
                                            <View
                                                style={[
                                                    styles.cell,
                                                    { width: 50, minWidth: 50 },
                                                ]}
                                            >
                                                <Text></Text>
                                            </View>
                                        )}

                                        {/* Ingredient Cell */}
                                        <View
                                            style={[
                                                styles.cell,
                                                { width: 60, minWidth: 60 },
                                            ]}
                                        >
                                            <Text>
                                                {ingredient.Name || "-"}
                                            </Text>
                                        </View>

                                        {/* Field Cells */}
                                        {fields.map((f) => {
                                            const val = (
                                                ingredient as Ingredient
                                            )[f] as number | undefined
                                            let displayValue = ""
                                            if (val != null) {
                                                if (isRawField(f)) {
                                                    displayValue = val.toString()
                                                } else {
                                                    const amt =
                                                        ingredient.Amount ?? 0
                                                    displayValue = (
                                                        val *
                                                        (amt / 100)
                                                    ).toFixed(2)
                                                }
                                            }

                                            return (
                                                <View
                                                    key={f}
                                                    style={[
                                                        styles.cell,
                                                        styles.rightAlign,
                                                        {
                                                            width: fieldWidth,
                                                            minWidth: fieldWidth,
                                                        },
                                                    ]}
                                                >
                                                    <Text>{displayValue}</Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                )
                            },
                        )
                    },
                )

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
                                { width: 50, minWidth: 50 },
                            ]}
                        >
                            <Text>Total ({meal.Name})</Text>
                        </View>
                        <View
                            style={[styles.cell, { width: 50, minWidth: 50 }]}
                        >
                            <Text></Text>
                        </View>
                        <View
                            style={[styles.cell, { width: 60, minWidth: 60 }]}
                        >
                            <Text></Text>
                        </View>
                        {fields.map((f) => (
                            <View
                                key={`${meal.Name}-${f}-total`}
                                style={[
                                    styles.cell,
                                    styles.totalCell,
                                    styles.rightAlign,
                                    { width: fieldWidth, minWidth: fieldWidth },
                                ]}
                            >
                                <Text>
                                    {isRawField(f)
                                        ? (mealTotals[f] ?? 0)
                                        : (mealTotals[f] ?? 0).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )

                return [mealRows, mealTotalRow]
            })}

            {/* Overall Total Row */}
            <View style={[styles.row, styles.overallTotalRow]}>
                <View
                    style={[
                        styles.cell,
                        styles.totalCell,
                        { width: 50, minWidth: 50 },
                    ]}
                >
                    <Text>Total (All Meals)</Text>
                </View>
                <View style={[styles.cell, { width: 50, minWidth: 50 }]}>
                    <Text></Text>
                </View>
                <View style={[styles.cell, { width: 60, minWidth: 60 }]}>
                    <Text></Text>
                </View>
                {fields.map((f) => (
                    <View
                        key={`overall-${f}`}
                        style={[
                            styles.cell,
                            styles.totalCell,
                            styles.rightAlign,
                            { width: fieldWidth, minWidth: fieldWidth },
                        ]}
                    >
                        <Text>
                            {isRawField(f)
                                ? (overallTotals[f] ?? 0)
                                : (overallTotals[f] ?? 0).toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    )
}
