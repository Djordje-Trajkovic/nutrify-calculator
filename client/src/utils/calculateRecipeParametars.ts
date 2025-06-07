import { Recipe } from "./types"

export const calculatreRecipeParametars = (recipe: Recipe) => {
    return recipe?.Ingredients?.reduce(
        (acc, ing) => {
            const usedAmount = ing.Amount ?? 0
            const referenceAmount = 100

            acc.kcal += (ing.Kcal ?? 0) * (usedAmount / referenceAmount)
            acc.protein +=
                (ing.Protein_total ?? 0) * (usedAmount / referenceAmount)
            acc.fat += (ing.Fat_total ?? 0) * (usedAmount / referenceAmount)
            acc.carbohydrates +=
                (ing.Carbohydrates_total ?? 0) * (usedAmount / referenceAmount)

            if (ing.Glycemic_index != null) {
                acc.glycemicLoad +=
                    (ing.Glycemic_index *
                        (ing.Carbohydrates_total ?? 0) *
                        usedAmount) /
                    10000
            }

            return acc
        },
        {
            kcal: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            glycemicLoad: 0,
        },
    )
}
