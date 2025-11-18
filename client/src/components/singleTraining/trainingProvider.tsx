"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Exercise, Training } from "@/utils/types"

type TrainingCtxContextType = {
    nextTraining: { training: Training; time: string } | null
    singleExercise: Exercise | null

    isEditTrainingModalOpen: boolean
    isEditExerciseModalOpen: boolean

    openEditTrainingModal: () => void
    closeEditTrainingModal: () => void

    openEditExerciseModal: () => void
    closeEditExerciseModal: () => void

    updateTraining: (updated: Training, updatedTime: string) => void
    setNextTraining: (training: Training[], time: string) => void

    updateExercise: (updated: Exercise) => void
    setSingleExercise: (exercise: Exercise) => void
}

const TrainingContext = createContext<TrainingCtxContextType | undefined>(
    undefined,
)

export const TrainingCtxProvider = ({ children }: { children: ReactNode }) => {
    const [nextTraining, setNextTraining] = useState<{
        training: Training
        time: string
    } | null>(null)
    const [singleExercise, setSingleExercise] = useState<Exercise | null>(null)
    const [isEditTrainingModalOpen, setIsEditTrainingModalOpen] =
        useState(false)
    const [isEditExerciseModalOpen, setIsEditExerciseModalOpen] =
        useState(false)

    console.log(singleExercise, isEditExerciseModalOpen, "singleExercise")

    const openEditTrainingModal = () => {
        setIsEditTrainingModalOpen(true)
    }

    const closeEditTrainingModal = () => {
        setIsEditTrainingModalOpen(false)
    }

    const openEditExerciseModal = () => {
        setIsEditExerciseModalOpen(true)
    }

    const closeEditExerciseModal = () => {
        setIsEditExerciseModalOpen(false)
    }

    const updateExercise = (updated: Exercise) => {
        setSingleExercise((prev) => {
            if (!prev) {
                return updated // Initialize state if it's null
            }

            // Merge the existing exercise state with the updated one
            return {
                ...prev,
                ...updated, // Override with the updated data
            }
        })
    }

    const updateTraining = (updated: Training, updatedTime: string) => {
        setNextTraining((prev) => {
            if (!prev) {
                return { training: updated, time: updatedTime } // Initialize state if it's null
            }

            // Merge the existing training state with the updated one
            return {
                ...prev,
                training: {
                    ...prev.training, // Preserve previous training data
                    ...updated, // Override with the updated data
                },
                time: updatedTime || prev.time, // Keep previous time if not updated
            }
        })
    }

    const setNextTrainingWrapper = (trainings: Training[], time: string) => {
        if (trainings.length > 0) {
            setNextTraining({ training: trainings[0], time })
        } else {
            setNextTraining(null)
        }
    }

    const setSingleExerciseWrapper = (exercise: Exercise) => {
        if (exercise) {
            setSingleExercise(exercise)
        } else {
            setSingleExercise(null)
        }
    }

    return (
        <TrainingContext.Provider
            value={{
                nextTraining,
                singleExercise,

                isEditTrainingModalOpen,
                openEditTrainingModal,
                closeEditTrainingModal,

                isEditExerciseModalOpen,
                openEditExerciseModal,
                closeEditExerciseModal,

                updateTraining,
                setNextTraining: setNextTrainingWrapper,

                setSingleExercise: setSingleExerciseWrapper,
                updateExercise,
            }}
        >
            {children}
        </TrainingContext.Provider>
    )
}

export const useTrainingCtx = () => {
    const context = useContext(TrainingContext)
    if (!context) {
        throw new Error(
            "useTrainingModal must be used within a TrainingModalProvider",
        )
    }
    return context
}
