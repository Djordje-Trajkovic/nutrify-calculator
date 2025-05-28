export type MenuOption = {
    icon: React.ReactNode
    title: string
    path: string
}

export type Meal = {
    name: string
    recipes: Recipe[]
    kcal: number
    protein: number
    fat: number
    carbohydrates: number
    glycemicLoad: number
}

export type Recipe = {
    Name: string
    Ingredients: Ingredient[]
    kcal: number
    protein: number
    fat: number
    carbohydrates: number
    glycemicLoad: number
    preparation?: string
}

export type Ingredient = {
    Name: string
    Code: string
    Amount?: number
    Kcal?: number
    Protein_plant?: number
    Protein_animal?: number
    Protein_total?: number
    Fat_saturated?: number
    Fat_unsaturated?: number
    Fat_total?: number
    Cholesterol?: number
    Carbohydrates_mono?: number
    Carbohydrates_poli?: number
    Carbohydrates_total?: number
    Ashes?: number
    Cellulose?: number
    Mineral_Na?: number
    Mineral_K?: number
    Mineral_Ca?: number
    Mineral_Mg?: number
    Mineral_P?: number
    Mineral_Fe?: number
    Mineral_Zn?: number
    Mineral_Cu?: number
    Vitamin_RE?: number
    Vitamin_B1?: number
    Vitamin_B2?: number
    Vitamin_B6?: number
    Vitamin_PP?: number
    Vitamin_C?: number
    Vitamin_E?: number
    Glycemic_index?: number
    Glycemic_load?: number
    Atherogenic_index?: number
}
