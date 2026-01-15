"use client"
import React, { useState, useEffect } from "react"
import { Typography, Box, Button, Stepper, Step, StepLabel } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import CalculatorForm from "@/components/calculator/CalculatorForm"
import { useSearchParams } from "next/navigation"
import { calculatorConfigs } from "@/utils/calculatorConfigs"
import { CalculatorResult, CalculatorConfig } from "@/utils/types"
import { Printer } from "@phosphor-icons/react"
import MultiCalculatorPDFPreviewModal from "@/components/calculator/MultiCalculatorPDFPreviewModal"

type CalculatorData = {
    config: CalculatorConfig
    inputs: Record<string, string | number>
    result: CalculatorResult | null
}

export default function MultiCalculatorPage() {
    const searchParams = useSearchParams()
    const [selectedCalculators, setSelectedCalculators] = useState<string[]>([])
    const [calculatorData, setCalculatorData] = useState<
        Record<string, CalculatorData>
    >({})
    const [currentStep, setCurrentStep] = useState(0)
    const [showPDFModal, setShowPDFModal] = useState(false)

    useEffect(() => {
        const calculatorsParam = searchParams.get("calculators")
        if (calculatorsParam) {
            const ids = calculatorsParam.split(",")
            setSelectedCalculators(ids)

            const initialData: Record<string, CalculatorData> = {}
            ids.forEach((id) => {
                const config =
                    calculatorConfigs[id as keyof typeof calculatorConfigs]
                if (config) {
                    initialData[id] = {
                        config,
                        inputs: {},
                        result: null,
                    }
                }
            })
            setCalculatorData(initialData)
        }
    }, [searchParams])

    const handleInputChange = (
        calculatorId: string,
        fieldId: string,
        value: string | number,
    ) => {
        setCalculatorData((prev) => ({
            ...prev,
            [calculatorId]: {
                ...prev[calculatorId],
                inputs: {
                    ...prev[calculatorId].inputs,
                    [fieldId]: value,
                },
            },
        }))
    }

    const handleCalculate = (calculatorId: string) => {
        const data = calculatorData[calculatorId]
        if (data) {
            const result = data.config.calculate(data.inputs)
            setCalculatorData((prev) => ({
                ...prev,
                [calculatorId]: {
                    ...prev[calculatorId],
                    result,
                },
            }))
        }
    }

    const handleNext = () => {
        const currentCalculatorId = selectedCalculators[currentStep]
        const currentData = calculatorData[currentCalculatorId]

        // Calculate if not already calculated
        if (!currentData.result) {
            handleCalculate(currentCalculatorId)
        }

        if (currentStep < selectedCalculators.length - 1) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handleGeneratePDF = () => {
        // Calculate all remaining calculators if needed
        const updatedData = { ...calculatorData }
        selectedCalculators.forEach((id) => {
            if (!updatedData[id].result) {
                const result = updatedData[id].config.calculate(
                    updatedData[id].inputs,
                )
                updatedData[id] = {
                    ...updatedData[id],
                    result,
                }
            }
        })
        setCalculatorData(updatedData)
        setShowPDFModal(true)
    }

    const allCalculatorsComplete = selectedCalculators.every(
        (id) => calculatorData[id]?.result !== null,
    )

    const currentCalculatorId = selectedCalculators[currentStep]
    const currentData = calculatorData[currentCalculatorId]

    if (selectedCalculators.length === 0 || !currentData) {
        return (
            <AppContainer>
                <Box
                    sx={{
                        minHeight: "100vh",
                        paddingY: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" color="error">
                        No calculators selected. Please go back and select
                        calculators.
                    </Typography>
                </Box>
            </AppContainer>
        )
    }

    const currentAllFieldsFilled = currentData.config.fields.every((field) => {
        if (!field.required) return true
        const value = currentData.inputs[field.id]
        return value !== undefined && value !== "" && value !== null
    })

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
                        Multiple Calculator Assessment
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        Complete all calculators to generate a comprehensive
                        report
                    </Typography>
                </Box>

                <Box
                    sx={{
                        maxWidth: "1000px",
                        margin: "0 auto",
                        padding: { xs: 2, sm: 3 },
                    }}
                >
                    {/* Stepper */}
                    <Stepper
                        activeStep={currentStep}
                        sx={{ marginBottom: 4 }}
                        alternativeLabel
                    >
                        {selectedCalculators.map((id) => {
                            const config =
                                calculatorConfigs[
                                    id as keyof typeof calculatorConfigs
                                ]
                            return (
                                <Step key={id}>
                                    <StepLabel>{config?.name}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>

                    {/* Current Calculator Form */}
                    {currentData.result ? (
                        <Box
                            sx={{
                                backgroundColor: "#FAF9F6",
                                borderRadius: "12px",
                                padding: { xs: 3, sm: 4 },
                                marginBottom: 4,
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#00473C",
                                    fontWeight: 600,
                                    marginBottom: 2,
                                }}
                            >
                                {currentData.config.name} - Completed
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: "#00473C",
                                    fontWeight: 700,
                                    marginBottom: 1,
                                }}
                            >
                                {currentData.result.value} {currentData.result.unit}
                            </Typography>
                            {currentData.result.category && (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#01b011",
                                        fontWeight: 600,
                                    }}
                                >
                                    {currentData.result.category}
                                </Typography>
                            )}
                        </Box>
                    ) : (
                        <CalculatorForm
                            fields={currentData.config.fields}
                            inputs={currentData.inputs}
                            onInputChange={(fieldId, value) =>
                                handleInputChange(
                                    currentCalculatorId,
                                    fieldId,
                                    value,
                                )
                            }
                            onCalculate={() =>
                                handleCalculate(currentCalculatorId)
                            }
                            calculatorName={currentData.config.name}
                        />
                    )}

                    {/* Navigation Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 4,
                        }}
                    >
                        <Button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            sx={{
                                color: "#00473C",
                                borderColor: "#00473C",
                                textTransform: "none",
                                "&:disabled": {
                                    color: "#cccccc",
                                    borderColor: "#cccccc",
                                },
                            }}
                            variant="outlined"
                        >
                            Back
                        </Button>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            {currentStep === selectedCalculators.length - 1 ? (
                                <Button
                                    onClick={handleGeneratePDF}
                                    disabled={!currentAllFieldsFilled}
                                    variant="contained"
                                    startIcon={<Printer size={20} weight="bold" />}
                                    sx={{
                                        backgroundColor: "#00473C",
                                        color: "#ffffff",
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
                                    Generate Combined Report
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    disabled={!currentAllFieldsFilled}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#00473C",
                                        color: "#ffffff",
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
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* PDF Preview Modal */}
                {allCalculatorsComplete && (
                    <MultiCalculatorPDFPreviewModal
                        open={showPDFModal}
                        onClose={() => setShowPDFModal(false)}
                        calculatorData={calculatorData}
                        selectedCalculators={selectedCalculators}
                    />
                )}
            </Box>
        </AppContainer>
    )
}
