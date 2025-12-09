"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// NRS-2002 Configuration
const nrs2002Config: ScreeningConfig = {
    name: "NRS-2002 (Nutritional Risk Screening 2002)",
    questions: [
        {
            id: "nutritional_status",
            title: "Nutritional status impairment",
            section: "Nutritional Status",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "Normal nutritional status",
                },
                {
                    label: "Mild",
                    value: 1,
                    description: "Weight loss >5% in 3 months or food intake below 50-75% of normal requirement in preceding week",
                },
                {
                    label: "Moderate",
                    value: 2,
                    description: "Weight loss >5% in 2 months or BMI 18.5-20.5 + impaired general condition or food intake 25-50% of normal requirement in preceding week",
                },
                {
                    label: "Severe",
                    value: 3,
                    description: "Weight loss >5% in 1 month (>15% in 3 months) or BMI <18.5 + impaired general condition or food intake 0-25% of normal requirement in preceding week",
                },
            ],
        },
        {
            id: "disease_severity",
            title: "Severity of disease (increase in requirements)",
            section: "Disease Severity",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "Normal nutritional requirements",
                },
                {
                    label: "Mild",
                    value: 1,
                    description: "Hip fracture, chronic patients with complications: cirrhosis, COPD, chronic hemodialysis, diabetes, oncology",
                },
                {
                    label: "Moderate",
                    value: 2,
                    description: "Major abdominal surgery, stroke, severe pneumonia, hematologic malignancy",
                },
                {
                    label: "Severe",
                    value: 3,
                    description: "Head injury, bone marrow transplantation, intensive care patients (APACHE >10)",
                },
            ],
        },
        {
            id: "age",
            title: "Age",
            section: "Age Factor",
            options: [
                {
                    label: "< 70 years",
                    value: 0,
                    description: "No additional points for age",
                },
                {
                    label: "≥ 70 years",
                    value: 1,
                    description: "Add 1 point if age 70 or above",
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const nutritionalStatus = Number(selections.nutritional_status) || 0
        const diseaseSeverity = Number(selections.disease_severity) || 0
        const age = Number(selections.age) || 0

        const totalScore = nutritionalStatus + diseaseSeverity + age

        let interpretation = ""
        let riskLevel = ""

        if (totalScore < 3) {
            riskLevel = "No Nutritional Risk"
            interpretation =
                "The patient has a score of less than 3 and is not at nutritional risk. Weekly rescreening is recommended for patients in hospital. If the patient is scheduled for a major operation, a preventive nutritional care plan should be considered to avoid the associated risk status."
        } else if (totalScore >= 3 && totalScore <= 4) {
            riskLevel = "Moderate Nutritional Risk"
            interpretation =
                "The patient is at moderate nutritional risk with a score of 3-4. Nutritional support should be initiated. Nutritional care planning and monitoring should be established. Weekly reassessment of nutritional status is recommended."
        } else {
            riskLevel = "High Nutritional Risk"
            interpretation =
                "The patient is at high nutritional risk with a score of 5 or more. Immediate nutritional intervention is required. A comprehensive nutritional care plan should be implemented without delay. Close monitoring and frequent reassessment of nutritional status are essential."
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function NRS2002Page() {
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
        const evaluationResults = nrs2002Config.evaluateScore(selections)
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
                        {nrs2002Config.name}
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
                        questions={nrs2002Config.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={nrs2002Config.name}
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
                        screeningName={nrs2002Config.name}
                        questions={nrs2002Config.questions}
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
