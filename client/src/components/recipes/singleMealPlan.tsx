import { ForkKnife } from "@phosphor-icons/react"
import Image from "next/image"

import { Recipe } from "@/utils/types"

//import nekaslika from "../../../public/picture1.png"
import ParametarsIcon from "../util/ParametarsIcon"
//import { useEffect, useState } from "react"

import avatarImage from "../../../public/avatarImage.jpeg"
import { useCartModal as useCartModalCtx } from "./cartModalCtx"
import { calculatreRecipeParametars } from "@/utils/calculateRecipeParametars"


type SingleMealPlanProp = {
    recipe: Recipe
}

export type Author = {
    id: string
    name: string
    image: string
}

//const authorFetch = { id: "23", name: "Filip", image: "" }

const SingleMealPlan: React.FC<SingleMealPlanProp> = ({ recipe }) => {
    const { addMealToPlan } = useCartModalCtx()

    const recomended = false

    //console.log("Recipe from single meal plan", recipe)

    const totalParametars = calculatreRecipeParametars(recipe)

  


    return (
        <div className="shadow-Combined font-Poppins flex h-full cursor-pointer flex-col justify-between gap-[10px] rounded-xl bg-[#FFFFFF] p-[24px] text-black">
            <div className="relative h-[190px] w-full overflow-clip rounded-xl">
                {recipe?.image ? (
                    <Image
                        src={recipe.image}
                        alt={recipe.Name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-[190px] w-full items-center justify-center rounded-xl bg-[#F5F5F5]">
                        <ForkKnife color="#00000033" size={80} />
                    </div>
                )}

                {/* Slika autora u desnom gornjem kutu unutar slike obroka */}
                {recomended && (
                    <div className="absolute top-2 right-2 h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                        <Image
                            src={ avatarImage} // if recomended by nutricionist show his photo 
                            alt={"Author"}
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
            <h2 className="text-DarkGreen text-xl font-medium">
                {recipe.Name ?? "Recipe Name"}
            </h2>
            <p className="min-h-[140px] text-sm leading-[140%] font-normal text-[#A0AEC0]">
                {recipe.ShortDescription
                    ? recipe.ShortDescription.length > 255
                        ? recipe.ShortDescription.slice(0, 255) + "..."
                        : recipe.ShortDescription
                    : "Description of your meal..."}
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-row items-center">
                    <ParametarsIcon
                        parametarName={"Calories"}
                        iconSize={14}
                        containerSize={24}
                    />
                    <p className="ml-2 text-sm font-medium text-[#2D3748]">
                        {totalParametars.kcal.toFixed(0) ?? 0} kcal
                    </p>
                </div>
                <div className="flex flex-row items-center">
                    <ParametarsIcon
                        parametarName={"Proteins"}
                        iconSize={14}
                        containerSize={24}
                    />
                    <p className="ml-2 text-sm font-medium text-[#2D3748]">
                        {totalParametars.protein.toFixed(0) ?? 0} g
                    </p>
                </div>
                <div className="flex flex-row items-center">
                    <ParametarsIcon
                        parametarName={"Fats"}
                        iconSize={14}
                        containerSize={24}
                    />
                    <p className="ml-2 text-sm font-medium text-[#2D3748]">
                        {totalParametars.fat.toFixed(0) ?? 0} g
                    </p>
                </div>
                <div className="flex flex-row items-center">
                    <ParametarsIcon
                        parametarName={"Carbohydrates"}
                        iconSize={14}
                        containerSize={24}
                    />
                    <p className="ml-2 text-sm font-medium text-[#2D3748]">
                        {totalParametars.carbohydrates.toFixed(0) ?? 0} g
                    </p>
                </div>
            </div>
            <div className="my-2 h-[1px] w-full bg-[#D9D9D9]"></div>
            <button className="bg-LightGreen flex h-[40px] w-full items-center justify-center rounded-lg px-[24px] py-[8px] text-sm text-[#FFFFFF]" onClick={()=>addMealToPlan(recipe)}>
                Add Meall +
            </button>
        </div>
    )
}

export default SingleMealPlan
