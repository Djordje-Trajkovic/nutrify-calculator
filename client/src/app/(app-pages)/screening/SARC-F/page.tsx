"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningForm from "@/components/screening/ScreeningForm"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningConfig } from "@/utils/types"

// SARC-F Interpretation Texts
const SARCF_INTERPRETATIONS = {
    noRisk:
        "The patient shows no risk of sarcopenia with a score of 0-3. Continue routine monitoring and maintain physical activity as appropriate.",
    atRisk:
        "The patient is at risk of sarcopenia with a score of 4-10. Further assessment is recommended. Consider referral for comprehensive sarcopenia evaluation including muscle strength, physical performance, and muscle mass measurements.",
}

// SARC-F Configuration
const sarcfConfig: ScreeningConfig = {
    name: "SARC-F (Sarcopenia Screening)",
    questions: [
        {
            id: "strength",
            title: "Strength: How much difficulty do you have in lifting and carrying 5kg?",
            section: "Strength",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "No difficulty",
                },
                {
                    label: "Some",
                    value: 1,
                    description: "Some difficulty",
                },
                {
                    label: "A lot or unable",
                    value: 2,
                    description: "A lot of difficulty or unable to lift/carry 5kg",
                    details: [
                        "Note: 5kg is equivalent to carrying half a water jug with one hand or a whole water jug with both hands",
                    ],
                },
            ],
        },
        {
            id: "assistance_walking",
            title: "Assistance in walking: How much difficulty do you have walking across a room?",
            section: "Walking",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "No difficulty",
                },
                {
                    label: "Some",
                    value: 1,
                    description: "Some difficulty",
                },
                {
                    label: "A lot, use aids, or unable",
                    value: 2,
                    description: "A lot of difficulty, require walking aids, or unable to walk",
                },
            ],
        },
        {
            id: "rise_from_chair",
            title: "Rise from a chair: How much difficulty do you have transferring from a chair or bed?",
            section: "Transfer",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "No difficulty",
                },
                {
                    label: "Some",
                    value: 1,
                    description: "Some difficulty",
                },
                {
                    label: "A lot or unable",
                    value: 2,
                    description: "A lot of difficulty or unable to transfer without help",
                },
            ],
        },
        {
            id: "climb_stairs",
            title: "Climb stairs: How much difficulty do you have climbing a flight of 10 stairs?",
            section: "Stairs",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "No difficulty",
                },
                {
                    label: "Some",
                    value: 1,
                    description: "Some difficulty",
                },
                {
                    label: "A lot or unable",
                    value: 2,
                    description: "A lot of difficulty or unable to climb stairs",
                },
            ],
        },
        {
            id: "falls",
            title: "Falls: How many times have you fallen in the past year?",
            section: "Falls",
            options: [
                {
                    label: "None",
                    value: 0,
                    description: "No falls",
                },
                {
                    label: "1-3 falls",
                    value: 1,
                    description: "1 to 3 falls in the past year",
                },
                {
                    label: "4 or more falls",
                    value: 2,
                    description: "4 or more falls in the past year",
                    details: ["Note: in the last 12 months"],
                },
            ],
        },
    ],
    evaluateScore: (selections) => {
        const strength = Number(selections.strength) || 0
        const assistanceWalking = Number(selections.assistance_walking) || 0
        const riseFromChair = Number(selections.rise_from_chair) || 0
        const climbStairs = Number(selections.climb_stairs) || 0
        const falls = Number(selections.falls) || 0

        const totalScore = strength + assistanceWalking + riseFromChair + climbStairs + falls

        let interpretation = ""
        let riskLevel = ""

        if (totalScore >= 4) {
            riskLevel = "Risk of sarcopenia"
            interpretation = SARCF_INTERPRETATIONS.atRisk
        } else {
            riskLevel = "No sarcopenia risk"
            interpretation = SARCF_INTERPRETATIONS.noRisk
        }

        return {
            score: totalScore,
            interpretation,
            riskLevel,
        }
    },
}

export default function SARCFPage() {
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
        const evaluationResults = sarcfConfig.evaluateScore(selections)
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
                        {sarcfConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Please answer all questions to evaluate sarcopenia risk"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <ScreeningForm
                        questions={sarcfConfig.questions}
                        selections={selections}
                        onSelectionChange={handleSelectionChange}
                        onEvaluate={handleEvaluate}
                    />
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName={sarcfConfig.name}
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
                        screeningName={sarcfConfig.name}
                        questions={sarcfConfig.questions}
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
