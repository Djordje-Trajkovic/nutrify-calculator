"use client"
import React, { useEffect } from "react"
import SideMenuOption from "./SideMenuOption"
import {
    CaretLeft,
    CaretRight,
    Carrot,
} from "@phosphor-icons/react"
import { MenuOption } from "@/utils/types"

const ExtendedSideMenu: React.FC = () => {
    const [show, setShow] = React.useState(true)
    const [options, setOptions] = React.useState<MenuOption[]>([])

    useEffect(() => {
        const route = window.location.href.slice(
            window.location.href.indexOf("/", 8) + 1,
            window.location.href.lastIndexOf("/"),
        )
        const menuOptions: MenuOption[] = []
        if (route) {
            switch (route) {
                case "calculator":
                    menuOptions.push(
                        // {
                        //     icon: <Carrot size={20} />,
                        //     title: "Create Ingredient",
                        //     path: "/calculator/create-ingredient",
                        // },
                        // {
                        //     icon: (
                        //         <div className="flex">
                        //             <Carrot size={20} />
                        //             <ArrowFatUp weight="fill" size={14} />
                        //         </div>
                        //     ),
                        //     title: "Update Ingredient",
                        //     path: "/calculator/update-ingredient",
                        // },
                        // {
                        //     icon: <BowlFood size={20} />,
                        //     title: "Create Recipe",
                        //     path: "/calculator/create-recipe",
                        // },
                        // {
                        //     icon: (
                        //         <div className="flex">
                        //             <BowlFood size={20} />
                        //             <ArrowFatUp weight="fill" size={14} />
                        //         </div>
                        //     ),
                        //     title: "Update Recipe",
                        //     path: "/calculator/update-recipe",
                        // },
                        {
                            icon: <Carrot size={20} />,
                            title: "Create Meal Plan",
                            path: "/calculator/meal",
                        },
                    )
                    break
            }
        }

        setOptions(menuOptions)
    }, [])
    if (!options.length) return null
    return (
        <div
            className={`frex-col fixed z-20 ${!show && "md:-translate-x-[92px]"} top-19 flex h-full items-center transition duration-200 md:left-[92px]`}
        >
            <div
                className={`flex h-full w-[92px] flex-col items-center justify-between gap-6 bg-white p-6  ${show? "shadow-[0_0_8px_rgba(0,0,0,0.25)]" : ""}`}
            >
                <div className="flex flex-col items-center gap-6">
                    {options.map((option) => (
                        <SideMenuOption
                            key={option.title}
                            icon={option.icon}
                            path={option.path}
                            title={option.title}
                        />
                    ))}
                </div>
            </div>
            <button
                onClick={() => setShow(!show)}
                className={`hover:bg-DarkGreen relative mb-40 flex h-16 w-6 items-center justify-center rounded-r-2xl bg-gray-50 py-10 text-gray-500 transition duration-200 select-none shadow-[0_0_8px_rgba(0,0,0,0.25)] -z-10 hover:border-white hover:text-white`}
            >
                {show ? <CaretLeft size={20} /> : <CaretRight size={20} />}
            </button>
        </div>
    )
}

export default ExtendedSideMenu
