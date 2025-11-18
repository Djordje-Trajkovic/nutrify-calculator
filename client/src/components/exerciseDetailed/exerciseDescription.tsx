"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

import { Exercise } from "@/utils/types"
import React from "react"
import ExerciseDescriptionLoader from "../skeletonLoaders/exerciseDescriptionLoader"

//import rdnImage from "../../../public/picture2.png"

type exerciseDescriptionProps = {
    exercise: Exercise
}

const ExerciseDescription: React.FC<exerciseDescriptionProps> = ({
    exercise,
}) => {
    const [exerciseData, setExerciseData] = useState<Exercise | null>()
    const [loading, setLoading] = useState(true)

    //console.log(sortedTodaysActivities, "sortedTodaysActivities")

    useEffect(() => {
        if (!exercise) {
            setLoading(false)
            return
        }

        setExerciseData(exercise)

        setLoading(false)
    }, [exercise])

    if (loading) {
        return <ExerciseDescriptionLoader />
    }

    if (!exercise) {
        return (
            <div className="shadow-Combined font-Poppins flex min-h-[300px] w-full flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <p>No Exercise found sory.</p> {/* UI for no activities */}
            </div>
        )
    }

    return (
        <>
            {exerciseData?.movmentImage && (
                <div className="flex w-full flex-col gap-6">
                    <h3 className="text-DarkGreen text-lg leading-[140%] font-medium">
                        Movement
                    </h3>
                    <div className="shadow-Combined font-Poppins w-full overflow-clip rounded-xl bg-[#FAF9F6] sm:shadow-none">
                        <div className="relative min-h-[200px] w-full overflow-clip rounded-xl">
                            <Image
                                src={exerciseData?.movmentImage}
                                alt={exerciseData?.name ?? "Exercise"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="shadow-Combined font-Poppins flex w-full flex-col gap-4 overflow-clip rounded-xl bg-[#FAF9F6] p-6 sm:p-0 sm:shadow-none">
                <h3 className="text-DarkGreen text-lg leading-[140%] font-medium">
                    Muscle Target
                </h3>
                <div className="flex w-full flex-col gap-6 sm:flex-col md:flex-row">
                    <div className="flex flex-1/2 flex-col gap-4">
                        {exerciseData?.description && (
                            <p className="text-sm font-normal text-[#757575]">
                                {exerciseData.description}
                            </p>
                        )}
                        {exerciseData?.musscleGroupTarget && (
                            <ol
                                start={1}
                                className="list-decimal space-y-4 pl-5"
                            >
                                {exerciseData.musscleGroupTarget.map(
                                    (muscle) => (
                                        <li
                                            key={muscle.name}
                                            className="flex flex-col gap-4"
                                        >
                                            <h4 className="text-base font-bold text-[#2D3748]">
                                                {muscle.name}
                                            </h4>
                                            <p className="text-sm font-normal text-[#757575]">
                                                {muscle.description}
                                            </p>
                                        </li>
                                    ),
                                )}
                            </ol>
                        )}
                    </div>

                    {exerciseData?.musslceGroupTargetImage && (
                        <div className="relative max-h-[240px] min-h-[400px] w-full flex-1/2 overflow-clip rounded-xl">
                            <Image
                                src={exerciseData.musslceGroupTargetImage}
                                alt={exerciseData?.name ?? "Exercise"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ExerciseDescription
