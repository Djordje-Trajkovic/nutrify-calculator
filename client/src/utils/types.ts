/* eslint-disable @typescript-eslint/no-explicit-any */

// Types for API responses from Strapi

export type MenuOption = {
    icon: React.ReactNode
    title: string
    path: string
}

export type Meal = {
    Name: string
    Recipes: Recipe[]
    Kcal: number
    Protein_total: number
    Protein_plant: number
    Protein_animal: number
    Fat_total: number
    Fat_saturated: number
    Fat_unsaturated: number
    Carbohydrates_total: number
    Carbohydrates_mono: number
    Carbohydrates_poli: number
    Cholesterol: number
    Ashes: number
    Cellulose: number
    Mineral_Na: number
    Mineral_K: number
    Mineral_Ca: number
    Mineral_Mg: number
    Mineral_P: number
    Mineral_Fe: number
    Mineral_Zn: number
    Mineral_Cu: number
    Vitamin_RE: number
    Vitamin_B1: number
    Vitamin_B2: number
    Vitamin_B6: number
    Vitamin_PP: number
    Vitamin_C: number
    Vitamin_E: number
    Glycemic_index: number
    Atherogenic_index: number
}

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
export interface Ingredient {
    id?: number
    Name?: string
    Code?: string
    Amount?: number
    Water?: number
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
    Atherogenic_index?: number
    Fiber?: number
    Volume_per_Unit?: number
    Ingredient_Image?: {
        id: number
        url: string
        name: string
        mime: string
        size: number
    } | null
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

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
