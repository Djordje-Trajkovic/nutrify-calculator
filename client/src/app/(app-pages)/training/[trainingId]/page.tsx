import { redirect } from "next/navigation"
//import YourNextTraining from "@/components/dashboardpage/yourNextTraining"
import AppContainer from "@/components/util/AppContainer"
//import TodaysTimeline from "@/components/dashboardpage/todaysTimeline"
import { TrainingCtxProvider } from "@/components/singleTraining/trainingProvider"
import TrainingClientWrapper from "@/components/singleTraining/trainingClientWrapper"
import { cookies } from "next/headers"
import { authenticateUser } from "@/utils/authenticateUser"

const fetchedTraining = [
    {
        training: {
            id: 1,
            authorUserId: "user_2uokDXlAs9kDAUpFf8Mwi5wIaRi",
            name: "Full Body Workout",
            caloriesBurned: 500,
            duration: "45 minutes",
            exercises: [
                {
                    name: "Push-ups",
                    sets: 3,
                    reps: 15,
                    id: 3,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Squats",
                    sets: 3,
                    reps: 20,
                    id: 2,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
                {
                    name: "Plank",
                    sets: 3,
                    reps: "30 seconds",
                    id: 1,
                    description:
                        " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend ante ac tortor hendrerit sollicitudin. Nullam sed nulla odio. Sed ultricies quis odio ut dignissim...",
                    pause: 60,
                },
            ],
            image: null,
            description:
                "A full body workout that targets all major muscle groups.printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu",
        },
        time: "2025-04-02T19:30:00Z",
    },
]

export default async function SingleTraining() {
          const cookieStore = await cookies()
                    const token = cookieStore.get("jwtNutrifyS")?.value
                
                    if (!token) {
                        redirect("/login")
                    }
                
                    const user = await authenticateUser(token)
                    if (!user) {
                        redirect("/login")
                    }

      
  

    return (
        <AppContainer>
            <TrainingCtxProvider>
            <TrainingClientWrapper initialTraining={fetchedTraining[0]} userId={user.id}/>
            </TrainingCtxProvider>
        </AppContainer>
    )
}
