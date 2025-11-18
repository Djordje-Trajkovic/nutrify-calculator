"use client"

import { Input, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Barbell, Upload } from "@phosphor-icons/react"
import { useTrainingCtx } from "./trainingProvider"



const ExerciseEditModal= () => {
    const { singleExercise, closeEditExerciseModal, updateExercise } = useTrainingCtx()

    const exercise = singleExercise || {
    name: "",
    sets: "",
    reps:"",
    pause:"",
    description: "",
    imageHero:  null,
    }

    const [exerciseName, setExerciseName] = useState(exercise.name)
    const [exerciseDescription, setExerciseDescription] = useState(
        exercise.description,
    )
    //const [trainingLongDescription, setTrainingLongDescription] = useState(
        //training.longDescription ?? "",
    //)
    const [exercisePauseDuration, setExerxisePauseDuration] = useState(
        exercise.pause,
    )
    const [exerciseSets, setExerciseSets] = useState(exercise.sets)
    const [exerciseReps, setExerciseReps] = useState(
        exercise.reps,
    )
    const [exerciseImageHero, setExerciseImageHero] = useState(exercise.imageHero)
    

 

    const [isOpening, setIsOpening] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        if (singleExercise) {
            setExerciseName(singleExercise.name)
            setExerciseDescription(singleExercise.description)
            setExerxisePauseDuration(singleExercise.pause)
            setExerciseSets(singleExercise.sets)
            setExerciseReps(singleExercise.reps)
            setExerciseImageHero(singleExercise.imageHero)
        
        }
    }, [singleExercise])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            setExerciseImageHero(URL.createObjectURL(files[0]))
        }
    }

    const handleCloseModal = () => {
        setIsClosing(true)
        setTimeout(() => {
            closeEditExerciseModal()
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




    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        //console.log("Before saving:", nextTraining) // Log current training
        e.preventDefault()

        const formData = new FormData()
        formData.append("name", exerciseName)
        formData.append("description", exerciseDescription)
        formData.append("pause", exercisePauseDuration?.toString() || "")
        formData.append("sets", exerciseSets.toString())
        formData.append("reps", exerciseReps.toString())
        formData.append("imageHero", exerciseImageHero || "")
        //post formmdata wait for new data and uplooad(data) da bi pormenio front

        const updatedTraining = {
            ...singleExercise,
            id: singleExercise?.id || "",
            name: exerciseName,
            description: exerciseDescription,
            pause: exercisePauseDuration,
            sets: typeof exerciseSets === 'string' ? parseInt(exerciseSets) || 0 : exerciseSets,
            reps: exerciseReps,
            imageHero: exerciseImageHero,
        }

        handleCloseModal()
        console.log("Updated training:", updatedTraining) // Log updated training
        updateExercise(updatedTraining)
    }

    return (
        <form onSubmit={submitHandler}>
        <div
            onClick={handleBackdropClick}
            className="font-Poppins fixed inset-0 z-40 flex items-end justify-center bg-[#00000035] backdrop-blur-xs md:items-center"
        >
            <div
                className={`relative z-50 flex w-full max-w-[1000px] flex-col gap-[32px] overflow-y-scroll rounded-xl bg-white px-[32px] py-[24px] transition-all duration-500 md:h-[80vh] md:w-[80vw] ${isClosing
                        ? "translate-y-full opacity-0"
                        : isOpening
                            ? "translate-y-0 opacity-100"
                            : "translate-y-full opacity-0"
                    }`}
            >
                <div className="flex flex-col gap-2">
                    <h3 className="text-DarkGreen text-xl font-medium">
                        Edit Exercise
                    </h3>
                    <h4 className="text-normal text-sm text-[#757575]">
                        Lorem ipsum dolor sit amet
                    </h4>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Exercise Name
                    </p>
                    <Input
                        className="w-full"
                        placeholder="Enter training name"
                        type="text"
                        required
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
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
                    {exerciseImageHero ? (
                        <div className="relative flex h-[125px] w-3/5 items-center justify-center overflow-clip rounded-xl bg-[#F5F5F5] md:h-[250px]">
                            <Image
                                src={exerciseImageHero} 
                                alt={exerciseName || "trainingImage"}
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
                        Exercise  Description
                    </p>
                    <TextField
                        placeholder="Enter training description"
                        className="w-full"
                        multiline
                        rows={4}
                        type="text"
                        required
                        value={exerciseDescription}

                        onChange={(e) => setExerciseDescription(e.target.value)}
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
                        type="string"
                        required
                        value={exerciseReps}
                        onChange={(e) =>
                            setExerciseReps(e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Series
                    </p>
                    <Input
                        placeholder="Enter Number"
                        className="w-full"
                        type="number"
                        required
                        value={exerciseSets}
                        onChange={(e) =>
                            setExerciseSets(e.target.value)
                        }
                    />                </div>
                    <div className="flex flex-col gap-2">
                    <p className="text-DarkGreen text-base font-medium">
                        Pause Duration
                    </p>
                    <Input
                        placeholder="Enter Number"
                        className="w-full"
                        type="number"
                        required
                        value={exercisePauseDuration}
                        onChange={(e) =>
                            setExerxisePauseDuration(e.target.value)
                        }
                    />                </div>


                    
                <button
                    type="submit"
                    className="bg-LightGreen flex w-full cursor-pointer flex-row items-center justify-center gap-6 rounded-lg p-2 text-sm font-medium text-white"
                >
                    Save Changes
                </button>
            </div>
        </div>
        </form>
    )
}

export default ExerciseEditModal

