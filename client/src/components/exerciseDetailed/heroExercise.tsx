"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

import { Exercise } from "@/utils/types"
import React from "react"
import { ArrowDown, Barbell } from "@phosphor-icons/react"
import HeroExerciseLoader from "../skeletonLoaders/heroExerciseLoader"

//import rdnImage from "../../../public/picture2.png"

type HeroExerciseProps = {
    exercise: Exercise
}

const HeroExercise: React.FC<HeroExerciseProps> = ({ exercise }) => {
    //console.log(exercise, "exercise")
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
        return <HeroExerciseLoader />
    }

    if (!exercise) {
        return (
            <div className="shadow-Combined font-Poppins flex min-h-[300px] w-full flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <p>No Exercise found sory.</p> {/* UI for no activities */}
            </div>
        )
    }

    return (
        <div className="shadow-Combined font-Poppins w-full overflow-clip rounded-xl bg-[#FFFFFF] sm:shadow-none">
            <div>
                {exerciseData?.imageHero ? (
                    <div className="relative h-[320px] w-full overflow-clip rounded-xl">
                        <Image
                            src={exerciseData.imageHero}
                            alt={exerciseData?.name ?? "Exercise"}
                            fill
                            className="object-cover"
                        />
                        <div className="right-0 bottom-0 left-0 hidden flex-row items-center justify-between gap-2 sm:absolute sm:flex">
                            <div className="flex min-w-3/12 flex-col gap-2 rounded-tr-xl rounded-bl-xl bg-[#F5F5F5] p-[24px]">
                                <h3 className="text-DarkGreen text-lg leading-[140%] font-medium">
                                    {exerciseData?.name ?? "Ecerscise"}
                                </h3>
                                <h4 className="text-sm leading-[140%] font-normal text-[#A0AEC0]">
                                    Lorem sddfsd fdsfas fsd s!
                                </h4>
                            </div>
                            {!exercise.videoLink && (
                                <div className="items flex min-w-3/12 items-end justify-end p-[24px]">
                                    <button className="bg-LightGreen flex flex-row items-center justify-center gap-4 rounded-lg p-3 text-sm leading-[140%] font-medium text-[#FFFFFF]">
                                        <a
                                            href={
                                                "https://www.youtube.com/watch?v=i_ksoAjK-EI&list=RDi_ksoAjK-EI&start_radio=1"
                                            }
                                        >
                                            Watch video
                                        </a>
                                        <ArrowDown
                                            color="white"
                                            size="12"
                                            className="rotate-270"
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative flex h-[320px] w-full items-center justify-center overflow-clip rounded-xl bg-[#F5F5F5]">
                        <Barbell color="#00000033" size={80} />

                        <div className="right-0 bottom-0 left-0 hidden flex-row items-end justify-between gap-2 sm:absolute sm:flex">
                            <div className="flex min-w-3/12 flex-col gap-2 rounded-tr-xl rounded-bl-xl bg-[#F5F5F5] p-[24px]">
                                <h3 className="text-lg leading-[140%] font-medium text-[#2D3748]">
                                    {exerciseData?.name ?? "Ecerscise"}
                                </h3>
                                <h4 className="text-sm leading-[140%] font-normal text-[#A0AEC0]">
                                    Lorem sddfsd fdsfas fsd s!
                                </h4>
                            </div>
                            {!exercise.videoLink && (
                                <div className="flex min-w-3/12 items-end justify-end p-[24px]">
                                    <button className="bg-LightGreen flex flex-row items-center justify-center gap-4 rounded-lg p-3 text-sm leading-[140%] font-medium text-[#FFFFFF]">
                                        <a
                                            href={
                                                "https://www.youtube.com/watch?v=i_ksoAjK-EI&list=RDi_ksoAjK-EI&start_radio=1"
                                            }
                                        >
                                            Watch vieo
                                        </a>
                                        <ArrowDown
                                            color="white"
                                            size="12"
                                            className="rotate-270"
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex w-full flex-col justify-between gap-2 p-[16px] sm:hidden">
                    <div className="flex min-w-3/12 flex-col gap-2">
                        <h3 className="text-lg leading-[140%] font-medium text-[#2D3748]">
                            {exerciseData?.name ?? "Ecerscise"}
                        </h3>
                        <h4 className="text-sm leading-[140%] font-normal text-[#A0AEC0]">
                            Lorem sddfsd fdsfas fsd s!
                        </h4>
                    </div>
                    {!exercise.videoLink && (
                        <div className="flex w-full">
                            <button className="bg-LightGreen flex w-full flex-row items-center justify-center gap-4 rounded-lg p-3 text-sm leading-[140%] font-medium text-[#FFFFFF]">
                                <a
                                    href={
                                        "https://www.youtube.com/watch?v=i_ksoAjK-EI&list=RDi_ksoAjK-EI&start_radio=1"
                                    }
                                >
                                    Read More
                                </a>
                                <ArrowDown
                                    color="white"
                                    size="12"
                                    className="rotate-270"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeroExercise
