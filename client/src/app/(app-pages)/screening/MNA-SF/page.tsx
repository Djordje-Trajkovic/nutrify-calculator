"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// MNA-SF Interpretation Texts
const MNA_SF_INTERPRETATIONS = {
    normal:
        "The patient has a normal nutritional status. Continue regular monitoring and maintain a balanced diet. Reassessment is recommended periodically.",
    atRisk:
        "The patient is at risk of malnutrition. A nutritional care plan should be implemented. Dietary counseling and monitoring are recommended. Consider follow-up assessment.",
    malnourished:
        "The patient is malnourished. Immediate nutritional intervention is required. A comprehensive nutritional care plan must be implemented without delay. Close monitoring and frequent reassessment are essential.",
}

// MNA-SF Configuration
const mnaSFConfig: ScreeningConfig = {
    name: "MNA-SF (Mini Nutritional Assessment Short Form)",
    questions: [
        {
            id: "food_intake",
            title: "Decrease in food intake",
            section: "Food Intake",
            options: [
                {
                    label: "severe decrease in food intake",
                    value: 0,
                    description: "Severe decrease in food intake over the past 3 months",
                },
                {
                    label: "moderate",
                    value: 1,
                    description: "Moderate decrease in food intake over the past 3 months",
                },
                {
                    label: "no decrease in food intake",
                    value: 2,
                    description: "No decrease in food intake over the past 3 months",
                },
            ],
        },
        {
            id: "weight_loss",
            title: "Weight loss during the last 3 months",
            section: "Weight Loss",
            options: [
                {
                    label: "> 3 kg",
                    value: 0,
                    description: "Weight loss greater than 3 kg",
                },
                {
                    label: "does not know",
                    value: 1,
                    description: "Patient does not know weight loss amount",
                },
                {
                    label: "1 - 3 kg",
                    value: 2,
                    description: "Weight loss between 1 and 3 kg",
                },
                {
                    label: "no weight loss",
                    value: 3,
                    description: "No weight loss",
                },
            ],
        },
        {
            id: "mobility",
            title: "Mobility",
            section: "Mobility",
            options: [
                {
                    label: "bed or chair bound",
                    value: 0,
                    description: "Patient is bed or chair bound",
                },
                {
                    label: "able to get out of bed / chair but does not go out",
                    value: 1,
                    description: "Patient can get out of bed/chair but does not go outside",
                },
                {
                    label: "goes out",
                    value: 2,
                    description: "Patient goes out",
                },
            ],
        },
        {
            id: "psychological_stress",
            title: "Has suffered psychological stress or acute disease in the past 3 months?",
            section: "Psychological Stress",
            options: [
                {
                    label: "yes",
                    value: 0,
                    description: "Has suffered psychological stress or acute disease",
                },
                {
                    label: "no",
                    value: 2,
                    description: "Has not suffered psychological stress or acute disease",
                },
            ],
        },
        {
            id: "neuropsychological_problems",
            title: "Neuropsychological problems",
            section: "Neuropsychological Problems",
            options: [
                {
                    label: "severe dementia or depression",
                    value: 0,
                    description: "Patient has severe dementia or depression",
                },
                {
                    label: "mild dementia",
                    value: 1,
                    description: "Patient has mild dementia",
                },
                {
                    label: "no psychological problems",
                    value: 2,
                    description: "No psychological problems",
                },
            ],
        },
        {
            id: "bmi",
            title: "Body Mass Index (BMI)",
            section: "BMI",
            options: [
                {
                    label: "BMI < 19",
                    value: 0,
                    description: "BMI less than 19",
                },
                {
                    label: "19 ≤ BMI < 21",
                    value: 1,
                    description: "BMI between 19 and 21 (exclusive)",
                },
                {
                    label: "21 ≤ BMI < 23",
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
    ],
    evaluateScore: (selections) => {
        const foodIntake = Number(selections.food_intake) || 0
        const weightLoss = Number(selections.weight_loss) || 0
        const mobility = Number(selections.mobility) || 0
        const psychologicalStress = Number(selections.psychological_stress) || 0
        const neuropsychologicalProblems = Number(selections.neuropsychological_problems) || 0
        const bmi = Number(selections.bmi) || 0

        const totalScore = foodIntake + weightLoss + mobility + psychologicalStress + neuropsychologicalProblems + bmi

        let interpretation = ""
        let riskLevel = ""

        if (totalScore >= 12) {
            riskLevel = "Normal nutritional status"
            interpretation = MNA_SF_INTERPRETATIONS.normal
        } else if (totalScore >= 8 && totalScore <= 11) {
            riskLevel = "At risk of malnutrition"
            interpretation = MNA_SF_INTERPRETATIONS.atRisk
        } else {
            riskLevel = "Malnourished"
            interpretation = MNA_SF_INTERPRETATIONS.malnourished
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function MNASFPage() {
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
        const evaluationResults = mnaSFConfig.evaluateScore(selections)
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
                        {mnaSFConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Please answer all questions to evaluate nutritional status"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <ScreeningForm
                        questions={mnaSFConfig.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={mnaSFConfig.name}
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
                        screeningName={mnaSFConfig.name}
                        questions={mnaSFConfig.questions}
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
