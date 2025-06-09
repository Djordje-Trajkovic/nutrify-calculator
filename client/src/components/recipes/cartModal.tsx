"use client"

import { useState } from "react"
import { useCartModal as useCartModalCtx } from "./cartModalCtx"

import Image from "next/image"
import { ForkKnife } from "@phosphor-icons/react"
import ParametarsIcon from "../util/ParametarsIcon"
import GeneralModalComponent from "../util/GeneralModalComponent"

const CartModal = ({}) => {
    const {
        closeModal,
        recipesInPlan,
        removeRecipeFromPlan,
        updateRecipeDate,
        resetCart,
    } = useCartModalCtx()

    const [closeModalFn, setCloseModalFn] = useState<() => void>(() => () => {})

    const handleSubmit = () => {
        // Add logic to send data, like an API request or anything else
        console.log("Submitting data", recipesInPlan)
        resetCart()
        closeModalFn() 
        // Example:
        // sendData(mealsInPlan);
    }

    return (
        <form>
            <GeneralModalComponent closeGeneralModal={closeModal}     sideMenu={true}        onReady={(action) => setCloseModalFn(() => action)} // setujemo funkciju
            >
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-DarkGreen text-2xl font-medium">
                            Selected Meals
                        </h2>
                        <button
                            type="button"
                            onClick={closeModalFn}
                            className="text-xl font-bold text-gray-500 hover:text-red-600"
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>

                    <div className="mb-[60px] flex-grow overflow-y-auto">
                        {recipesInPlan.length > 0 ? (
                            recipesInPlan.map((recipePlan, index) => (
                                <div
                                    key={index}
                                    className="mt-4 flex flex-col gap-4"
                                >
                                    <h3 className="text-DarkGreen text-lg font-medium">
                                        { "Meal Category"}
                                    </h3>
                                    <div className="relative h-[190px] w-full overflow-clip rounded-xl">
                                        {recipePlan.recipe.Image ? (
                                            <Image
                                                src={typeof recipePlan.recipe.Image === "string" ? recipePlan.recipe.Image : recipePlan.recipe.Image?.url ?? ""}
                                                alt={recipePlan.recipe.Name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-[190px] w-full items-center justify-center rounded-xl bg-[#F5F5F5]">
                                                <ForkKnife
                                                    color="#00000033"
                                                    size={80}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-DarkGreen text-xl font-medium">
                                        {recipePlan.recipe.Name}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-row items-center">
                                            <ParametarsIcon
                                                parametarName={"Calories"}
                                                iconSize={14}
                                                containerSize={24}
                                            />
                                            <p className="ml-2 text-sm font-medium text-[#2D3748]">
                                                {recipePlan.recipe?.TotalKcal?.toFixed(0) ??
                                                    0}
                                                kcal
                                            </p>
                                        </div>
                                        <div className="flex flex-row items-center">
                                            <ParametarsIcon
                                                parametarName={"Proteins"}
                                                iconSize={14}
                                                containerSize={24}
                                            />
                                            <p className="ml-2 text-sm font-medium text-[#2D3748]">
                                                {recipePlan.recipe.TotalProtein?.toFixed(0) ??
                                                    0}
                                                g
                                            </p>
                                        </div>
                                        <div className="flex flex-row items-center">
                                            <ParametarsIcon
                                                parametarName={"Fats"}
                                                iconSize={14}
                                                containerSize={24}
                                            />
                                            <p className="ml-2 text-sm font-medium text-[#2D3748]">
                                                {recipePlan.recipe?.TotalFat?.toFixed(0) ?? 0}g
                                            </p>
                                        </div>
                                        <div className="flex flex-row items-center">
                                            <ParametarsIcon
                                                parametarName={"Carbohydrates"}
                                                iconSize={14}
                                                containerSize={24}
                                            />
                                            <p className="ml-2 text-sm font-medium text-[#2D3748]">
                                                { recipePlan.recipe?.TotalCarbohydrates?.toFixed(0) ??  0}
                                                g
                                            </p>
                                        </div>
                                    </div>
                                    <div className="my-2 h-[1px] w-full bg-[#D9D9D9]"></div>
                                    <button
                                        type="button"
                                        className="bg-LightGreen flex h-[40px] w-full items-center justify-center rounded-lg px-[24px] py-[8px] text-sm text-[#FFFFFF]"
                                        onClick={() =>
                                            removeRecipeFromPlan(index)
                                        }
                                    >
                                        Remove Meal -
                                    </button>
                                    <input
                                        type="date"
                                        className="text-DarkGreen h-[40px] w-full rounded-lg border-none bg-[#EEEBDA] px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#EEEBDA] focus:outline-none"
                                        value={
                                            recipePlan.dateWhenPlanned
                                                ? recipePlan.dateWhenPlanned
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            updateRecipeDate(
                                                index,
                                                new Date(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                            ))
                        ) : (
                            <div>No meals in cart</div>
                        )}
                        {recipesInPlan.length !== 0 && (
                            <button
                                type="button"
                                className="bg-LightGreen w-max-fit absolute right-[24px] bottom-[24px] left-[24px] h-[40px] rounded-lg text-sm text-white"
                                onClick={handleSubmit}
                            >
                                Add All
                            </button>
                        )}
                    </div>

                    </GeneralModalComponent>
        </form>
    )
}

export default CartModal
