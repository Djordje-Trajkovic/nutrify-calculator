"use client"
import React, { useState } from "react"
import { Typography, Box, Checkbox, FormControlLabel, FormGroup, Button } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import ScreeningResults from "@/components/screening/ScreeningResults"
import ScreeningPDFPreviewModal from "@/components/screening/ScreeningPDFPreviewModal"
import { ScreeningQuestion } from "@/utils/types"

// GLIM Interpretation Texts
const GLIM_INTERPRETATIONS = {
    noMalnutrition:
        "Based on GLIM criteria, the patient does not meet the diagnostic criteria for malnutrition. At least one phenotypic AND one etiologic criterion must be present to diagnose malnutrition.",
    moderateMalnutrition:
        "The patient meets GLIM criteria for Stage 1 (Moderate) Malnutrition. At least one moderate phenotypic criterion and one moderate etiologic criterion are present. Nutritional intervention and monitoring are recommended. Consult with a dietitian for comprehensive assessment and care planning.",
    severeMalnutrition:
        "The patient meets GLIM criteria for Stage 2 (Severe) Malnutrition. At least one severe phenotypic criterion and one severe etiologic criterion are present. Immediate and aggressive nutritional intervention is required. Urgent referral to dietitian and nutritional support team is critical.",
    mixedMalnutrition:
        "The patient meets criteria for malnutrition with mixed severity indicators. Clinical judgment should be used to determine the appropriate stage and intervention level. Consider the most severe indicators when planning nutritional care.",
}

