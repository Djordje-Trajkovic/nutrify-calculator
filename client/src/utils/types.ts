export type MenuOption = {
    icon: React.ReactNode
    title: string
    path: string
}

export type Meal = {
    name: string,
    ingredients: Ingredient[],
    kcal: number,
    protein: number,
    fat: number,
    carbohydrates: number,
    glycemicLoad: number,
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

export enum MealType {
    Breakfast = "breakfast",
    Lunch = "lunch",
    Dinner = "dinner",
}

export interface GroceryItem {
    name: string
    amount: string
    groceryId: number
}

export interface PreperationType {
    stepTitle?: string
    instructions?: string[]
}

export interface MealData {
    id: number
    name: string
    description: string
    calories: number
    proteins: number
    fats: number
    carbohydrates: number
    grocerys: GroceryItem[]
    image: string | null
    authorUserId: number | string | null
    preparationVideoUrl?: string | null
    detailePreparation?: PreperationType[] | null | undefined
}

export interface Exercise {
    id: number | string
    name: string
    sets: number
    reps: number | string
    pause?: string | number
    description: string
    imageHero?: string | null
    musslceGroupTargetImage?: null | string
    movmentImage?: null | string
    videoLink?: null | string
    musscleGroupTarget?: {
        name: string
        description: string
    }[]
}

export interface Training {
    id: number
    name: string
    caloriesBurned: number
    duration: string | number
    exercises: Exercise[]
    image: string | null
    description: string
    authorUserId: number | string | null
    longDescription?: string
}

export interface WaterConsumption {
    planedWaterConsumption: number
    currentWatterConsumption: number
}

export interface DailyPlan {
    personId: number
    name: string
    mealPlan: {
        meal: MealData
        mealType: MealType
        time: string
    }[]
    waterConsumption?: WaterConsumption | null
    trainingPlan:
        | {
              training: Training
              time: string
          }[]
        | null
}
