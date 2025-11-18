"use client"

import React, { useState, useEffect } from "react"

import { Exercise } from "@/utils/types"

import SingleExercise from "../singleTraining/singleExercise"

import { useTrainingCtx } from "./trainingProvider"
import TodayTimelineLoader from "../skeletonLoaders/todayTimelineLoader"

type TodaysTimelineProps = {
    userId?: string | null
}

const ExerciseTimeline: React.FC<TodaysTimelineProps> = ({ userId = null }) => {
    const { nextTraining } = useTrainingCtx()
    const [sortedExercises, setSortedEcercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(true)

    //console.log(sortedTodaysActivities, "sortedTodaysActivities")

    useEffect(() => {
        if (!nextTraining) {
            setLoading(false)
            return
        }

        setSortedEcercises(nextTraining?.training.exercises || [])

        setLoading(false)
    }, [nextTraining])

    //console.log(sortedTodaysActivities, "sorted")

    if (loading) {
        return (
           <TodayTimelineLoader/>
        )
    }

    if (!sortedExercises || sortedExercises.length === 0) {
        return (
            <div className="shadow-Combined font-Poppins flex min-h-[300px] flex-col justify-between gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
                <p>No upcoming Activities.</p> {/* UI for no activities */}
            </div>
        )
    }

    return (
        <div className="shadow-Combined font-Poppins flex min-h-[300px] w-full flex-col gap-8 rounded-xl bg-[#FFFFFF] px-[20px] py-[17px] text-black">
            <div
                className={`flex flex-col justify-between gap-4 sm:flex-row md:items-center`}
            >
                <div
                    className={`flex w-full flex-col gap-6 sm:flex-row sm:justify-between`}
                >
                    <div>
                        <h3 className="text-DarkGreen text-xl font-medium">
                            Exercises
                        </h3>
                        <h4 className="text-sm font-normal text-[#757575]">
                            Lorem ipsum dolor sit amet
                        </h4>
                    </div>

             
                </div>
            </div>
            <div className="custom-scrollbar flex snap-x flex-row gap-x-6 overflow-x-scroll scroll-smooth whitespace-nowrap">
                {sortedExercises.map((exercise, index) => {
                    //console.log(exercise, "exercise")
                    return (
                        <SingleExercise
                            key={exercise.id}
                            index={index}
                            exercise={exercise}
                            trainingId={nextTraining?.training.id ?? null}
                            userId={userId ?? null}
                        ></SingleExercise>
                    )
                })}
            </div>
        </div>
    )
}

export default ExerciseTimeline
