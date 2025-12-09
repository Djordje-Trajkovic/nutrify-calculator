"use server"

import { redirect } from "next/navigation"
import DashboardContainer from "@/components/util/AppContainer"

import DiaryClientWrapper from "@/components/diaryPage/DiaryClientWrapper"
import { DiaryPageCtxProvider } from "@/components/diaryPage/diaryPageProvider"
import { cookies } from "next/headers"
import { authenticateUser } from "@/utils/authenticateUser"

export interface DiaryEntry {
    id: string
    title: string
    content: string
    createdAt: Date
    authorId: string // nutritionistId
    foruserId: string // id korisnika
    file?: string,
    diaryComments: DiaryReply[]
}

export interface DiaryReply {
    commentId: string
    content: string
    creatorId: string
    createdAt: Date
    file?:string
}



const diaryEntrie = [
    {
        id: "1",
        title: "diary jedan",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada ut mauris at congue. Sed id molestie massa. Fusce ac lacus diam. Maecenas varius felis vitae eleifend congue. Maecenas porttitor felis sit amet gravida facilisis. Vivamus in dui feugiat, interdum quam et, posuere quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada ut mauris at congue. Sed id molestie massa. Fusce ac lacus diam. Maecenas varius felis vitae eleifend congue. Maecenas porttitor felis sit amet gravida facilisis. Vivamus in dui feugiat, interdum quam et, posuere quam.",
        authorId: "Nutricionista1",
        createdAt: new Date("2024-03-20"),
        foruserId: "user1",
        file: "nekifile.pdf",
        diaryComments: [
            {
                commentId: "1",
                content: "Ovo je prvi komentar",
                creatorId: "Nutricionista1",
                createdAt: new Date("2024-03-23"),
            },
        ],
    },
    {
      id: "2",
      title: "diary dva",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada ut mauris at congue. Sed id molestie massa. Fusce ac lacus diam. Maecenas varius felis vitae eleifend congue. Maecenas porttitor felis sit amet gravida facilisis. Vivamus in dui feugiat, interdum quam et, posuere quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada ut mauris at congue. Sed id molestie massa. Fusce ac lacus diam. Maecenas varius felis vitae eleifend congue. Maecenas porttitor felis sit amet gravida facilisis. Vivamus in dui feugiat, interdum quam et, posuere quam.",
      authorId: "Nutricionista1",
      createdAt: new Date("2024-03-20"),
      foruserId: "user1",
      diaryComments: [
          {
              commentId: "1",
              content: "Ovo je prvi komentar",
              creatorId: "Nutricionista1",
              createdAt: new Date("2024-03-23"),
          },
      ],
  },
]

export default async function DiaryPage() {
         const cookieStore = await cookies()
                        const token = cookieStore.get("jwtNutrifyS")?.value
                    
                        if (!token) {
                            redirect("/login")
                        }
                    
                        const user = await authenticateUser(token)
                        if (!user) {
                            redirect("/login")
                        }    

    //fetch diary


    return (
        <DashboardContainer>
            <div className="flex flex-col-reverse gap-6 lg:flex-row">
                <div className="flex w-full flex-col gap-6 lg:w-9/12">
                    <DiaryPageCtxProvider>
                        <DiaryClientWrapper
                            diaryEntries={diaryEntrie}
                        />
                    </DiaryPageCtxProvider>
                </div>
                <div className="flex w-full flex-col gap-6 lg:w-3/12 ">
                    <div className="shadow-Combined font-Poppins text-p-[10px] hidden min-h-[260px] w-full min-w-[200px] items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] text-[#2D3748] lg:flex lg:h-fit">
                        Reklama
                    </div>
                    <div className="shadow-Combined font-Poppins text-p-[10px] hidden min-h-[260px] w-full min-w-[200px] items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] text-[#2D3748] lg:flex lg:h-fit">
                        Reklama
                    </div>
                </div>
            </div>
        </DashboardContainer>
    )
}
