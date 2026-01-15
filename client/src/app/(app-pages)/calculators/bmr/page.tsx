"use client"
import React, { useState } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import CalculatorForm from "@/components/calculator/CalculatorForm"
import CalculatorResults from "@/components/calculator/CalculatorResults"
import CalculatorPDFPreviewModal from "@/components/calculator/CalculatorPDFPreviewModal"
import { bmrCalculatorConfig } from "@/utils/calculatorConfigs"
import { CalculatorResult } from "@/utils/types"

export default function BMRCalculatorPage() {
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
        const calculationResult = bmrCalculatorConfig.calculate(inputs)
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
                        {bmrCalculatorConfig.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        {view === "form"
                            ? bmrCalculatorConfig.description
                            : "Calculation Results"}
                    </Typography>
                </Box>

                {view === "form" ? (
                    <CalculatorForm
                        fields={bmrCalculatorConfig.fields}
                        inputs={inputs}
                        onInputChange={handleInputChange}
                        onCalculate={handleCalculate}
                        calculatorName={bmrCalculatorConfig.name}
                    />
                ) : (
                    result && (
                        <CalculatorResults
                            calculatorName={bmrCalculatorConfig.name}
                            result={result}
                            onEditData={handleEditData}
                            onPrintPage={handlePrintPage}
                        />
                    )
                )}

                {result && (
                    <CalculatorPDFPreviewModal
                        open={showPDFModal}
                        onClose={() => setShowPDFModal(false)}
                        calculatorName={bmrCalculatorConfig.name}
                        fields={bmrCalculatorConfig.fields}
                        inputs={inputs}
                        result={result}
                    />
                )}
            </Box>
        </AppContainer>
    )
}
