"use client"
import React, { useState } from "react"
import MainContainer from "../util/MainContainer"
import { Ingredient } from "@/utils/types"
import CustomInput from "../util/CustomInput"
import axios from "axios"

const CreateIngredient: React.FC = () => {
    const [ingredient, setIngredient] = useState<Ingredient>({
        Name: "",
        Code: "",
        Amount: 100,
    })
    const [image, setImage] = useState<File | null>(null)

    // Grouping fields into categories
    const proteinFields: (keyof Ingredient)[] = [
        "Protein_plant",
        "Protein_animal",
        "Protein_total",
    ]
    const carbohydrateFields: (keyof Ingredient)[] = [
        "Carbohydrates_mono",
        "Carbohydrates_poli",
        "Carbohydrates_total",
    ]
    const fatFields: (keyof Ingredient)[] = [
        "Fat_saturated",
        "Fat_unsaturated",
        "Fat_total",
    ]
    const mineralFields: (keyof Ingredient)[] = [
        "Mineral_Na",
        "Mineral_K",
        "Mineral_Ca",
        "Mineral_Mg",
        "Mineral_P",
        "Mineral_Fe",
        "Mineral_Zn",
        "Mineral_Cu",
    ]
    const vitaminFields: (keyof Ingredient)[] = [
        "Vitamin_RE",
        "Vitamin_B1",
        "Vitamin_B2",
        "Vitamin_B6",
        "Vitamin_PP",
        "Vitamin_C",
        "Vitamin_E",
    ]
    const otherFields: (keyof Ingredient)[] = [
        "Amount",
        "Kcal",
        "Cholesterol",
        "Ashes",
        "Cellulose",
        "Glycemic_index",
        "Glycemic_load",
        "Atherogenic_index",
    ]

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let imageUrl = ""
        if (image) {
            const formData = new FormData()
            formData.append("files", image)
            try {
                const res = await axios.post(
                    "http://localhost:1337/api/upload", // Strapi upload endpoint
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                )
                imageUrl = res.data[0].url // Get URL of uploaded image
            } catch (error) {
                console.error("Error uploading image:", error)
            }
        }

        const ingredientData = { ...ingredient, image: imageUrl }

        try {
            await axios.post("http://localhost:1337/api/ingredients", {
                data: ingredientData,
            })
            alert("Ingredient created successfully")
        } catch (error) {
            console.error("Error creating ingredient:", error)
        }
    }

    return (
        <div className="ml-[92px] py-[120px]">
            <MainContainer>
                <h1 className="text-DarkGreen font-Poppins text-4xl">
                    Create Ingredient
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex w-full gap-20">
                            <CustomInput
                                placeholder="Enter name"
                                title="Name"
                                type="text"
                                value={ingredient.Name ?? ""}
                                required
                                customWidth="w-[300px]"
                                onChange={(e) =>
                                    setIngredient({
                                        ...ingredient,
                                        Name: e.target.value,
                                    })
                                }
                            />
                            <CustomInput
                                placeholder="Enter code"
                                title="Code"
                                type="text"
                                value={ingredient.Code ?? ""}
                                required
                                customWidth="w-[300px]"
                                onChange={(e) =>
                                    setIngredient({
                                        ...ingredient,
                                        Code: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {/* Other Fields Row */}
                        <div className="flex w-full justify-between">
                            {otherFields.map((key) => (
                                <CustomInput
                                    key={key}
                                    placeholder={`Enter ${key}`}
                                    title={
                                        key[0].toUpperCase() +
                                        key.slice(1).replace(/_/g, " ")
                                    }
                                    type="number"
                                    value={ingredient[key] ?? ""}
                                    onChange={(e) =>
                                        setIngredient({
                                            ...ingredient,
                                            [key]: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        })
                                    }
                                />
                            ))}
                        </div>

                        {/* Protein, Carbohydrates, Fats, Minerals, Vitamins Rows */}
                        <InputGroup
                            fields={proteinFields}
                            ingredient={ingredient}
                            setIngredient={setIngredient}
                        />
                        <InputGroup
                            fields={carbohydrateFields}
                            ingredient={ingredient}
                            setIngredient={setIngredient}
                        />
                        <InputGroup
                            fields={fatFields}
                            ingredient={ingredient}
                            setIngredient={setIngredient}
                        />
                        <InputGroup
                            fields={mineralFields}
                            ingredient={ingredient}
                            setIngredient={setIngredient}
                        />
                        <InputGroup
                            fields={vitaminFields}
                            ingredient={ingredient}
                            setIngredient={setIngredient}
                        />

                        {/* Image Upload */}
                        <div className="text-DarkGreen flex flex-col gap-4">
                            <label className="font-Poppins">Upload Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="border p-2"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex w-full justify-center">
                            <button
                                type="submit"
                                className="rounded bg-green-500 px-6 py-2 font-bold text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </MainContainer>
        </div>
    )
}

const InputGroup: React.FC<{
    fields: (keyof Ingredient)[]
    ingredient: Ingredient
    setIngredient: React.Dispatch<React.SetStateAction<Ingredient>>
}> = ({ fields, ingredient, setIngredient }) => (
    <div className="flex w-full gap-12">
        {fields.map((key) => (
            <CustomInput
                key={key}
                placeholder={`Enter ${key}`}
                title={key[0].toUpperCase() + key.slice(1).replace(/_/g, " ")}
                type="number"
                value={ingredient[key] ?? ""}
                onChange={(e) =>
                    setIngredient({
                        ...ingredient,
                        [key]: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                    })
                }
            />
        ))}
    </div>
)

export default CreateIngredient
