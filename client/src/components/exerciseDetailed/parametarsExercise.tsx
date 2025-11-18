"use client"
import { useState, useEffect } from "react"
import { Exercise } from "@/utils/types"
import React from "react"
import ParametarsIcon from "../util/ParametarsIcon"
import TodaysFoodInteakeLoader from "../skeletonLoaders/todaysFoodIntakeLoader"


type ParametarsExerciseProps = {
    exercise: Exercise
}

const ParametarsExercise: React.FC<ParametarsExerciseProps> = ({ exercise }) => {
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
        return (
            <div className="grid sm:grid-cols-3 grid-cols-2 gap-2 w-full">
                <TodaysFoodInteakeLoader />
                <TodaysFoodInteakeLoader />
                <TodaysFoodInteakeLoader />
            </div>
        )
    }

    if (!exercise) {
        return (
            <div className="shadow-Combined font-Poppins flex min-h-[300px] w-full flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <p>No Exercise found sory.</p> {/* UI for no activities */}
            </div>
        )
    }

    return (
        <div className=" font-Poppins w-full  bg-[#FAF9F6]] jsutify-center ">
           
                <div className="grid sm:grid-cols-3 grid-cols-2 gap-2">
                    <div className="flex flex-row items-center">
                        <ParametarsIcon
                            parametarName={"Time"}
                            iconSize={16}
                            containerSize={32}
                        />
                        <p className="ml-2 text-sm font-medium text-[#2D3748]">
                            {exerciseData?.reps ?? 0}m
                        </p>
                    </div>

                    <div className="flex flex-row items-center sm:justify-center ">
                        <ParametarsIcon
                            parametarName={"Series"}
                            iconSize={16}
                            containerSize={32}
                        />
                        <p className="ml-2 text-sm font-medium text-[#2D3748]">
                            {exerciseData?.sets ?? 0} &nbsp;Series
                        </p>
                    </div>
                    <div className="flex flex-row items-center sm:justify-end">
                        <ParametarsIcon
                            parametarName={"Pause"}
                            iconSize={16}
                            containerSize={32}
                        />
                        <p className="ml-2 text-sm font-medium text-[#2D3748]">
                            Pause {exerciseData?.pause ?? 0}s
                        </p>
                    </div>
                </div>
        </div>
    )
}

export default ParametarsExercise
