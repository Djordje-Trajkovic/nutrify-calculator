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
}

const SideMenuOption: React.FC<SideMenuOptionProps> = ({
    icon,
    path,
    title,
    isSignOut,
    suboptions,
    isExpanded,
    onToggleExpand,
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
        <div className={`"flex flex-col items-center px-1" ${hasSuboptions && isExpanded ? "bg-[#EEEBDAB2] bg-opacity-70 rounded-lg" : "rounded-lg"}`}>
            <button
                onClick={handleClick}
                className={`group relative flex cursor-pointer items-center justify-center rounded-lg ${
                    isExpanded && hasSuboptions ? "bg-[#EEEBDAB2] bg-opacity-70" : ""
                } ${hasSuboptions ? "h-11 w-auto gap-0.5" : "h-11 w-11"}`}
            >
                <div
                    className={`group-hover:bg-DarkGreen flex h-11 w-[43px] shrink-0 items-center justify-center rounded-lg group-hover:text-white ${
                        isOptionSelected
                            ? "bg-DarkGreen text-white"
                            : "bg-transparent text-[#757575]"
                    } ${
                        isSignOut &&
                        "bg-[#EEEBDAB2] bg-opacity-70 text-[#FF5151] group-hover:bg-[#FF5151]"
                    } transition duration-200 ease-in`}
                >
                    {icon}
                </div>
                {/* Caret indicator right next to the icon for expandable items */}
                {hasSuboptions && (
                    <div className="hidden text-[#757575] md:flex absolute right-0 group-hover:text-white">
                        {isExpanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
                    </div>
                )}
                {/* Hover tooltip - positioned to extend outside container */}
                {title && (
                    <div className="pointer-events-none absolute left-full z-[100] ml-2 hidden min-h-11 rounded-lg opacity-0 transition duration-200 group-hover:flex group-hover:opacity-100">
                        <div className="bg-DarkGreen flex h-full w-full items-center justify-center whitespace-nowrap rounded-lg px-[12px] py-[10px] text-white">
                            {title}
                        </div>
                        <div className="bg-DarkGreen absolute top-[33%] -left-1 h-[12px] w-[12px] rotate-45"></div>
                    </div>
                )}
            </button>
            {/* Desktop Suboptions - Inline (no indentation) */}
            {hasSuboptions && isExpanded && (
                <div className="mt-1 hidden flex-col items-center gap-1 border-l-2 border-[#F6F6F6] md:flex">
                    {suboptions.map((suboption) => (
                        <SideMenuOption
                            key={suboption.path}
                            icon={suboption.icon}
                            path={suboption.path}
                            title={suboption.title}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SideMenuOption
