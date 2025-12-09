"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// SNAQ 65+ Interpretation Texts
const SNAQ65_INTERPRETATIONS = {
    noRisk:
        "The patient is not at risk of malnutrition with a score of less than 3. Continue routine clinical care and monitor nutritional status as appropriate.",
    atRisk:
        "The patient is at risk of malnutrition with a score of 3 or more. Consider comprehensive nutritional assessment and intervention by a dietitian or healthcare professional.",
}

// SNAQ 65+ Configuration
const snaq65Config: ScreeningConfig = {
    name: "SNAQ 65+ (Short Nutritional Assessment Questionnaire 65+)",
    questions: [
        {
            id: "weight_loss",
            title: "How much weight has the patient lost unintentionally in the last 6 months?",
            section: "Weight Loss Assessment",
            options: [
                {
                    label: "Less than 4 kg",
                    value: 0,
                    description: "Weight loss less than 4 kg in the last 6 months",
                },
                {
                    label: "4 kg or more",
                    value: 3,
                    description: "Weight loss of 4 kg or more in the last 6 months",
                    details: [
                        "If the patient does not know whether he/she has had weight loss within this period, ask the patient:",
                        "• If clothes have become too big?",
                        "• If the belt had to be tightened recently?",
                        "• If the watch has become looser around the wrist?",
                    ],
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const weightLoss = Number(selections.weight_loss) || 0

        const totalScore = weightLoss

        let interpretation = ""
        let riskLevel = ""

        if (totalScore >= 3) {
            riskLevel = "At risk of malnutrition"
            interpretation = SNAQ65_INTERPRETATIONS.atRisk
        } else {
            riskLevel = "No malnutrition risk"
            interpretation = SNAQ65_INTERPRETATIONS.noRisk
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function SNAQ65Page() {
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
        const evaluationResults = snaq65Config.evaluateScore(selections)
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
                        {snaq65Config.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Please answer the question to evaluate nutritional risk"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <ScreeningForm
                        questions={snaq65Config.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={snaq65Config.name}
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
                        screeningName={snaq65Config.name}
                        questions={snaq65Config.questions}
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
