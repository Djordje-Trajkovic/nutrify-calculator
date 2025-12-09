"use server"

import { redirect } from "next/navigation"
import AppContainer from "@/components/util/AppContainer"
import AboutNutritionist from "@/components/nutritionistpage/aboutNutritionist"
import ContactInformationOrEducation from "@/components/nutritionistpage/contactInformationOrEducation"
import Testimonial from "@/components/nutritionistpage/testimonial"
import { cookies } from "next/headers"
import { authenticateUser } from "@/utils/authenticateUser"

const singleNutritionist = {
    id: 4,
    avatarPhoto: "",

    name: "Bob Brown",
    shortDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    location: "Houston",
    education: "Bachelor's in Nutrition",
    rating: 4.9,
    yearOfExperience: 10,
    aboutMe:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada ut mauris at congue. Sed id molestie massa. Fusce ac lacus diam. Maecenas varius felis vitae eleifend congue. Maecenas porttitor felis sit amet gravida facilisis. Vivamus in dui feugiat, interdum quam et, posuere quam.",
    email: "test@gmail.com",
    languages: ["Serbian", "English", "getman", "russian", "turkish"],
    phone: "+38144444444444",
    testimonial: [
        {
            userId: 4,
            comment:
                "A nutritionist provides guidance on food and nutrition to promote a healthy lifestyle. They assess individual needs, create personalized meal plans, and support people in reaching health goals. Good nutrition is key to improving energy, mood, and overall wellness.",
            rating: 4,
        },
        {
            userId: 4,
            comment:
                "A nutritionist provides guidance on food and nutrition to promote a healthy lifestyle. They assess individual needs, create personalized meal plans, and support people in reaching health goals. Good nutrition is key to improving energy, mood, and overall wellness.",
            rating: 5,
        },
    ],
}

const NutritionistPage = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwtNutrifyS")?.value

    if (!token) {
        redirect("/login")
    }

    const user = await authenticateUser(token)
    if (!user) {
        redirect("/login")
    }

    //get params and await nutritionis info

    return (
        <AppContainer>
            <div className="flex flex-col gap-6">
                <AboutNutritionist
                    nutritionistProp={singleNutritionist}
                ></AboutNutritionist>
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-6 lg:grid-rows-1">
                    <div className="h-full w-full lg:col-span-4">
                        <ContactInformationOrEducation
                            showType="contact"
                            education={
                                singleNutritionist?.education ??
                                "No education"
                            }
                            nutrtionistEmail={
                                singleNutritionist.email ?? "No email"
                            }
                            nutrtionistLanguages={
                                singleNutritionist.languages ??
                                "No languages to show"
                            }
                            nutrtionistPhoneNumber={
                                singleNutritionist.phone ??
                                "No phone number to show"
                            }
                        ></ContactInformationOrEducation>
                    </div>
                    <div className="h-full w-full lg:col-span-2">
                        <ContactInformationOrEducation
                            showType="education"
                            education={
                                singleNutritionist?.education ??
                                "No education"
                            }
                            nutrtionistEmail={
                                singleNutritionist.email ?? "No email"
                            }
                            nutrtionistLanguages={
                                singleNutritionist.languages ??
                                "No languages to show"
                            }
                            nutrtionistPhoneNumber={
                                singleNutritionist.phone ??
                                "No phone number to show"
                            }
                        ></ContactInformationOrEducation>
                    </div>
                </div>
                <Testimonial
                    testimonialProp={singleNutritionist?.testimonial}
                ></Testimonial>
            </div>
        </AppContainer>
    )
}

export default NutritionistPage
