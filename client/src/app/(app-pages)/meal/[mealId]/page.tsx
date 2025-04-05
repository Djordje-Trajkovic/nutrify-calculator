"use server"

import SideMenu from "@/components/util/SideMenu"
import Header from "@/components/util/AppHeader"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import AppContainer from "@/components/util/AppContainer"
import YourNextMeal from "@/components/dashboardpage/yourNextMeal"
import { MealType } from "@/app/api/mealsTest/route"
import HowToMakeMeal from "@/components/singleMeal/HowToMakeMeal"
import NecessaryGroceries from "@/components/singleMeal/NecessaryGroceries"
import ContentOfMeal from "@/components/singleMeal/ContentOfMeal"

const fetchedMeal = [
    {
        meal: {
            id: 1,
            name: "Chicken Salad",
            description:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            calories: 350,
            proteins: 30,
            fats: 10,
            carbohydrates: 40,
            grocerys: [
                { name: "Chicken", amount: "200g", groceryId: 1 },
                { name: "Lettuce", amount: "100g", groceryId: 2 },
                { name: "Tomato", amount: "50g", groceryId: 3 },
            ],
            image: null,
            videoUrl: "ovo je video",
            detailePreparation: [
                {
                    stepTitle: "Priprema luka",
                    instructions: [
                        "Iseckaj luk",
                        "Stavi ga u tiganj",
                        "Dodaj malo ulja",
                    ],
                },
                {
                    stepTitle: "Prženje piletine",
                    instructions: [
                        "Dodaj piletinu",
                        "Prži dok ne porumeni",
                        "Začini po ukusu",
                    ],
                },
            ],
        },
        mealType: MealType.Lunch,
        time: "2025-04-02T19:30:00Z",
    },
]

export default async function SingleMeal() {
    const { userId } = await auth()

    if (!userId) {
        redirect("/login")
    }

    console.log(userId, "userId page")

    return (
        <div className="h-screen w-full bg-[#FAF9F6]">
            <SideMenu />
            <Header />
            <div className="bg-[#FAF9F6] pt-[100px] pb-10">
                <AppContainer>
                    <div className="flex flex-col gap-6">
                        <YourNextMeal
                            isNextMealComponent={false}
                            nextMealProp={fetchedMeal[0]}
                            userId={userId}
                        />
                        <HowToMakeMeal
                            mealInstructionProp={
                                fetchedMeal[0]?.meal?.detailePreparation
                            }
                            videoInstructions={fetchedMeal[0]?.meal?.videoUrl}
                        />
                        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-4 lg:grid-rows-1">
                            <div className="h-full w-full lg:col-span-2">
                                <NecessaryGroceries
                                    necessaryGroceries={
                                        fetchedMeal[0]?.meal?.grocerys
                                    }
                                ></NecessaryGroceries>
                            </div>
                            <div className="h-full w-full lg:col-span-2">
                                <ContentOfMeal
                                    necessaryGroceries={
                                        fetchedMeal[0]?.meal?.grocerys
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </AppContainer>
            </div>
        </div>
    )
}
