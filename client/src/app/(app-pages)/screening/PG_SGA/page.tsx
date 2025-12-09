"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// PG-SGA Interpretation Texts
const PGSGA_INTERPRETATIONS = {
    wellNourished:
        "The patient is well-nourished with a score of 0-1. Continue routine monitoring of nutritional status.",
    suspectedModerate:
        "The patient has suspected or moderate malnutrition with a score of 2-3. Consider nutritional intervention and monitoring. Consult with a dietitian for assessment and care planning.",
    severe:
        "The patient has severe malnutrition with a score of 4-8. Immediate nutritional intervention is required. Comprehensive nutritional support and close monitoring are essential.",
    critical:
        "The patient has critical malnutrition with a score of 9 or more. Urgent and aggressive nutritional intervention is required. Immediate referral to dietitian and nutritional support team is critical.",
}

// PG-SGA Configuration
const pgsgaConfig: ScreeningConfig = {
    name: "PG-SGA (Patient-Generated Subjective Global Assessment)",
    questions: [
        {
            id: "weight_loss_1month",
            title: "Weight loss in past 1 month",
            section: "Weight Change",
            options: [
                {
                    label: "< 5%",
                    value: 0,
                    description: "Less than 5% weight loss",
                },
                {
                    label: "5-10%",
                    value: 1,
                    description: "5-10% weight loss",
                },
                {
                    label: "> 10%",
                    value: 2,
                    description: "Greater than 10% weight loss",
                },
            ],
        },
        {
            id: "weight_loss_6months",
            title: "Weight loss in past 6 months",
            section: "Weight Change",
            options: [
                {
                    label: "< 5%",
                    value: 0,
                    description: "Less than 5% weight loss",
                },
                {
                    label: "5-10%",
                    value: 1,
                    description: "5-10% weight loss",
                },
                {
                    label: "10-20%",
                    value: 2,
                    description: "10-20% weight loss",
                },
                {
                    label: "> 20%",
                    value: 4,
                    description: "Greater than 20% weight loss",
                },
            ],
        },
        {
            id: "weight_change_2weeks",
            title: "Weight change in past 2 weeks",
            section: "Weight Change",
            options: [
                {
                    label: "Increased or No change",
                    value: 0,
                    description: "Weight has increased or remained stable",
                },
                {
                    label: "Decreased",
                    value: 1,
                    description: "Weight has decreased",
                },
            ],
        },
        {
            id: "food_intake",
            title: "Food Intake compared to normal",
            section: "Food Intake",
            options: [
                {
                    label: "No change",
                    value: 0,
                    description: "No change in food intake",
                },
                {
                    label: "More than usual",
                    value: 0,
                    description: "Eating more than usual",
                },
                {
                    label: "Less than usual",
                    value: 1,
                    description: "Eating less than usual",
                },
                {
                    label: "Significantly less",
                    value: 2,
                    description: "Eating significantly less than usual",
                },
                {
                    label: "Very little/liquid only",
                    value: 3,
                    description: "Eating very little or liquid diet only",
                },
                {
                    label: "Almost nothing",
                    value: 4,
                    description: "Eating almost nothing",
                },
            ],
        },
        {
            id: "symptoms_count",
            title: "Number of symptoms affecting eating (nausea, vomiting, diarrhea, constipation, mouth sores, dry mouth, pain, altered taste, smells bother me, swallowing problems, early satiety, other)",
            section: "Symptoms",
            options: [
                {
                    label: "No problems eating",
                    value: 0,
                    description: "No symptoms affecting eating",
                },
                {
                    label: "1-2 symptoms",
                    value: 2,
                    description: "1-2 symptoms affecting eating",
                },
                {
                    label: "3-4 symptoms",
                    value: 4,
                    description: "3-4 symptoms affecting eating",
                },
                {
                    label: "5-6 symptoms",
                    value: 6,
                    description: "5-6 symptoms affecting eating",
                },
                {
                    label: "7 or more symptoms",
                    value: 7,
                    description: "7 or more symptoms affecting eating",
                },
            ],
        },
        {
            id: "activities_function",
            title: "Activities and Function",
            section: "Activities and Function",
            options: [
                {
                    label: "Normal with no limitations",
                    value: 0,
                    description: "Normal activities with no limitations",
                },
                {
                    label: "Not normal, but able to be up and about",
                    value: 1,
                    description: "Not normal, but able to be up and about with fairly normal activities",
                },
                {
                    label: "In bed or chair more than half the day",
                    value: 2,
                    description: "Not feeling up to most things, in bed or chair more than half the day",
                },
                {
                    label: "Spend most of day in bed or chair",
                    value: 3,
                    description: "Able to do little activity, spend most of day in bed or chair",
                },
                {
                    label: "Pretty much bedridden",
                    value: 4,
                    description: "Pretty much bedridden, rarely out of bed",
                },
            ],
        },
        {
            id: "disease_stress",
            title: "Disease and its relation to nutritional requirements",
            section: "Disease Burden",
            options: [
                {
                    label: "No disease or Low stress",
                    value: 0,
                    description: "No disease or low metabolic stress",
                },
                {
                    label: "Moderate stress",
                    value: 1,
                    description: "Moderate metabolic stress",
                },
                {
                    label: "High stress",
                    value: 2,
                    description: "High metabolic stress",
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const weightLoss1Month = Number(selections.weight_loss_1month) || 0
        const weightLoss6Months = Number(selections.weight_loss_6months) || 0
        const weightChange2Weeks = Number(selections.weight_change_2weeks) || 0
        const foodIntake = Number(selections.food_intake) || 0
        const symptomsCount = Number(selections.symptoms_count) || 0
        const activitiesFunction = Number(selections.activities_function) || 0
        const diseaseStress = Number(selections.disease_stress) || 0

        const totalScore = weightLoss1Month + weightLoss6Months + weightChange2Weeks + 
                          foodIntake + symptomsCount + activitiesFunction + diseaseStress

        let interpretation = ""
        let riskLevel = ""

        if (totalScore >= 9) {
            riskLevel = "Critical malnutrition"
            interpretation = PGSGA_INTERPRETATIONS.critical
        } else if (totalScore >= 4) {
            riskLevel = "Severe malnutrition"
            interpretation = PGSGA_INTERPRETATIONS.severe
        } else if (totalScore >= 2) {
            riskLevel = "Suspected or moderate malnutrition"
            interpretation = PGSGA_INTERPRETATIONS.suspectedModerate
        } else {
            riskLevel = "Well-nourished"
            interpretation = PGSGA_INTERPRETATIONS.wellNourished
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function PGSGAPage() {
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
        const evaluationResults = pgsgaConfig.evaluateScore(selections)
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
                        {pgsgaConfig.name}
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
                        questions={pgsgaConfig.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={pgsgaConfig.name}
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
                        screeningName={pgsgaConfig.name}
                        questions={pgsgaConfig.questions}
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
