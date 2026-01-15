/* eslint-disable @typescript-eslint/no-explicit-any */

// Types for API responses from Strapi

export type MenuOption = {
    icon: React.ReactNode
    title: string
    path: string
    suboptions?: MenuOption[]
}

export type NutritionalFields = {
    Amount?: number
    Ashes?: number
    Atherogenic_index?: number
    Carbohydrates_fructose?: number
    Carbohydrates_glucose?: number
    Carbohydrates_isomaltulose?: number
    Carbohydrates_lactose?: number
    Carbohydrates_maltose?: number
    Carbohydrates_mono?: number
    Carbohydrates_Noncaloric_Carbohydrates?: number
    Carbohydrates_Organic_Acids?: number
    Carbohydrates_poli?: number
    Carbohydrates_Polyols?: number
    Carbohydrates_sucrose?: number
    Carbohydrates_total?: number
    Carotenoids?: number
    Cellulose?: number
    Cholesterol?: number
    Fat_aa?: number
    Fat_ala?: number
    Fat_Arachidonic_Acid?: number
    Fat_dha?: number
    Fat_epa?: number
    Fat_la?: number
    Fat_mct?: number
    Fat_saturated?: number
    Fat_total?: number
    Fat_unsaturated?: number
    Fatty_Acids_C10?: number
    Fatty_Acids_C12?: number
    Fatty_Acids_C14?: number
    Fatty_Acids_C6?: number
    Fatty_Acids_C8?: number
    Fiber_Fructooligosaccharides?: number
    Fiber_Galactooligosaccharides?: number
    Fiber_Insoluble?: number
    Fiber_Soluble?: number
    Fiber_total?: number
    Glycemic_index?: number
    Kcal?: number
    MCT_TCM_ratio?: number
    Mineral_Ca?: number
    Mineral_Cl?: number
    Mineral_Cr?: number
    Mineral_Cu?: number
    Mineral_F?: number
    Mineral_Fe?: number
    Mineral_Jod?: number
    Mineral_K?: number
    Mineral_Mg?: number
    Mineral_Mn?: number
    Mineral_Mo?: number
    Mineral_Na?: number
    Mineral_P?: number
    Mineral_S?: number
    Mineral_Se?: number
    Mineral_Zn?: number
    Nucleotides?: number
    Omega3_Omega6_ratio?: number
    Osmolality?: number
    Osmolarity?: number
    Phosphates?: number
    Protein_animal?: number
    Protein_Carnitine?: number
    Protein_Casein?: number
    Protein_Essential_Amino_Acids?: number
    Protein_L_Arginin?: number
    Protein_L_Leucin?: number
    Protein_plant?: number
    Protein_taurine?: number
    Protein_total?: number
    Protein_Whey?: number
    Sugars?: number
    Vitamin_A?: number
    Vitamin_B1?: number
    Vitamin_B12?: number
    Vitamin_B2?: number
    Vitamin_B3?: number
    Vitamin_B4_Holin?: number
    Vitamin_B5?: number
    Vitamin_B6?: number
    Vitamin_B7?: number
    Vitamin_B8_Inositol?: number
    Vitamin_B9_Folic_Acid?: number
    Vitamin_C?: number
    Vitamin_D?: number
    Vitamin_E?: number
    Vitamin_K?: number
    Vitamin_PP?: number
    Vitamin_RE?: number
    Volume_per_Unit?: number
    Water?: number
}

export type Meal = {
    Name: string
    Recipes: Recipe[]
    Glycemic_load?: number
} & NutritionalFields

// Blog
export interface Blog {
    id: number
    Naslov: string
    Tekst: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

// Category Types
export interface CategoryCondition {
    id: number
    Name: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface CategoryCuisineType {
    id: number
    Name: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface CategoryDietetic {
    id: number
    Name: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface CategoryFoodGroup {
    id: number
    Name: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface CategoryMacroNutrient {
    id: number
    Name: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

export interface CategoryMealCourse {
    id: number
    Name: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

// Dietetic
export interface Dietetic {
    id: number
    Title: string
    Text: string
    category_dietetics: CategoryDietetic[]
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

// Ingredient
export type Ingredient = {
    Name?: string
    Code?: string
    Ingredient_Image?: any
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    locale?: string
    localizations?: any
    createdBy?: any
    updatedBy?: any
} & NutritionalFields

// Media
export interface Media {
    id: number
    url: string
    name: string
    mime: string
    size: number
}

// Category (generic, used in some Recipe categories)
export interface Category {
    id: number
    Name: string
}

// Recipe
export interface Recipe {
    id?: number
    Name: string
    Code: string
    Ingredients: Ingredient[] // Simplified here: just Ingredient[]
    Short_description?: string
    Preparation?: string
    Image?: Media | null
    category_meal_courses?: Category[]
    category_macro_nutrients?: Category[]
    category_food_groups?: Category[]
    category_cuisine_types?: Category[]
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    TotalKcal?: number
    TotalProtein?: number
    TotalFat?: number
    TotalCarbohydrates?: number
    TotalGlycemicLoad?: number
}

// MedicalFoodRecipe
export interface MedicalFoodRecipe {
    id: number
    Name: string
    Code: string
    Ingredients: Ingredient[] // Ingredients simplified here as well
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

// MenuRecipe
export interface MenuRecipe {
    id?: number
    Recipe: Recipe // Use Recipe type directly here
    ServingSize?: number
    Notes?: string
}

// MedicalFoodMenu
export interface MedicalFoodMenu {
    id: number
    Name: string
    Recipes: Recipe[] // Simplified to Recipe[] instead of MenuRecipe[]
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

// Screening Tool Types
export type ScreeningOption = {
    label: string
    value: string | number
    description?: string
    details?: string[]
}

export type ScreeningQuestion = {
    id: string
    title: string
    options: ScreeningOption[]
    section?: string
}

export type ScreeningConfig = {
    name: string
    questions: ScreeningQuestion[]
    evaluateScore: (selections: Record<string, string | number>) => {
        score: number
        interpretation: string
        riskLevel: string
    }
}

export type CalculatorField = {
    id: string
    label: string
    type: "number" | "select" | "text"
    unit?: string
    options?: { label: string; value: string | number }[]
    required?: boolean
    min?: number
    max?: number
}

export type CalculatorResult = {
    value: number
    unit: string
    interpretation: string
    category?: string
}

export type CalculatorConfig = {
    id: string
    name: string
    description: string
    fields: CalculatorField[]
    calculate: (inputs: Record<string, string | number>) => CalculatorResult
}
