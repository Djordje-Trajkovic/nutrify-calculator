"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// MUST Interpretation Texts
const MUST_INTERPRETATIONS = {
    lowRisk:
        "The patient is at low risk of malnutrition with a score of 0. Routine clinical care is recommended. Repeat screening as per hospital policy (e.g., weekly for inpatients, monthly for care homes, annually for community).",
    mediumRisk:
        "The patient is at medium risk of malnutrition with a score of 1. Observation is recommended. Document dietary intake for 3 days. If adequate intake, repeat screening as per hospital policy. If inadequate intake, consider clinical treatment and/or nutritional support.",
    highRisk:
        "The patient is at high risk of malnutrition with a score of 2 or more. Refer to dietitian, nutritional support team, or implement local policy. Set goals, improve and increase overall nutritional intake, monitor and review care plan regularly.",
}

// MUST Configuration
const mustConfig: ScreeningConfig = {
    name: "MUST (Malnutrition Universal Screening Tool)",
    questions: [
        {
            id: "bmi_score",
            title: "BMI Score",
            section: "Step 1: BMI",
            options: [
                {
                    label: "BMI > 20 (>30 Obese)",
                    value: 0,
                    description: "BMI greater than 20 (or greater than 30 if obese)",
                },
                {
                    label: "BMI 18.5-20",
                    value: 1,
                    description: "BMI between 18.5 and 20",
                },
                {
                    label: "BMI < 18.5",
                    value: 2,
                    description: "BMI less than 18.5",
                },
            ],
        },
        {
            id: "weight_loss_score",
            title: "Weight Loss Score (unplanned weight loss in past 3-6 months)",
            section: "Step 2: Weight Loss",
            options: [
                {
                    label: "< 5%",
                    value: 0,
                    description: "Less than 5% unplanned weight loss",
                },
                {
                    label: "5-10%",
                    value: 1,
                    description: "5-10% unplanned weight loss",
                },
                {
                    label: "> 10%",
                    value: 2,
                    description: "Greater than 10% unplanned weight loss",
                },
            ],
        },
        {
            id: "acute_disease_score",
            title: "Acute Disease Effect Score",
            section: "Step 3: Acute Disease",
            options: [
                {
                    label: "No acute disease effect",
                    value: 0,
                    description: "Patient is not acutely ill or there is no nutritional effect",
                },
                {
                    label: "Acutely ill with no nutritional intake for > 5 days",
                    value: 2,
                    description: "Patient is acutely ill and there has been or is likely to be no nutritional intake for more than 5 days",
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const bmiScore = Number(selections.bmi_score) || 0
        const weightLossScore = Number(selections.weight_loss_score) || 0
        const acuteDiseaseScore = Number(selections.acute_disease_score) || 0

        const totalScore = bmiScore + weightLossScore + acuteDiseaseScore

        let interpretation = ""
        let riskLevel = ""

        if (totalScore === 0) {
            riskLevel = "Low Risk"
            interpretation = MUST_INTERPRETATIONS.lowRisk
        } else if (totalScore === 1) {
            riskLevel = "Medium Risk"
            interpretation = MUST_INTERPRETATIONS.mediumRisk
        } else {
            riskLevel = "High Risk"
            interpretation = MUST_INTERPRETATIONS.highRisk
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function MUSTPage() {
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
        const evaluationResults = mustConfig.evaluateScore(selections)
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
                        {mustConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Please answer all questions to evaluate malnutrition risk"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <ScreeningForm
                        questions={mustConfig.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={mustConfig.name}
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
                        screeningName={mustConfig.name}
                        questions={mustConfig.questions}
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
