"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import CalculatorForm from "@/components/calculator/CalculatorForm"
import CalculatorResults from "@/components/calculator/CalculatorResults"
import CalculatorPDFPreviewModal from "@/components/calculator/CalculatorPDFPreviewModal"
import { schofieldCalculatorConfig } from "@/utils/calculatorConfigs"
import { CalculatorResult } from "@/utils/types"

export default function SchofieldCalculatorPage() {
    const [view, setView] = useState<"form" | "results">("form")
    const [inputs, setInputs] = useState<Record<string, string | number>>({})
    const [result, setResult] = useState<CalculatorResult | null>(null)
    const [showPDFModal, setShowPDFModal] = useState(false)

    const handleInputChange = (fieldId: string, value: string | number) => {
        setInputs((prev) => ({
            ...prev,
            [fieldId]: value,
        }))
    }

    const handleCalculate = () => {
        const calculationResult = schofieldCalculatorConfig.calculate(inputs)
        setResult(calculationResult)
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
                        {schofieldCalculatorConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? schofieldCalculatorConfig.description
                            : "Calculation Results"}
                    </Typography>
                </Box>

                {/* Content Area */}
                {view === "form" ? (
                    <CalculatorForm
                        fields={schofieldCalculatorConfig.fields}
                        inputs={inputs}
                        onInputChange={handleInputChange}
                        onCalculate={handleCalculate}
                        calculatorName={schofieldCalculatorConfig.name}
                    />
                ) : (
                    result && (
                        <CalculatorResults
                            calculatorName={schofieldCalculatorConfig.name}
                            result={result}
                            onEditData={handleEditData}
                            onPrintPage={handlePrintPage}
                        />
                    )
                )}

                {/* PDF Preview Modal */}
                {result && (
                    <CalculatorPDFPreviewModal
                        open={showPDFModal}
                        onClose={() => setShowPDFModal(false)}
                        calculatorName={schofieldCalculatorConfig.name}
                        fields={schofieldCalculatorConfig.fields}
                        inputs={inputs}
                        result={result}
                    />
                )}
            </Box>
        </AppContainer>
    )
}
