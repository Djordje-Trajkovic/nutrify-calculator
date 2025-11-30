"use client"
import { useRouter, usePathname } from "next/navigation"
import React from "react"
import Cookies from "js-cookie"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { MenuOption } from "@/utils/types"

type SideMenuOptionProps = {
    icon: React.ReactNode
    title?: string
    path: string
    isSignOut?: boolean
    suboptions?: MenuOption[]
    isExpanded?: boolean
    onToggleExpand?: () => void
    isSuboption?: boolean
}

const SideMenuOption: React.FC<SideMenuOptionProps> = ({
    icon,
    path,
    title,
    isSignOut,
    suboptions,
    isExpanded,
    onToggleExpand,
    isSuboption,
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const hasSuboptions = suboptions && suboptions.length > 0

    // Check if this option is selected:
    // - Exact path match, OR
    // - Path starts with this path (for nested routes) but not for root "/" and not for parent items with suboptions
    const isOptionSelected = pathname === path || (pathname.startsWith(path) && path !== "/" && !hasSuboptions)

    const handleClick = async () => {
        if (isSignOut) {
            Cookies.remove("jwtNutrifyS")
            router.push("/login")
            return
        }

        if (hasSuboptions && onToggleExpand) {
            onToggleExpand()
        } else {
            router.push(path)
        }
    }

    return (
        <div className="flex flex-col">
            <button
                onClick={handleClick}
                className={`group flex cursor-pointer items-center gap-3 rounded-lg ${
                    isSuboption ? "h-10 w-full" : "h-11 w-11"
                }`}
            >
                <div
                    className={`group-hover:bg-DarkGreen flex shrink-0 items-center justify-center rounded-lg group-hover:text-white ${
                        isSuboption ? "h-10 w-10" : "h-11 w-[43px]"
                    } ${
                        isOptionSelected
                            ? "bg-DarkGreen text-white"
                            : isExpanded && hasSuboptions
                              ? "bg-DarkGreen/20 text-DarkGreen"
                              : "bg-transparent text-[#757575]"
                    } ${
                        isSignOut &&
                        "bg-gray-100 text-[#FF5151] group-hover:bg-[#FF5151]"
                    } transition duration-200 ease-in`}
                >
                    {icon}
                </div>
                {title && (
                    <div className="relative z-50 hidden min-h-11 rounded-lg transition duration-200 group-hover:flex">
                        <div className="bg-DarkGreen flex h-full w-full items-center justify-center rounded-lg px-[12px] py-[10px] text-white">
                            {title}
                        </div>
                        <div className="bg-DarkGreen absolute top-[33%] -left-1 h-[12px] w-[12px] rotate-45"></div>
                    </div>
                )}
                {hasSuboptions && (
                    <div className="ml-auto hidden text-[#757575] md:block">
                        {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
                    </div>
                )}
            </button>
            {/* Desktop Suboptions - Inline */}
            {hasSuboptions && isExpanded && (
                <div className="ml-2 mt-2 hidden flex-col gap-2 border-l-2 border-[#F6F6F6] pl-2 md:flex">
                    {suboptions.map((suboption) => (
                        <SideMenuOption
                            key={suboption.path}
                            icon={suboption.icon}
                            path={suboption.path}
                            title={suboption.title}
                            isSuboption={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SideMenuOption
