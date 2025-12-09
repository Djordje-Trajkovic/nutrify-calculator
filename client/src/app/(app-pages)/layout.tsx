import Header from "@/components/util/AppHeader"
import SideMenu from "@/components/util/SideMenu"
import React from "react"

export default function AppPagesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full min-h-screen w-full bg-[#FAF9F6]">
            <SideMenu />
            <Header />
            <div className="bg-[#FAF9F6] pt-[100px] pb-10">
                {children}
            </div>
        </div>
    )
}
