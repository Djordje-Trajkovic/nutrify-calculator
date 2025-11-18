import { NextResponse } from "next/server"
import {
    MealType,
    MealData as Meal,
    Training,
    WaterConsumption,
    DailyPlan,
} from "@/utils/types"

/// Only for testing since i dont have database yet
interface User {
    personId: number
    name: string
    subscribed: boolean
}

type DailyPlansResponse = DailyPlan[]

export async function GET(): Promise<NextResponse> {
    const waterConsumption: WaterConsumption = {
        planedWaterConsumption: 3000,
        currentWatterConsumption: 2000,
    }

    const TodaysMeals: Meal[] = [
        {
            id: 1,
            name: "Grilled Chicken Salad",
            description:
                "Fresh mixed greens with grilled chicken, cherry tomatoes, and balsamic dressing.",
            calories: 450,
            proteins: 40,
            fats: 10,
            carbohydrates: 30,
            authorUserId: 1,
            grocerys: [
                { name: "chicken", amount: "300gr", groceryId: 1 },
                { name: "lettuce", amount: "100gr", groceryId: 2 },
                { name: "tomatoes", amount: "50gr", groceryId: 3 },
            ],
            image: null,
        },
        {
            id: 2,
            name: "Spaghetti Carbonara",
            authorUserId: 1,
            description:
                "Classic Italian pasta with creamy sauce, bacon, and parmesan cheese.",
            calories: 700,
            proteins: 35,
            fats: 25,
            carbohydrates: 80,
            grocerys: [
                { name: "spaghetti", amount: "200gr", groceryId: 4 },
                { name: "bacon", amount: "100gr", groceryId: 5 },
                { name: "parmesan", amount: "50gr", groceryId: 6 },
            ],
            image: null,
        },
        {
            id: 3,
            authorUserId: 4,
            name: "Margherita Pizza",
            description:
                "Tomato sauce, fresh mozzarella, and basil on a thin crust.",
            calories: 900,
            proteins: 30,
            fats: 40,
            carbohydrates: 90,
            grocerys: [
                { name: "pizza dough", amount: "250gr", groceryId: 7 },
                { name: "mozzarella", amount: "150gr", groceryId: 8 },
                { name: "tomato sauce", amount: "100gr", groceryId: 9 },
            ],
            image: null,
        },
    ]

    const TodaysTraining: Training[] = [
        {
            id: 1,
            name: "Full Body Workout",
            caloriesBurned: 500,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
            duration: "60",
            exercises: [
                {
                    name: "Squats",
                    sets: 4,
                    reps: 12,
                    id: 1,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Bench Press",
                    sets: 3,
                    reps: 10,
                    id: 2,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Deadlifts",
                    sets: 3,
                    reps: 8,
                    id: 3,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Pull-ups",
                    sets: 3,
                    reps: 10,
                    id: 4,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
            ],
            image: null,
            authorUserId: 1,
        },
        {
            id: 2,
            name: "Cardio Session",
            caloriesBurned: 300,
            duration: "45",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
            exercises: [
                {
                    name: "Running",
                    sets: 1,
                    reps: "30 minutes",
                    id: 5,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Jump Rope",
                    sets: 3,
                    reps: "5 minutes",
                    id: 6,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Cycling",
                    sets: 1,
                    reps: "15 minutes",
                    id: 7,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
            ],
            image: null,
            authorUserId: 1,
        },
    ]

    const User: User[] = [
        { personId: 11, name: "John Doe", subscribed: true },
        { personId: 12, name: "Jane Doe", subscribed: false },
    ]

    const dailyPlans: DailyPlansResponse = User.map((user) => {
        const mealPlan = user.subscribed
            ? [
                  {
                      meal: TodaysMeals[0],
                      mealType: MealType.Breakfast,
                      time: "2025-03-31T09:30:00Z",
                  },
                  {
                      meal: TodaysMeals[1],
                      mealType: MealType.Lunch,
                      time: "2025-04-05T13:00:00Z",
                  },
                  {
                      meal: TodaysMeals[2],
                      mealType: MealType.Dinner,
                      time: "2025-04-02T19:30:00Z",
                  },
              ]
            : []

        const trainingPlan = user.subscribed
            ? [
                  {
                      training: TodaysTraining[0],
                      time: "2025-05-02T17:00:00Z",
                  },
                  {
                      training: TodaysTraining[1],
                      time: "2025-04-17T16:00:00Z",
                  },
              ]
            : []

        return {
            personId: user.personId,
            name: user.name,
            mealPlan,
            trainingPlan,
            waterConsumption,
            date: "2025-04-17",
        }
    })

    return NextResponse.json(dailyPlans)
}
