"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// MNA-LF Interpretation Texts
const MNALF_INTERPRETATIONS = {
    normal:
        "The patient has normal nutritional status with a score of 24-30 points. Continue routine monitoring and maintain a balanced diet.",
    atRisk:
        "The patient is at risk of malnutrition with a score of 17-23.5 points. Implement preventive measures, provide nutritional counseling, and monitor regularly. Consider dietary modifications and nutritional supplementation.",
    malnourished:
        "The patient is malnourished with a score of less than 17 points. Immediate nutritional intervention is required. Comprehensive nutritional care plan must be implemented. Close monitoring and frequent reassessment are essential.",
}

// MNA-LF Configuration
const mnalfConfig: ScreeningConfig = {
    name: "MNA-LF (Mini Nutritional Assessment - Long Form)",
    questions: [
        {
            id: "bmi",
            title: "Body Mass Index (BMI) in kg/m²",
            section: "Anthropometric Assessment",
            options: [
                {
                    label: "BMI < 19",
                    value: 0,
                    description: "BMI less than 19",
                },
                {
                    label: "BMI 19 to < 21",
                    value: 1,
                    description: "BMI between 19 and 21 (exclusive)",
                },
                {
                    label: "BMI 21 to < 23",
                    value: 2,
                    description: "BMI between 21 and 23 (exclusive)",
                },
                {
                    label: "BMI ≥ 23",
                    value: 3,
                    description: "BMI 23 or greater",
                },
            ],
        },
        {
            id: "mid_arm_circumference",
            title: "Mid-arm circumference (MAC) in cm",
            section: "Anthropometric Assessment",
            options: [
                {
                    label: "MAC < 21",
                    value: 0,
                    description: "Mid-arm circumference less than 21 cm",
                },
                {
                    label: "MAC 21 to 22",
                    value: 0.5,
                    description: "Mid-arm circumference 21 to 22 cm",
                },
                {
                    label: "MAC > 22",
                    value: 1,
                    description: "Mid-arm circumference greater than 22 cm",
                },
            ],
        },
        {
            id: "calf_circumference",
            title: "Calf circumference (CC) in cm",
            section: "Anthropometric Assessment",
            options: [
                {
                    label: "CC < 31",
                    value: 0,
                    description: "Calf circumference less than 31 cm",
                },
                {
                    label: "CC ≥ 31",
                    value: 1,
                    description: "Calf circumference 31 cm or greater",
                },
            ],
        },
        {
            id: "weight_loss",
            title: "Weight loss during the last 3 months",
            section: "Anthropometric Assessment",
            options: [
                {
                    label: "Weight loss > 3 kg",
                    value: 0,
                    description: "Weight loss greater than 3 kg",
                },
                {
                    label: "Does not know",
                    value: 1,
                    description: "Patient does not know weight loss amount",
                },
                {
                    label: "Weight loss 1-3 kg",
                    value: 2,
                    description: "Weight loss between 1 and 3 kg",
                },
                {
                    label: "No weight loss",
                    value: 3,
                    description: "No weight loss",
                },
            ],
        },
        {
            id: "lives_independently",
            title: "Lives independently (not in nursing home or hospital)",
            section: "General Assessment",
            options: [
                {
                    label: "No",
                    value: 0,
                    description: "Does not live independently",
                },
                {
                    label: "Yes",
                    value: 1,
                    description: "Lives independently",
                },
            ],
        },
        {
            id: "takes_medications",
            title: "Takes more than 3 prescription drugs per day",
            section: "General Assessment",
            options: [
                {
                    label: "Yes",
                    value: 0,
                    description: "Takes more than 3 prescription drugs per day",
                },
                {
                    label: "No",
                    value: 1,
                    description: "Takes 3 or fewer prescription drugs per day",
                },
            ],
        },
        {
            id: "psychological_stress",
            title: "Psychological stress or acute disease in the past 3 months",
            section: "General Assessment",
            options: [
                {
                    label: "Yes",
                    value: 0,
                    description: "Has suffered psychological stress or acute disease",
                },
                {
                    label: "No",
                    value: 2,
                    description: "No psychological stress or acute disease",
                },
            ],
        },
        {
            id: "full_meals",
            title: "How many full meals does the patient eat daily?",
            section: "Dietary Assessment",
            options: [
                {
                    label: "1 meal",
                    value: 0,
                    description: "One full meal per day",
                },
                {
                    label: "2 meals",
                    value: 1,
                    description: "Two full meals per day",
                },
                {
                    label: "3 meals",
                    value: 2,
                    description: "Three full meals per day",
                },
            ],
        },
        {
            id: "protein_intake",
            title: "Protein intake markers (at least one serving of dairy products, beans, eggs, meat, fish or poultry per day)",
            section: "Dietary Assessment",
            options: [
                {
                    label: "0-1 yes",
                    value: 0,
                    description: "0 or 1 protein source per day",
                },
                {
                    label: "2 yes",
                    value: 0.5,
                    description: "2 protein sources per day",
                },
                {
                    label: "3 yes",
                    value: 1,
                    description: "3 protein sources per day",
                },
            ],
        },
        {
            id: "fruits_vegetables",
            title: "Consumes two or more servings of fruits or vegetables per day?",
            section: "Dietary Assessment",
            options: [
                {
                    label: "No",
                    value: 0,
                    description: "Does not consume two or more servings",
                },
                {
                    label: "Yes",
                    value: 1,
                    description: "Consumes two or more servings",
                },
            ],
        },
        {
            id: "fluid_intake",
            title: "How much fluid (water, juice, coffee, tea, milk) is consumed per day?",
            section: "Dietary Assessment",
            options: [
                {
                    label: "Less than 3 cups",
                    value: 0,
                    description: "Less than 3 cups per day",
                },
                {
                    label: "3 to 5 cups",
                    value: 0.5,
                    description: "3 to 5 cups per day",
                },
                {
                    label: "More than 5 cups",
                    value: 1,
                    description: "More than 5 cups per day",
                },
            ],
        },
        {
            id: "mode_of_feeding",
            title: "Mode of feeding",
            section: "Dietary Assessment",
            options: [
                {
                    label: "Unable to eat without assistance",
                    value: 0,
                    description: "Unable to eat without assistance",
                },
                {
                    label: "Self-fed with some difficulty",
                    value: 1,
                    description: "Self-fed with some difficulty",
                },
                {
                    label: "Self-fed without any problem",
                    value: 2,
                    description: "Self-fed without any problem",
                },
            ],
        },
        {
            id: "self_view_nutrition",
            title: "Self-view of nutritional status",
            section: "Self Assessment",
            options: [
                {
                    label: "Views self as being malnourished",
                    value: 0,
                    description: "Believes self to be malnourished",
                },
                {
                    label: "Is uncertain of nutritional state",
                    value: 1,
                    description: "Uncertain about nutritional state",
                },
                {
                    label: "Views self as having no nutritional problem",
                    value: 2,
                    description: "Believes to have no nutritional problem",
                },
            ],
        },
        {
            id: "health_comparison",
            title: "In comparison with other people of the same age, how does the patient consider their health status?",
            section: "Self Assessment",
            options: [
                {
                    label: "Not as good",
                    value: 0,
                    description: "Health not as good as others",
                },
                {
                    label: "Does not know",
                    value: 0.5,
                    description: "Uncertain about health comparison",
                },
                {
                    label: "As good",
                    value: 1,
                    description: "Health as good as others",
                },
                {
                    label: "Better",
                    value: 2,
                    description: "Health better than others",
                },
            ],
        },
        {
            id: "mobility",
            title: "Mobility",
            section: "Functional Assessment",
            options: [
                {
                    label: "Bed or chair bound",
                    value: 0,
                    description: "Patient is bed or chair bound",
                },
                {
                    label: "Able to get out of bed/chair but does not go out",
                    value: 1,
                    description: "Can get out of bed/chair but stays indoors",
                },
                {
                    label: "Goes out",
                    value: 2,
                    description: "Goes out independently",
                },
            ],
        },
        {
            id: "neuropsychological_problems",
            title: "Neuropsychological problems",
            section: "Functional Assessment",
            options: [
                {
                    label: "Severe dementia or depression",
                    value: 0,
                    description: "Severe dementia or depression",
                },
                {
                    label: "Mild dementia",
                    value: 1,
                    description: "Mild dementia",
                },
                {
                    label: "No psychological problems",
                    value: 2,
                    description: "No neuropsychological problems",
                },
            ],
        },
        {
            id: "pressure_sores",
            title: "Pressure sores or skin ulcers",
            section: "Functional Assessment",
            options: [
                {
                    label: "Yes",
                    value: 0,
                    description: "Has pressure sores or skin ulcers",
                },
                {
                    label: "No",
                    value: 1,
                    description: "No pressure sores or skin ulcers",
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const bmi = Number(selections.bmi) || 0
        const midArmCircumference = Number(selections.mid_arm_circumference) || 0
        const calfCircumference = Number(selections.calf_circumference) || 0
        const weightLoss = Number(selections.weight_loss) || 0
        const livesIndependently = Number(selections.lives_independently) || 0
        const takesMedications = Number(selections.takes_medications) || 0
        const psychologicalStress = Number(selections.psychological_stress) || 0
        const fullMeals = Number(selections.full_meals) || 0
        const proteinIntake = Number(selections.protein_intake) || 0
        const fruitsVegetables = Number(selections.fruits_vegetables) || 0
        const fluidIntake = Number(selections.fluid_intake) || 0
        const modeOfFeeding = Number(selections.mode_of_feeding) || 0
        const selfViewNutrition = Number(selections.self_view_nutrition) || 0
        const healthComparison = Number(selections.health_comparison) || 0
        const mobility = Number(selections.mobility) || 0
        const neuropsychologicalProblems = Number(selections.neuropsychological_problems) || 0
        const pressureSores = Number(selections.pressure_sores) || 0

        const totalScore = bmi + midArmCircumference + calfCircumference + weightLoss +
                          livesIndependently + takesMedications + psychologicalStress +
                          fullMeals + proteinIntake + fruitsVegetables + fluidIntake +
                          modeOfFeeding + selfViewNutrition + healthComparison + mobility +
                          neuropsychologicalProblems + pressureSores

        let interpretation = ""
        let riskLevel = ""

        if (totalScore >= 24) {
            riskLevel = "Normal nutritional status"
            interpretation = MNALF_INTERPRETATIONS.normal
        } else if (totalScore >= 17) {
            riskLevel = "At risk of malnutrition"
            interpretation = MNALF_INTERPRETATIONS.atRisk
        } else {
            riskLevel = "Malnourished"
            interpretation = MNALF_INTERPRETATIONS.malnourished
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function MNALFPage() {
    const [view, setView] = useState<"form" | "results">("form")
    const [selections, setSelections] = useState<
        Record<string, string | number>
    >({})
    const [results, setResults] = useState<{
        score: number
        interpretation: string
        riskLevel: string
    } | null>(null)
    const [showPDFModal, setShowPDFModal] = useState(false)

    const handleSelectionChange = (
        questionId: string,
        value: string | number,
    ) => {
        setSelections((prev) => ({
            ...prev,
            [questionId]: value,
        }))
    }

    const handleEvaluate = () => {
        const evaluationResults = mnalfConfig.evaluateScore(selections)
        setResults(evaluationResults)
        setView("results")
    }

    const handleEditData = () => {
        setView("form")
    }

    const handlePrintPage = () => {
        setShowPDFModal(true)
    }

    return (
        <AppContainer>
            <Box sx={{ minHeight: "100vh", paddingY: 4 }}>
                {/* Page Header */}
                <Box sx={{ marginBottom: 4, textAlign: "center" }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: "#00473C",
                            fontWeight: 700,
                            marginBottom: 1,
                            fontSize: { xs: "1.75rem", sm: "2.5rem" },
                        }}
                    >
                        {mnalfConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Please answer all 17 questions to evaluate nutritional status"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <ScreeningForm
                        questions={mnalfConfig.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={mnalfConfig.name}
                            score={results.score}
                            interpretation={results.interpretation}
                            riskLevel={results.riskLevel}
                            onEditData={handleEditData}
                            onPrintPage={handlePrintPage}
                        />
                    )
                )}

                {/* PDF Preview Modal */}
                {results && (
                    <ScreeningPDFPreviewModal
                        open={showPDFModal}
                        onClose={() => setShowPDFModal(false)}
                        screeningName={mnalfConfig.name}
                        questions={mnalfConfig.questions}
                        selections={selections}
                        score={results.score}
                        interpretation={results.interpretation}
                        riskLevel={results.riskLevel}
                    />
                )}
            </Box>
        </AppContainer>
    )
}
