/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Blog,
    CategoryCondition,
    CategoryCuisineType,
    CategoryDietetic,
    CategoryFoodGroup,
    CategoryMacroNutrient,
    CategoryMealCourse,
    Dietetic,
    Ingredient,
    Recipe,
    MedicalFoodRecipe,
    MedicalFoodMenu,
} from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const BLOGS_ENDPOINT = `${BASE_URL}/blogs`
const CATEGORY_CONDITION_ENDPOINT = `${BASE_URL}/category-conditions`
const CATEGORY_CUISINE_TYPE_ENDPOINT = `${BASE_URL}/category-cuisine-types`
const CATEGORY_DIETETIC_ENDPOINT = `${BASE_URL}/category-dietetics`
const CATEGORY_FOOD_GROUP_ENDPOINT = `${BASE_URL}/category-food-groups`
const CATEGORY_MACRO_NUTRIENT_ENDPOINT = `${BASE_URL}/category-macro-nutrients`
const CATEGORY_MEAL_COURSE_ENDPOINT = `${BASE_URL}/category-meal-courses`
const DIETETICS_ENDPOINT = `${BASE_URL}/dietetics`
const INGREDIENTS_ENDPOINT = `${BASE_URL}/ingredients`
const RECIPE_ENDPOINT = `${BASE_URL}/recipes`
const MFR_ENDPOINT = `${BASE_URL}/medical-food-recipes`
const MFM_ENDPOINT = `${BASE_URL}/medical-food-menus`

