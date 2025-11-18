"use client"

import { Input, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Barbell, Upload } from "@phosphor-icons/react"
import { useTrainingCtx } from "./trainingProvider"

const TrainingEditModal = () => {
    const { nextTraining, closeEditTrainingModal, updateTraining } =
        useTrainingCtx()

    const training = nextTraining?.training || {
        name: "",
        description: "",
        longDescription: "",
        duration: "",
        caloriesBurned: "",
        image: null,
        exercises: [],
    }

    const [trainingName, setTrainingName] = useState(training.name)
    const [trainingDescription, setTrainingDescription] = useState(
        training.description,
    )
    const [trainingLongDescription, setTrainingLongDescription] = useState(
        training.longDescription ?? "",
    )
    const [trainingTimeDuration, setTrainingTimeDuration] = useState(
        training.duration,
    )
    const [trainingCalorisBurned, setTrainingCaloriesBurned] = useState(
        training.caloriesBurned,
    )
    const [trainingImage, setTrainingImage] = useState(training.image)

    const [isOpening, setIsOpening] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        if (nextTraining?.training) {
            setTrainingName(nextTraining.training.name)
            setTrainingDescription(nextTraining.training.description)
            setTrainingLongDescription(nextTraining.training.description)
            setTrainingTimeDuration(nextTraining.training.duration)
            setTrainingCaloriesBurned(nextTraining.training.caloriesBurned)
            setTrainingImage(nextTraining.training.image)
        }
    }, [nextTraining])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            setTrainingImage(URL.createObjectURL(files[0]))
        }
    }

    const handleCloseModal = () => {
        setIsClosing(true)
        setTimeout(() => {
            closeEditTrainingModal()
        }, 500)
    }

    useEffect(() => {
        setIsOpening(true)
    }, [])

    useEffect(() => {
        if (isClosing) {
            setTimeout(() => {
                setIsOpening(false)
            }, 500)
        }
    }, [isClosing])

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCloseModal()
        }
    }

    const handleDeleteExercise = (indexToDelete: number) => {
        if (!nextTraining) return

        const updatedExercises = nextTraining.training.exercises?.filter(
            (_, index) => index !== indexToDelete,
        )

        const updatedTraining = {
            ...nextTraining.training,
            exercises: updatedExercises,
        }

        updateTraining(updatedTraining, nextTraining?.time)
    }

    const saveEditHandler = () => {
        //console.log("Before saving:", nextTraining) // Log current training

        const updatedTraining = {
            ...nextTraining?.training,
            id: nextTraining?.training?.id || 0,
            name: trainingName,
            description: trainingDescription,
            longDescription: trainingLongDescription,
            duration: typeof trainingTimeDuration === 'string' ? parseInt(trainingTimeDuration) || 0 : trainingTimeDuration,
            caloriesBurned: typeof trainingCalorisBurned === 'string' ? parseInt(trainingCalorisBurned) || 0 : trainingCalorisBurned,
            image: trainingImage,
            exercises: nextTraining?.training?.exercises || [],
            authorUserId: nextTraining?.training?.authorUserId || null,
        }

        handleCloseModal()
        updateTraining(updatedTraining, "2025-04-02T19:30:00Z")
    }

    return (
        <div
            onClick={handleBackdropClick}
            className="font-Poppins fixed inset-0 z-40 flex items-end justify-center bg-[#00000035] backdrop-blur-xs md:items-center"
        >
            <div
                className={`relative z-50 flex w-full max-w-[1000px] flex-col gap-[32px] overflow-y-scroll rounded-xl bg-white px-[32px] py-[24px] transition-transform duration-500 md:h-[80vh] md:w-[80vw] scrollbar-thin-mobile ${
                    isClosing
                        ? "translate-y-full"
                        : isOpening
                          ? "translate-y-0"
                          : "translate-y-full"
                }`}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-DarkGreen text-xl font-medium">
                        Edit Training
                    </h3>
                    <h4 className="text-normal text-sm text-[#757575]">
                        Lorem ipsum dolor sit amet
                    </h4>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Training Name
                    </p>
                    <Input
                        className="w-full"
                        placeholder="Enter training name"
                        type="text"
                        required
                        value={trainingName}
                        onChange={(e) => setTrainingName(e.target.value)}
                    />
                </div>

                <div className="flex flex-row-reverse items-start gap-6">
                    <div className="w-2/5 items-start">
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="image-upload"
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload">
                            <div className="bg-LightGreen flex w-full cursor-pointer flex-row items-center justify-center gap-6 rounded-lg p-2 text-sm font-medium text-white">
                                Upload Image
                                <Upload size={16} color="#ffffff" />
                            </div>
                        </label>
                    </div>
                    {trainingImage ? (
                        <div className="relative flex h-[125px] w-3/5 items-center justify-center overflow-clip rounded-xl bg-[#F5F5F5] md:h-[250px]">
                            <Image
                                src={trainingImage}
                                alt={trainingName || "trainingImage"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-[125px] w-3/5 items-center justify-center rounded-xl bg-[#F5F5F5] md:h-[250px]">
                            <Barbell color="#00000033" size={65} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Training Short Description
                    </p>
                    <TextField
                        placeholder="Enter training description"
                        className="w-full"
                        multiline
                        rows={4}
                        type="text"
                        required
                        value={trainingDescription}
                        onChange={(e) => setTrainingDescription(e.target.value)}
                        variant="standard"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Training Long Description
                    </p>
                    <TextField
                        placeholder="Enter training long description"
                        className="w-full"
                        multiline
                        rows={4}
                        type="text"
                        required
                        value={trainingLongDescription}
                        onChange={(e) =>
                            setTrainingLongDescription(e.target.value)
                        }
                        variant="standard"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Duration
                    </p>
                    <Input
                        placeholder="Enter Number"
                        className="w-full"
                        type="text"
                        required
                        value={trainingTimeDuration}
                        onChange={(e) =>
                            setTrainingTimeDuration(e.target.value)
                        }
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Energy Consumed
                    </p>
                    <Input
                        placeholder="Enter Number"
                        className="w-full"
                        type="number"
                        required
                        value={trainingCalorisBurned}
                        onChange={(e) =>
                            setTrainingCaloriesBurned(e.target.value)
                        }
                    />
                </div>

                {(nextTraining?.training?.exercises ?? []).length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-DarkGreen text-base font-semibold">
                            Exercises
                        </p>
                        {nextTraining?.training?.exercises.map(
                            (exercise, index) => (
                                <div
                                    key={exercise.id || index}
                                    className="flex items-center justify-between gap-4 border-b-2 border-black p-3"
                                >
                                    <div>
                                        <p className="font-medium text-black">
                                            {exercise.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDeleteExercise(index)
                                        }
                                        className="fontbold text-sm text-red-500 transition-transform duration-200 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ),
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No exercises added yet.
                    </p>
                )}

                <button
                    onClick={saveEditHandler}
                    className="bg-LightGreen flex w-full cursor-pointer flex-row items-center justify-center gap-6 rounded-lg p-2 text-sm font-medium text-white"
                >
                    Create
                </button>
            </div>
        </div>
    )
}

export default TrainingEditModal
