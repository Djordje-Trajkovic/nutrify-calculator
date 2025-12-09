"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import SideMenuOption from "./SideMenuOption"
import {
    Barbell,
    Calculator,
    ForkKnife,
    Gear,
    HouseSimple,
    Notebook,
    SignOut,
    Carrot,
    X,
    MonitorArrowUp,
    Book,
    UsersThree,
    BookOpenText,
} from "@phosphor-icons/react"
import { MenuOption } from "@/utils/types"
import Cookies from "js-cookie"
import { useRouter, usePathname } from "next/navigation"

const SideMenu: React.FC = () => {
    const [menuOptions, setMenuOptions] = useState<MenuOption[]>([])
    const [expandedItem, setExpandedItem] = useState<string | null>(null)
    const [mobileModalOption, setMobileModalOption] =
        useState<MenuOption | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = Cookies.get("jwtNutrifyS")

            if (token) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me?populate=*`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    )

                    if (res.ok) {
                        const data = await res.json()
                        const role = data.role?.name
                        const options: MenuOption[] = []

                        if (role === "Nutritionist") {
                            options.push(
                                {
                                    icon: <HouseSimple size={20} />,
                                    title: "Dashboard",
                                    path: "/dashboard",
                                },
                                {
                                    icon: <Carrot size={20} />,
                                    title: "Create Meal Plan",
                                    path: "/meal-calculator",
                                },
                                {
                                    icon: <MonitorArrowUp size={20} />,
                                    title: "Screening Tools",
                                    path: "/screening",
                                },
                                {
                                    icon: <Calculator size={20} />,
                                    title: "Calculators",
                                    path: "/calculator",
                                },
                                {
                                    icon: <BookOpenText size={20} />,
                                    title: "Dietetics",
                                    path: "/dietetics",
                                },
                                {
                                    icon: <UsersThree size={20} />,
                                    title: "Clients",
                                    path: "/clients",
                                },
                            )
                        } else if (role === "User-Free") {
                            options.push(
                                {
                                    icon: <HouseSimple size={20} />,
                                    title: "Dashboard",
                                    path: "/dashboard",
                                },
                                {
                                    icon: <Notebook size={20} />,
                                    title: "Diary",
                                    path: "/diary",
                                },
                                {
                                    icon: <ForkKnife size={20} />,
                                    title: "Nutrition",
                                    path: "/nutrition",
                                },
                                {
                                    icon: <Barbell size={20} />,
                                    title: "Workout",
                                    path: "/workout",
                                },
                            )
                        }
                        setMenuOptions(options)
                    } else {
                        console.error("Failed to fetch user data")
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }

        fetchUserRole()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Auto-expand calculator if on calculator route
    useEffect(() => {
        if (pathname.startsWith("/calculator")) {
            setExpandedItem("/calculator")
        }
    }, [pathname])

    const handleToggleExpand = (path: string) => {
        setExpandedItem(expandedItem === path ? null : path)
    }

    const handleMobileOptionClick = (option: MenuOption) => {
        if (option.suboptions && option.suboptions.length > 0) {
            setMobileModalOption(option)
        } else {
            router.push(option.path)
        }
    }

    const handleMobileSuboptionClick = (path: string) => {
        router.push(path)
        setMobileModalOption(null)
    }

    const handleSignOut = () => {
        Cookies.remove("jwtNutrifyS")
        router.push("/login")
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="fixed top-0 left-0 z-40 hidden h-screen w-[92px] flex-col items-center justify-between gap-6 overflow-visible bg-white p-6 shadow-[0_0_8px_rgba(0,0,0,0.25)] md:flex">
                <div className="flex w-full flex-col items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center">
                        <Image
                            src="https://res.cloudinary.com/dwiuj7jqw/image/upload/t_upscale_and_bmp/Screenshot_2025_05_08_at_13_42_03_e0cc206919"
                            alt="logo"
                            width={128}
                            height={128}
                        />
                    </div>
                    <div className="h-[2px] w-full bg-[#F6F6F6]"></div>
                    <span className="font-Poppins text-[10px] font-medium text-[#757575]">
                        MAIN
                    </span>
                    {menuOptions.map((option) => (
                        <SideMenuOption
                            key={option.title}
                            icon={option.icon}
                            path={option.path}
                            title={option.title}
                            suboptions={option.suboptions}
                            isExpanded={expandedItem === option.path}
                            onToggleExpand={() =>
                                handleToggleExpand(option.path)
                            }
                        />
                    ))}
                    <div className="h-[2px] w-full bg-[#F6F6F6]"></div>
                    <div>
                        <span className="font-Poppins text-[10px] font-medium text-[#757575]">
                            SETTINGS
                        </span>
                        <SideMenuOption
                            icon={<Gear size={20} />}
                            path="/settings"
                        />
                    </div>
                </div>
                <div>
                    <SideMenuOption
                        icon={<SignOut size={20} />}
                        path="/"
                        isSignOut={true}
                    />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed right-0 bottom-0 left-0 z-40 flex h-[72px] w-full flex-row items-center justify-between bg-white px-[24px] shadow-[0_0_8px_rgba(0,0,0,0.25)] md:hidden">
                {menuOptions.map((option) => {
                    const isActive = pathname.startsWith(option.path)
                    return (
                        <button
                            key={option.title}
                            onClick={() => handleMobileOptionClick(option)}
                            className={`flex h-11 w-11 items-center justify-center rounded-lg transition duration-200 ${
                                isActive
                                    ? "bg-DarkGreen text-white"
                                    : "hover:bg-DarkGreen bg-transparent text-[#757575] hover:text-white"
                            }`}
                        >
                            {option.icon}
                        </button>
                    )
                })}
                <button
                    onClick={() => router.push("/settings")}
                    className={`flex h-11 w-11 items-center justify-center rounded-lg transition duration-200 ${
                        pathname === "/settings"
                            ? "bg-DarkGreen text-white"
                            : "hover:bg-DarkGreen bg-transparent text-[#757575] hover:text-white"
                    }`}
                >
                    <Gear size={20} />
                </button>
                <button
                    onClick={handleSignOut}
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-[#FF5151] transition duration-200 hover:bg-[#FF5151] hover:text-white"
                >
                    <SignOut size={20} />
                </button>
            </div>

            {/* Mobile Modal for Suboptions */}
            {mobileModalOption && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-xs md:hidden"
                    onClick={() => setMobileModalOption(null)}
                >
                    <div
                        className="animate-modal-from-bottom w-full rounded-t-xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-Poppins text-DarkGreen text-lg font-semibold">
                                {mobileModalOption.title}
                            </h3>
                            <button
                                onClick={() => setMobileModalOption(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {mobileModalOption.suboptions?.map((suboption) => {
                                const isActive = pathname === suboption.path
                                return (
                                    <button
                                        key={suboption.path}
                                        onClick={() =>
                                            handleMobileSuboptionClick(
                                                suboption.path,
                                            )
                                        }
                                        className={`flex items-center gap-3 rounded-lg p-3 transition duration-200 ${
                                            isActive
                                                ? "bg-DarkGreen text-white"
                                                : "hover:bg-DarkGreen bg-gray-50 text-[#757575] hover:text-white"
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center">
                                            {suboption.icon}
                                        </div>
                                        <span className="font-Poppins text-sm font-medium">
                                            {suboption.title}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SideMenu
