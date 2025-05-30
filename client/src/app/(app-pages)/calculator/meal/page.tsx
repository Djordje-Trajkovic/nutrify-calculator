import CalculateMeal from "@/components/calculatemeal/CalculateMeal"
import Header from "@/components/util/AppHeader"
import AppContainer from "@/components/util/AppContainer"
import SideMenu from "@/components/util/SideMenu"
import React from "react"
const HomePage: React.FC = () => {
    return (
        <div className="h-full min-h-screen bg-[#FAF9F6]">
            <SideMenu />
            <Header />
            <AppContainer>
                <CalculateMeal />
            </AppContainer>
        </div>
    )
}

export default HomePage