export default function GLIMPage() {
    const [view, setView] = useState<"form" | "results">("form")
    const [phenotypicCriteria, setPhenotypicCriteria] = useState({
        weightLossModerate: false,
        weightLossSevere: false,
        lowBMIModerate: false,
        lowBMISevere: false,
        muscleMassModerate: false,
        musclemassSevere: false,
    })
    const [etiologicCriteria, setEtiologicCriteria] = useState({
        reducedIntakeModerate: false,
        reducedIntakeSevere: false,
        diseaseBurdenModerate: false,
        diseaseBurdenSevere: false,
    })
    const [results, setResults] = useState<{
        score: number
        interpretation: string
        riskLevel: string
    } | null>(null)
    const [showPDFModal, setShowPDFModal] = useState(false)

    const handlePhenotypicChange = (criterion: string) => {
        setPhenotypicCriteria((prev) => ({
            ...prev,
            [criterion]: !prev[criterion as keyof typeof prev],
        }))
    }

    const handleEtiologicChange = (criterion: string) => {
        setEtiologicCriteria((prev) => ({
            ...prev,
            [criterion]: !prev[criterion as keyof typeof prev],
        }))
    }

    const handleEvaluate = () => {
        // Check if at least one phenotypic and one etiologic criterion selected
        const hasPhenotypic = Object.values(phenotypicCriteria).some((v) => v)
        const hasEtiologic = Object.values(etiologicCriteria).some((v) => v)

        if (!hasPhenotypic || !hasEtiologic) {
            setResults({
                score: 0,
                interpretation: GLIM_INTERPRETATIONS.noMalnutrition,
                riskLevel: "No malnutrition diagnosed",
            })
            setView("results")
            return
        }

        // Check for severe criteria
        const hasSeverePhenotypic = phenotypicCriteria.weightLossSevere || 
                                     phenotypicCriteria.lowBMISevere || 
                                     phenotypicCriteria.musclemassSevere
        const hasSevereEtiologic = etiologicCriteria.reducedIntakeSevere || 
                                    etiologicCriteria.diseaseBurdenSevere

        // Check for moderate criteria
        const hasModeratePhenotypic = phenotypicCriteria.weightLossModerate || 
                                       phenotypicCriteria.lowBMIModerate || 
                                       phenotypicCriteria.muscleMassModerate
        const hasModerateEtiologic = etiologicCriteria.reducedIntakeModerate || 
                                      etiologicCriteria.diseaseBurdenModerate

        let interpretation = ""
        let riskLevel = ""
        let score = 0

        if (hasSeverePhenotypic && hasSevereEtiologic) {
            riskLevel = "Stage 2 (Severe Malnutrition)"
            interpretation = GLIM_INTERPRETATIONS.severeMalnutrition
            score = 2
        } else if (hasModeratePhenotypic && hasModerateEtiologic) {
            riskLevel = "Stage 1 (Moderate Malnutrition)"
            interpretation = GLIM_INTERPRETATIONS.moderateMalnutrition
            score = 1
        } else {
            // Mixed criteria
            riskLevel = "Malnutrition - Mixed Severity"
            interpretation = GLIM_INTERPRETATIONS.mixedMalnutrition
            score = 1
        }

        setResults({
            score,
            interpretation,
            riskLevel,
        })
        setView("results")
    }

    const handleEditData = () => {
        setView("form")
    }

    const handlePrintPage = () => {
        setShowPDFModal(true)
    }

    const allCriteriaAnswered = 
        Object.values(phenotypicCriteria).some((v) => v) && 
        Object.values(etiologicCriteria).some((v) => v)

    // Build selections for PDF
    const selections: Record<string, string | number> = {}
    Object.entries(phenotypicCriteria).forEach(([key, value]) => {
        if (value) selections[key] = 1
    })
    Object.entries(etiologicCriteria).forEach(([key, value]) => {
        if (value) selections[key] = 1
    })

    // Build questions for PDF
    const pdfQuestions: ScreeningQuestion[] = [
        {
            id: "phenotypic",
            title: "Phenotypic Criteria (at least 1 required)",
            section: "Step 2: Diagnostic Criteria",
            options: [
                { label: "Weight Loss - Moderate (5-10% in 6mo or 10-20% beyond 6mo)", value: 1 },
                { label: "Weight Loss - Severe (>10% in 6mo or >20% beyond 6mo)", value: 1 },
                { label: "Low BMI - Moderate (<20 if <70yr or <22 if ≥70yr)", value: 1 },
                { label: "Low BMI - Severe (<18.5 if <70yr or <20 if ≥70yr)", value: 1 },
                { label: "Reduced Muscle Mass - Moderate", value: 1 },
                { label: "Reduced Muscle Mass - Severe", value: 1 },
            ],
        },
        {
            id: "etiologic",
            title: "Etiologic Criteria (at least 1 required)",
            section: "Step 2: Diagnostic Criteria",
            options: [
                { label: "Reduced Intake - Moderate (≤50% requirement >1 week)", value: 1 },
                { label: "Reduced Intake - Severe (≤50% requirement >2 weeks or any reduction >2 weeks)", value: 1 },
                { label: "Disease Burden - Moderate (Acute/chronic disease)", value: 1 },
                { label: "Disease Burden - Severe (Acute/chronic with marked inflammation)", value: 1 },
            ],
        },
    ]

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
                        GLIM (Global Leadership Initiative on Malnutrition)
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? "Two-step diagnostic criteria for malnutrition"
                            : "Evaluation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "900px",
                            margin: "0 auto",
                            padding: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        {/* Step 1 Note */}
                        <Box
                            sx={{
                                backgroundColor: "#FAF9F6",
                                borderRadius: "8px",
                                padding: { xs: 2, sm: 3 },
                                marginBottom: 3,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "#01b011",
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 1,
                                }}
                            >
                                STEP 1: SCREENING
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "#666",
                                }}
                            >
                                Use NRS-2002, MNA-SF, MUST, or MST to identify if patient is at risk of malnutrition. 
                                If at risk, proceed to Step 2 below.
                            </Typography>
                        </Box>

                        {/* Phenotypic Criteria */}
                        <Box
                            sx={{
                                backgroundColor: "#FAF9F6",
                                borderRadius: "8px",
                                padding: { xs: 2, sm: 3 },
                                marginBottom: 3,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "#01b011",
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 1,
                                }}
                            >
                                STEP 2: PHENOTYPIC CRITERIA (SELECT AT LEAST 1)
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#00473C",
                                    fontWeight: 600,
                                    marginBottom: 2,
                                    fontSize: { xs: "1rem", sm: "1.25rem" },
                                }}
                            >
                                Phenotypic Criteria
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={phenotypicCriteria.weightLossModerate}
                                            onChange={() => handlePhenotypicChange("weightLossModerate")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Non-volitional weight loss - Moderate
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                5-10% within past 6 months, OR 10-20% beyond 6 months
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={phenotypicCriteria.weightLossSevere}
                                            onChange={() => handlePhenotypicChange("weightLossSevere")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Non-volitional weight loss - Severe
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                {">10% within past 6 months, OR >20% beyond 6 months"}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={phenotypicCriteria.lowBMIModerate}
                                            onChange={() => handlePhenotypicChange("lowBMIModerate")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Low BMI - Moderate
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                {"<20 (if <70 years) or <22 (if ≥70 years)"}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={phenotypicCriteria.lowBMISevere}
                                            onChange={() => handlePhenotypicChange("lowBMISevere")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Low BMI - Severe
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                {"<18.5 (if <70 years) or <20 (if ≥70 years)"}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={phenotypicCriteria.muscleMassModerate}
                                            onChange={() => handlePhenotypicChange("muscleMassModerate")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Reduced muscle mass - Moderate
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Mild to moderate deficit
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={phenotypicCriteria.musclemassSevere}
                                            onChange={() => handlePhenotypicChange("musclemassSevere")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Reduced muscle mass - Severe
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Severe deficit
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </FormGroup>
                        </Box>

                        {/* Etiologic Criteria */}
                        <Box
                            sx={{
                                backgroundColor: "#FAF9F6",
                                borderRadius: "8px",
                                padding: { xs: 2, sm: 3 },
                                marginBottom: 3,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "#01b011",
                                    fontWeight: 600,
                                    display: "block",
                                    marginBottom: 1,
                                }}
                            >
                                STEP 2: ETIOLOGIC CRITERIA (SELECT AT LEAST 1)
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#00473C",
                                    fontWeight: 600,
                                    marginBottom: 2,
                                    fontSize: { xs: "1rem", sm: "1.25rem" },
                                }}
                            >
                                Etiologic Criteria
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={etiologicCriteria.reducedIntakeModerate}
                                            onChange={() => handleEtiologicChange("reducedIntakeModerate")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Reduced food intake or assimilation - Moderate
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                {"≤50% of energy requirement for >1 week"}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={etiologicCriteria.reducedIntakeSevere}
                                            onChange={() => handleEtiologicChange("reducedIntakeSevere")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Reduced food intake or assimilation - Severe
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                {"≤50% of energy requirement for >2 weeks, OR any reduction for >2 weeks"}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={etiologicCriteria.diseaseBurdenModerate}
                                            onChange={() => handleEtiologicChange("diseaseBurdenModerate")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Disease burden/Inflammation - Moderate
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Acute disease/injury or chronic disease-related
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ marginBottom: 1.5 }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={etiologicCriteria.diseaseBurdenSevere}
                                            onChange={() => handleEtiologicChange("diseaseBurdenSevere")}
                                            sx={{
                                                color: "#00473C",
                                                "&.Mui-checked": { color: "#01b011" },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Disease burden/Inflammation - Severe
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#666" }}>
                                                Acute disease/injury or chronic disease-related with marked inflammatory response
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </FormGroup>
                        </Box>

                        {/* Evaluate Button */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 4,
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleEvaluate}
                                disabled={!allCriteriaAnswered}
                                sx={{
                                    backgroundColor: "#00473C",
                                    color: "#ffffff",
                                    padding: "12px 48px",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    "&:hover": {
                                        backgroundColor: "#01b011",
                                    },
                                    "&:disabled": {
                                        backgroundColor: "#cccccc",
                                        color: "#666666",
                                    },
                                }}
                            >
                                Evaluation
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    results && (
                        <ScreeningResults
                            screeningName="GLIM (Global Leadership Initiative on Malnutrition)"
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
                        screeningName="GLIM (Global Leadership Initiative on Malnutrition)"
                        questions={pdfQuestions}
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