// Headers
const getHeaders = () => ({
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${yourToken}`
})

// Flatten helpers
function flattenStrapiData<T>(entry: {
    id: number
    attributes: T
}): T & { id: number } {
    return { id: entry.id, ...entry.attributes }
}

function flattenRelationArray<T>(
    relations: { id: number; attributes: T }[],
): (T & { id: number })[] {
    return relations.map(flattenStrapiData)
}

function flattenMedia(media: any) {
    if (!media) return null
    if (media.data) media = media.data
    return {
        id: media.id,
        url: media.attributes.url,
        name: media.attributes.name,
        mime: media.attributes.mime,
        size: media.attributes.size,
    }
}

// BLOGS ENDPOINTS

// Get all blogs
export async function getAllBlogs(): Promise<{ data: Blog[]; meta?: any }> {
    const res = await fetch(BLOGS_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

// Get one blog by ID
export async function getBlogById(
    id: number,
): Promise<{ data: Blog | null; meta?: any }> {
    const res = await fetch(`${BLOGS_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

// Create a new blog
export async function createBlog(
    data: Omit<Blog, "id">,
): Promise<{ data: Blog; meta?: any }> {
    const res = await fetch(BLOGS_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// Update an existing blog
export async function updateBlog(
    id: number,
    data: Partial<Omit<Blog, "id">>,
): Promise<{ data: Blog; meta?: any }> {
    const res = await fetch(`${BLOGS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// Delete a blog
export async function deleteBlog(
    id: number,
): Promise<{ data: Blog; meta?: any }> {
    const res = await fetch(`${BLOGS_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// CATEGORY CONDITIONS

export async function getAllCategoryConditions(): Promise<{
    data: CategoryCondition[]
    meta?: any
}> {
    const res = await fetch(CATEGORY_CONDITION_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

export async function getCategoryConditionById(
    id: number,
): Promise<{ data: CategoryCondition | null; meta?: any }> {
    const res = await fetch(`${CATEGORY_CONDITION_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

export async function createCategoryCondition(
    data: Omit<CategoryCondition, "id">,
): Promise<{ data: CategoryCondition; meta?: any }> {
    const res = await fetch(CATEGORY_CONDITION_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function updateCategoryCondition(
    id: number,
    data: Partial<Omit<CategoryCondition, "id">>,
): Promise<{ data: CategoryCondition; meta?: any }> {
    const res = await fetch(`${CATEGORY_CONDITION_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function deleteCategoryCondition(
    id: number,
): Promise<{ data: CategoryCondition; meta?: any }> {
    const res = await fetch(`${CATEGORY_CONDITION_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// CATEGORY CUISINE TYPES

export async function getAllCategoryCuisineTypes(): Promise<{
    data: CategoryCuisineType[]
    meta?: any
}> {
    const res = await fetch(CATEGORY_CUISINE_TYPE_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

export async function getCategoryCuisineTypeById(
    id: number,
): Promise<{ data: CategoryCuisineType | null; meta?: any }> {
    const res = await fetch(`${CATEGORY_CUISINE_TYPE_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

export async function createCategoryCuisineType(
    data: Omit<CategoryCuisineType, "id">,
): Promise<{ data: CategoryCuisineType; meta?: any }> {
    const res = await fetch(CATEGORY_CUISINE_TYPE_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function updateCategoryCuisineType(
    id: number,
    data: Partial<Omit<CategoryCuisineType, "id">>,
): Promise<{ data: CategoryCuisineType; meta?: any }> {
    const res = await fetch(`${CATEGORY_CUISINE_TYPE_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function deleteCategoryCuisineType(
    id: number,
): Promise<{ data: CategoryCuisineType; meta?: any }> {
    const res = await fetch(`${CATEGORY_CUISINE_TYPE_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// CATEGORY DIETETICS

export async function getAllCategoryDietetics(): Promise<{
    data: CategoryDietetic[]
    meta?: any
}> {
    const res = await fetch(CATEGORY_DIETETIC_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

export async function getCategoryDieteticById(
    id: number,
): Promise<{ data: CategoryDietetic | null; meta?: any }> {
    const res = await fetch(`${CATEGORY_DIETETIC_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

export async function createCategoryDietetic(
    data: Omit<CategoryDietetic, "id">,
): Promise<{ data: CategoryDietetic; meta?: any }> {
    const res = await fetch(CATEGORY_DIETETIC_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function updateCategoryDietetic(
    id: number,
    data: Partial<Omit<CategoryDietetic, "id">>,
): Promise<{ data: CategoryDietetic; meta?: any }> {
    const res = await fetch(`${CATEGORY_DIETETIC_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function deleteCategoryDietetic(
    id: number,
): Promise<{ data: CategoryDietetic; meta?: any }> {
    const res = await fetch(`${CATEGORY_DIETETIC_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// CATEGORY FOOD GROUPS

export async function getAllCategoryFoodGroups(): Promise<{
    data: CategoryFoodGroup[]
    meta?: any
}> {
    const res = await fetch(CATEGORY_FOOD_GROUP_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

export async function getCategoryFoodGroupById(
    id: number,
): Promise<{ data: CategoryFoodGroup | null; meta?: any }> {
    const res = await fetch(`${CATEGORY_FOOD_GROUP_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

export async function createCategoryFoodGroup(
    data: Omit<CategoryFoodGroup, "id">,
): Promise<{ data: CategoryFoodGroup; meta?: any }> {
    const res = await fetch(CATEGORY_FOOD_GROUP_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function updateCategoryFoodGroup(
    id: number,
    data: Partial<Omit<CategoryFoodGroup, "id">>,
): Promise<{ data: CategoryFoodGroup; meta?: any }> {
    const res = await fetch(`${CATEGORY_FOOD_GROUP_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function deleteCategoryFoodGroup(
    id: number,
): Promise<{ data: CategoryFoodGroup; meta?: any }> {
    const res = await fetch(`${CATEGORY_FOOD_GROUP_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// CATEGORY MACRO NUTRIENTS

export async function getAllCategoryMacroNutrients(): Promise<{
    data: CategoryMacroNutrient[]
    meta?: any
}> {
    const res = await fetch(CATEGORY_MACRO_NUTRIENT_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

export async function getCategoryMacroNutrientById(
    id: number,
): Promise<{ data: CategoryMacroNutrient | null; meta?: any }> {
    const res = await fetch(`${CATEGORY_MACRO_NUTRIENT_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

export async function createCategoryMacroNutrient(
    data: Omit<CategoryMacroNutrient, "id">,
): Promise<{ data: CategoryMacroNutrient; meta?: any }> {
    const res = await fetch(CATEGORY_MACRO_NUTRIENT_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function updateCategoryMacroNutrient(
    id: number,
    data: Partial<Omit<CategoryMacroNutrient, "id">>,
): Promise<{ data: CategoryMacroNutrient; meta?: any }> {
    const res = await fetch(`${CATEGORY_MACRO_NUTRIENT_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function deleteCategoryMacroNutrient(
    id: number,
): Promise<{ data: CategoryMacroNutrient; meta?: any }> {
    const res = await fetch(`${CATEGORY_MACRO_NUTRIENT_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// CATEGORY MEAL COURSES

export async function getAllCategoryMealCourses(): Promise<{
    data: CategoryMealCourse[]
    meta?: any
}> {
    const res = await fetch(CATEGORY_MEAL_COURSE_ENDPOINT, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data.map(flattenStrapiData),
        meta: json.meta,
    }
}

export async function getCategoryMealCourseById(
    id: number,
): Promise<{ data: CategoryMealCourse | null; meta?: any }> {
    const res = await fetch(`${CATEGORY_MEAL_COURSE_ENDPOINT}/${id}`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: json.data ? flattenStrapiData(json.data) : null,
        meta: json.meta,
    }
}

export async function createCategoryMealCourse(
    data: Omit<CategoryMealCourse, "id">,
): Promise<{ data: CategoryMealCourse; meta?: any }> {
    const res = await fetch(CATEGORY_MEAL_COURSE_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function updateCategoryMealCourse(
    id: number,
    data: Partial<Omit<CategoryMealCourse, "id">>,
): Promise<{ data: CategoryMealCourse; meta?: any }> {
    const res = await fetch(`${CATEGORY_MEAL_COURSE_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

export async function deleteCategoryMealCourse(
    id: number,
): Promise<{ data: CategoryMealCourse; meta?: any }> {
    const res = await fetch(`${CATEGORY_MEAL_COURSE_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return {
        data: flattenStrapiData(json.data),
        meta: json.meta,
    }
}

// DIETETICS ENDPOINTS

// Get all dietetics with populated relations
export async function getAllDietetics(): Promise<Dietetic[]> {
    const res = await fetch(`${DIETETICS_ENDPOINT}?populate=*`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return json.data.map(flattenStrapiData)
}

// Get a single dietetic by ID with populated relations
export async function getDieteticById(id: number): Promise<Dietetic | null> {
    const res = await fetch(`${DIETETICS_ENDPOINT}/${id}?populate=*`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return json.data ? flattenStrapiData(json.data) : null
}

// Create a new dietetic
export async function createDietetic(
    data: Omit<Dietetic, "id"> & { category_dietetics: number[] },
): Promise<Dietetic> {
    const res = await fetch(`${DIETETICS_ENDPOINT}?populate=*`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return flattenStrapiData(json.data)
}

// Update a dietetic
export async function updateDietetic(
    id: number,
    data: Partial<Dietetic> & { category_dietetics?: number[] },
): Promise<Dietetic> {
    const res = await fetch(`${DIETETICS_ENDPOINT}/${id}?populate=*`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return flattenStrapiData(json.data)
}

// Delete a dietetic
export async function deleteDietetic(id: number): Promise<Dietetic> {
    const res = await fetch(`${DIETETICS_ENDPOINT}/${id}?populate=*`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return flattenStrapiData(json.data)
}

// INGREDIENTS ENDPOINTS

// Get all ingredients
export async function getAllIngredients(): Promise<Ingredient[]> {
    const res = await fetch(`${INGREDIENTS_ENDPOINT}?populate=*`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return json.data.map(flattenStrapiData)
}

// Get ingredient by ID
export async function getIngredientById(
    id: number,
): Promise<Ingredient | null> {
    const res = await fetch(`${INGREDIENTS_ENDPOINT}/${id}?populate=*`, {
        headers: getHeaders(),
    })
    const json = await res.json()
    return json.data ? flattenStrapiData(json.data) : null
}

// Create ingredient
export async function createIngredient(
    data: Partial<Omit<Ingredient, "id">>,
): Promise<Ingredient> {
    const res = await fetch(`${INGREDIENTS_ENDPOINT}?populate=*`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return flattenStrapiData(json.data)
}

// Update ingredient
export async function updateIngredient(
    id: number,
    data: Partial<Ingredient>,
): Promise<Ingredient> {
    const res = await fetch(`${INGREDIENTS_ENDPOINT}/${id}?populate=*`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ data }),
    })
    const json = await res.json()
    return flattenStrapiData(json.data)
}

// Delete ingredient
export async function deleteIngredient(id: number): Promise<Ingredient> {
    const res = await fetch(`${INGREDIENTS_ENDPOINT}/${id}?populate=*`, {
        method: "DELETE",
        headers: getHeaders(),
    })
    const json = await res.json()
    return flattenStrapiData(json.data)
}

// RECIPES ENDPOINTS

// Search recipes by name
export const searchRecipesByName = async (
    searchValue: string,
    token: string,
): Promise<Recipe[]> => {
    if (searchValue.length <= 2) return []

    const query = new URLSearchParams({
        "filters.Name[$containsi]": searchValue,
        "populate.Ingredients.populate": "ingredient",
    })

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/recipes?${query.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        },
    )

    const json = await response.json()
    const data = json.data ?? []

    const recipes: Recipe[] = data.map((item: any) => {
        const ingredients: Ingredient[] = (item.Ingredients || []).map(
            (ing: any) => {
                const ingData = ing.ingredient?.data || {}
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
                }
            },
        )

        // Calculate totals
        const totalKcal = ingredients.reduce(
            (sum, ing) => sum + (ing.Kcal ?? 0) * ((ing.Amount ?? 0) / 100),
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
                (ing.Carbohydrates_total ?? 0) * ((ing.Amount ?? 0) / 100),
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
            preparation: item.Preparation ?? undefined,
        }
    })

    return recipes
}

// Populating query (unchanged, but you can adjust if needed)
const POPULATERecipe = encodeURIComponent(`
  Ingredients.Ingredient,
  Image,
  category_meal_courses,
  category_macro_nutrients,
  category_food_groups,
  category_cuisine_types
`)

// Get recipe by ID
export async function getRecipeById(id: number): Promise<Recipe | null> {
    const res = await fetch(
        `${RECIPE_ENDPOINT}/${id}?populate=${POPULATERecipe}`,
    )
    const json = await res.json()

    if (!json.data) return null
    const data = json.data

    // Flatten relations
    const recipe: Recipe = {
        id: data.id,
        ...data, // now data fields are flat, so no .attributes
        Ingredients: (data.Ingredients || []).map((ri: any) => ({
            ...ri,
            Ingredient: ri.Ingredient
                ? {
                      id: ri.Ingredient.id,
                      ...ri.Ingredient,
                  }
                : null,
        })),
        category_meal_courses: flattenRelationArray(
            data.category_meal_courses?.data || [],
        ),
        category_macro_nutrients: flattenRelationArray(
            data.category_macro_nutrients?.data || [],
        ),
        category_food_groups: flattenRelationArray(
            data.category_food_groups?.data || [],
        ),
        category_cuisine_types: flattenRelationArray(
            data.category_cuisine_types?.data || [],
        ),
        Image: flattenMedia(data.Image?.data),
    }

    return recipe
}

// Get all recipes
export async function getAllRecipes(): Promise<Recipe[]> {
    const res = await fetch(`${RECIPE_ENDPOINT}?populate=${POPULATERecipe}`)
    const json = await res.json()

    return (json.data || []).map((data: any) => ({
        id: data.id,
        ...data,
        Ingredients: (data.Ingredients || []).map((ri: any) => ({
            ...ri,
            Ingredient: ri.Ingredient
                ? {
                      id: ri.Ingredient.id,
                      ...ri.Ingredient,
                  }
                : null,
        })),
        category_meal_courses: flattenRelationArray(
            data.category_meal_courses?.data || [],
        ),
        category_macro_nutrients: flattenRelationArray(
            data.category_macro_nutrients?.data || [],
        ),
        category_food_groups: flattenRelationArray(
            data.category_food_groups?.data || [],
        ),
        category_cuisine_types: flattenRelationArray(
            data.category_cuisine_types?.data || [],
        ),
        Image: flattenMedia(data.Image?.data),
    }))
}

// MEDICAL FOOD RECIPES ENDPOINTS

const POPULATEMD = encodeURIComponent(`Ingredients.Ingredient`)

export async function getMedicalFoodRecipeById(
    id: number,
): Promise<MedicalFoodRecipe | null> {
    const res = await fetch(`${MFR_ENDPOINT}/${id}?populate=${POPULATEMD}`)
    if (!res.ok) return null

    const json = await res.json()

    if (!json.data) return null

    const data = json.data

    // Flatten attributes into the top-level object to match your MedicalFoodRecipe interface
    return {
        id: data.id,
        Name: data.attributes.Name,
        Code: data.attributes.Code,
        Ingredients: (data.attributes.Ingredients || []).map((ri: any) => ({
            ...ri,
            Ingredient: ri.Ingredient
                ? {
                      id: ri.Ingredient.id,
                      ...ri.Ingredient.attributes,
                  }
                : null,
        })),
        createdAt: data.attributes.createdAt,
        updatedAt: data.attributes.updatedAt,
        publishedAt: data.attributes.publishedAt,
    }
}

export async function getAllMedicalFoodRecipes(): Promise<MedicalFoodRecipe[]> {
    const res = await fetch(`${MFR_ENDPOINT}?populate=${POPULATEMD}`)
    if (!res.ok) return []

    const json = await res.json()

    return (json.data || []).map((data: any) => ({
        id: data.id,
        Name: data.attributes.Name,
        Code: data.attributes.Code,
        Ingredients: (data.attributes.Ingredients || []).map((ri: any) => ({
            ...ri,
            Ingredient: ri.Ingredient
                ? {
                      id: ri.Ingredient.id,
                      ...ri.Ingredient.attributes,
                  }
                : null,
        })),
        createdAt: data.attributes.createdAt,
        updatedAt: data.attributes.updatedAt,
        publishedAt: data.attributes.publishedAt,
    }))
}

// MEDICAL FOOD MENUS ENDPOINTS

// Populate Recipes component's Recipe relation
const POPULATE = encodeURIComponent(`Recipes.Recipe`)

export async function getMedicalFoodMenuById(
    id: number,
): Promise<MedicalFoodMenu | null> {
    const res = await fetch(`${MFM_ENDPOINT}/${id}?populate=${POPULATE}`)
    if (!res.ok) return null

    const json = await res.json()

    if (!json.data) return null

    const data = json.data

    return {
        id: data.id,
        Name: data.attributes.Name,
        Recipes: (data.attributes.Recipes || []).map((mr: any) => ({
            ...mr,
            Recipe: mr.Recipe
                ? {
                      id: mr.Recipe.id,
                      ...mr.Recipe.attributes,
                  }
                : null,
            ServingSize: mr.ServingSize,
            Notes: mr.Notes,
        })),
        createdAt: data.attributes.createdAt,
        updatedAt: data.attributes.updatedAt,
        publishedAt: data.attributes.publishedAt,
    }
}

export async function getAllMedicalFoodMenus(): Promise<MedicalFoodMenu[]> {
    const res = await fetch(`${MFM_ENDPOINT}?populate=${POPULATE}`)
    if (!res.ok) return []

    const json = await res.json()

    return (json.data || []).map((data: any) => ({
        id: data.id,
        Name: data.attributes.Name,
        Recipes: (data.attributes.Recipes || []).map((mr: any) => ({
            ...mr,
            Recipe: mr.Recipe
                ? {
                      id: mr.Recipe.id,
                      ...mr.Recipe.attributes,
                  }
                : null,
            ServingSize: mr.ServingSize,
            Notes: mr.Notes,
        })),
        createdAt: data.attributes.createdAt,
        updatedAt: data.attributes.updatedAt,
        publishedAt: data.attributes.publishedAt,
    }))
}
