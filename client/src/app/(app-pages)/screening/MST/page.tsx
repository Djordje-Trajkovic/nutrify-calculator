"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// MST Interpretation Texts
const MST_INTERPRETATIONS = {
    noRisk:
        "The patient is not at nutritional risk with a score of 0-1. Continue routine clinical care and monitor nutritional status as appropriate.",
    atRisk:
        "The patient is at risk of malnutrition with a score of 2 or more. Referral to a dietitian is recommended for comprehensive nutritional assessment and intervention planning.",
}

// MST Configuration
const mstConfig: ScreeningConfig = {
    name: "MST (Malnutrition Screening Tool)",
    questions: [
        {
            id: "weight_loss",
            title: "Have you recently lost weight without trying?",
            section: "Weight Loss",
            options: [
                {
                    label: "No",
                    value: 0,
                    description: "No recent unintentional weight loss",
                },
                {
                    label: "Unsure",
                    value: 2,
                    description: "Uncertain about recent weight loss",
                },
                {
                    label: "Yes",
                    value: 2,
                    description: "Yes, I have recently lost weight without trying",
                },
            ],
        },
        {
            id: "poor_appetite",
            title: "Have you been eating poorly because of a decreased appetite?",
            section: "Appetite",
            options: [
                {
                    label: "No",
                    value: 0,
                    description: "Appetite is normal",
                },
                {
                    label: "Yes",
                    value: 1,
                    description: "Eating poorly due to decreased appetite",
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const weightLoss = Number(selections.weight_loss) || 0
        const poorAppetite = Number(selections.poor_appetite) || 0

        const totalScore = weightLoss + poorAppetite

        let interpretation = ""
        let riskLevel = ""

        if (totalScore >= 2) {
            riskLevel = "At risk of malnutrition"
            interpretation = MST_INTERPRETATIONS.atRisk
        } else {
            riskLevel = "Not at nutritional risk"
            interpretation = MST_INTERPRETATIONS.noRisk
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function MSTPage() {
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
        const evaluationResults = mstConfig.evaluateScore(selections)
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
                        {mstConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Please answer all questions to evaluate nutritional risk"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <ScreeningForm
                        questions={mstConfig.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={mstConfig.name}
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
                        screeningName={mstConfig.name}
                        questions={mstConfig.questions}
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
