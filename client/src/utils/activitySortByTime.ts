// utils/sortMeals.ts
import { MealData as Meal, MealType, Training } from "@/utils/types"

export function mealsSortedByTime(
    nextMeals: { meal: Meal; mealType: MealType; time: string }[],
): { meal: Meal; mealType: MealType; time: string } | null {
    const currentTime = new Date()

    const futureMeals = nextMeals.filter((meal) => {
        const mealTime = new Date(meal.time)
        return mealTime > currentTime
    })

    const sortedMeals = futureMeals.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime()
    })

    return sortedMeals.length > 0 ? sortedMeals[0] : null
}

export function trainingSortedByTime(
    nextTrainings: { training: Training; time: string }[],
): {
    training: Training
    time: string
} | null {
    const currentTime = new Date()

    const futureTrainings = nextTrainings.filter((training) => {
        const trainingTime = new Date(training.time)
        return trainingTime > currentTime
    })

    const sortedTrainings = futureTrainings.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime()
    })

    return sortedTrainings.length > 0 ? sortedTrainings[0] : null
}
