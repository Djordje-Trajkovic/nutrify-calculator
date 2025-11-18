import { Exercise } from "@/utils/types"
import { ArrowDown, Barbell, Eraser } from "@phosphor-icons/react"

import Image from "next/image"
import ParametarsIcon from "../util/ParametarsIcon"
import Link from "next/link"
import { useTrainingCtx } from "./trainingProvider"
type SingleEcerciseProp = {
    exercise: Exercise
    index: number
    trainingId: string | number | null
    userId: string | null
}

const SingleExercise: React.FC<SingleEcerciseProp> = ({
    exercise,
    index,
    trainingId,
    userId,
}) => {
    const userSubscription = true // TODO: Replace with actual subscription check logic
    const { nextTraining, setSingleExercise, openEditExerciseModal } =
        useTrainingCtx()

    if (!exercise) {
        return <div>No exercise for today!</div>
    }
    return (
        <div className="font-Poppins flex w-[370px] shrink-0 flex-col gap-5 pb-4">
            <div>
                {exercise?.imageHero ? (
                    <div className="relative h-[190px] w-full overflow-clip rounded-xl">
                        <Image
                            src={exercise.imageHero}
                            alt={exercise.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-[190px] w-full items-center justify-center rounded-xl bg-[#F5F5F5]">
                        <Barbell color="#00000033" size={80} />
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-xs leading-[150%] font-medium text-[#A0AEC0]">
                    {index + 1} Exercise
                </h4>
                <h3 className="text-lg leading-[140%] font-medium text-[#2D3748]">
                    {exercise?.name ?? "Ecerscise"}
                </h3>
                <p
                    className={`mt-2 flex text-sm leading-[140%] font-medium text-wrap text-clip text-[#A0AEC0]`}
                >
                    {exercise?.description
                        ? exercise?.description?.length > 120
                            ? exercise?.description.slice(0, 120) + "..."
                            : exercise?.description
                        : "Description of your training..."}
                </p>
            </div>

            <div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-row items-center">
                        <ParametarsIcon
                            parametarName={"Time"}
                            iconSize={16}
                            containerSize={32}
                        />
                        <p className="ml-2 text-sm font-medium text-[#2D3748]">
                            {exercise.reps ?? 0}m
                        </p>
                    </div>

                    <div className="flex flex-row items-center">
                        <ParametarsIcon
                            parametarName={"Series"}
                            iconSize={16}
                            containerSize={32}
                        />
                        <p className="ml-2 text-sm font-medium text-[#2D3748]">
                            {exercise.sets ?? 0} &nbsp;Series
                        </p>
                    </div>
                    <div className="flex flex-row items-center">
                        <ParametarsIcon
                            parametarName={"Pause"}
                            iconSize={16}
                            containerSize={32}
                        />
                        <p className="ml-2 text-sm font-medium text-[#2D3748]">
                            {exercise?.pause ?? 0}s
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-between border-t-2 border-[#D9D9D9] p-2">
                {userId === nextTraining?.training.authorUserId && (
                    <button
                        onClick={() => {
                            setSingleExercise(exercise)
                            openEditExerciseModal()
                        }}
                        className="bg-LightGreen flex flex-row items-center justify-center gap-4 rounded-lg p-3 text-sm leading-[140%] font-medium text-[#FFFFFF]"
                    >
                        Edit Exercises
                        <Eraser color="white" size="16" />
                    </button>
                )}
                {userSubscription && trainingId && exercise?.id && (
                    <button className="flex flex-row items-center justify-center gap-2 text-xs leading-[150%] font-normal text-[#2D3748]">
                        <Link
                            href={`/training/${trainingId}/exercise/${exercise?.id}`}
                        >
                            Read More
                        </Link>
                        <ArrowDown
                            color="black"
                            size="12"
                            className="rotate-270"
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SingleExercise
