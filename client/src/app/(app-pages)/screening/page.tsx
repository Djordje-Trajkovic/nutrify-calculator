import AppContainer from "@/components/util/AppContainer"
import Link from "next/link"

export default function ScreeningPage() {
    const screeningOptions = [
        {
            title: "NRS 2002",
            description: "Nutritional Risk Screening 2002",
            href: "/screening/NRS_2002",
        },
        {
            title: "MUST",
            description: "Malnutrition Universal Screening Tool",
            href: "/screening/MUST",
        },
        {
            title: "MST",
            description: "Malnutrition Screening Tool",
            href: "/screening/MST",
        },
        {
            title: "PG_SGA",
            description: "Patient-Generated Subjective Global Assessment",
            href: "/screening/PG_SGA",
        },
        {
            title: "MNA-LF",
            description: "Mini Nutritional Assessment - Long Form",
            href: "/screening/MNA-LF",
        },
        {
            title: "MNA-SF",
            description: "Mini Nutritional Assessment - Short Form",
            href: "/screening/MNA-SF",
        },
        {
            title: "SARC-F",
            description: "Sarcopenia Screening Tool",
            href: "/screening/SARC-F",
        },
        {
            title: "GLIM",
            description: "Global Leadership Initiative on Malnutrition",
            href: "/screening/GLIM",
        },
        {
            title: "SNAQ_65+",
            description: "Short Nutritional Assessment Questionnaire for 65+",
            href: "/screening/SNAQ_65+",
        },
    ]

    return (
        <AppContainer>
            <h1 className="mb-6 text-3xl font-bold">Select Screening Tool</h1>
            <p className="text-DarkGreen mb-8">
                Choose a nutritional screening assessment tool to begin
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {screeningOptions.map((option) => (
                    <Link
                        key={option.href}
                        href={option.href}
                        className="block rounded-lg border border-gray-200 bg-white p-6 shadow transition-colors hover:bg-gray-50"
                    >
                        <h2 className="mb-2 text-xl font-semibold">
                            {option.title}
                        </h2>
                        <p className="text-DarkGreen">{option.description}</p>
                    </Link>
                ))}
            </div>
        </AppContainer>
    )
}
