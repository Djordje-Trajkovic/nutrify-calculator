import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { Meal, NutritionalFields } from "../../utils/types";

type Props = {
  meals: Meal[];
  fields: (keyof NutritionalFields)[];
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 2,
    fontSize: 8,
  },
  mealCell: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  recipeCell: {
    fontWeight: "semibold",
    backgroundColor: "#e0e0e0",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#dcdcdc",
  },
});

export default function PDFMealTable({ meals, fields }: Props) {
  return (
    <View wrap={false}>
      {/* Header */}
      <View style={styles.row}>
        <View style={[styles.cell, styles.headerCell, { width: 60 }]}>
          <Text>Meal</Text>
        </View>
        <View style={[styles.cell, styles.headerCell, { width: 60 }]}>
          <Text>Recipe</Text>
        </View>
        <View style={[styles.cell, styles.headerCell, { width: 60 }]}>
          <Text>Ingredient</Text>
        </View>
        {fields.map((f) => (
          <View key={f} style={[styles.cell, styles.headerCell, { width: 40 }]}>
            <Text>{f}</Text>
          </View>
        ))}
      </View>

      {/* Body */}
      {meals.map((meal) => {
        // const mealRowSpan = meal.Recipes.reduce(
        //   (sum, r) => sum + r.Ingredients.length,
        //   0
        // );

        return meal.Recipes.map((recipe, recipeIndex) => {
          // const recipeRowSpan = recipe.Ingredients.length;

          return recipe.Ingredients.map((ingredient, ingredientIndex) => (
            <View style={styles.row} key={`${meal.Name}-${recipe.Name}-${ingredient?.Name}`}>
              {/* Meal */}
              {recipeIndex === 0 && ingredientIndex === 0 && (
                <View
                  style={[styles.cell, styles.mealCell, { width: 60 }]}
                  wrap={false}
                >
                  <Text>{meal.Name}</Text>
                </View>
              )}

              {/* Recipe */}
              {ingredientIndex === 0 && (
                <View
                  style={[styles.cell, styles.recipeCell, { width: 60 }]}
                  wrap={false}
                >
                  <Text>{recipe.Name || "Unnamed Recipe"}</Text>
                </View>
              )}

              {/* Ingredient */}
              <View style={[styles.cell, { width: 60 }]}>
                <Text>{ingredient.Name || "-"}</Text>
              </View>

              {/* Fields */}
              {fields.map((f) => (
                <View style={[styles.cell, { width: 40 }]} key={f}>
                  <Text>{ingredient[f] ?? ""}</Text>
                </View>
              ))}
            </View>
          ));
        });
      })}
    </View>
  );
}
