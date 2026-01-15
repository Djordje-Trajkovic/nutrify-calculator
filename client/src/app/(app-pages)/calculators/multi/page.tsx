"use client"
import React, { useState, useEffect } from "react"
import { Typography, Box, Button } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
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

    const handleCalculateAll = () => {
        const updatedData = { ...calculatorData }
        let hasChanges = false

        selectedCalculators.forEach((id) => {
            const data = updatedData[id]
            // Check if all required fields are filled
            const allFieldsFilled = data.config.fields.every((field) => {
                if (!field.required) return true
                const value = data.inputs[field.id]
                return value !== undefined && value !== "" && value !== null
            })

            if (allFieldsFilled && !data.result) {
                const result = data.config.calculate(data.inputs)
                updatedData[id] = {
                    ...updatedData[id],
                    result,
                }
                hasChanges = true
            }
        })

        if (hasChanges) {
            setCalculatorData(updatedData)
        }
    }

    const handleGeneratePDF = () => {
        // Calculate any remaining calculators if needed
        handleCalculateAll()
        setShowPDFModal(true)
    }

    const allCalculatorsHaveData = selectedCalculators.every((id) => {
        const data = calculatorData[id]
        return data?.config.fields.every((field) => {
            if (!field.required) return true
            const value = data.inputs[field.id]
            return value !== undefined && value !== "" && value !== null
        })
    })

    const hasAnyResults = selectedCalculators.some(
        (id) => calculatorData[id]?.result !== null,
    )

    const getCategoryColor = (category?: string) => {
        if (!category) return "#00473C"
        
        const cat = category.toLowerCase()
        if (cat.includes("severe") || cat.includes("obese class iii")) {
            return "#d32f2f"
        }
        if (
            cat.includes("moderate") ||
            cat.includes("overweight") ||
            cat.includes("obese")
        ) {
            return "#f57c00"
        }
        if (cat.includes("normal") || cat.includes("ideal")) {
            return "#01b011"
        }
        return "#00473C"
    }

    if (selectedCalculators.length === 0) {
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
                        Calculate Nutritional Goals
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        Calculation of energy and protein requirements using established equations
                    </Typography>
                </Box>

                <Box
                    sx={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: { xs: 2, sm: 3 },
                    }}
                >
                    {/* All Calculator Forms Grouped */}
                    <Box sx={{ marginBottom: 4 }}>
                        {selectedCalculators.map((id) => {
                            const data = calculatorData[id]
                            if (!data) return null

                            return (
                                <Box
                                    key={id}
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
                                        variant="h6"
                                        sx={{
                                            color: "#00473C",
                                            fontWeight: 600,
                                            marginBottom: 2,
                                            fontSize: { xs: "1rem", sm: "1.25rem" },
                                        }}
                                    >
                                        {data.config.name}
                                    </Typography>
                                    
                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
                                        {data.config.fields.map((field) => (
                                            <Box key={field.id}>
                                                {field.type === "select" ? (
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#00473C",
                                                                fontWeight: 600,
                                                                marginBottom: 0.5,
                                                            }}
                                                        >
                                                            {field.label}
                                                            {field.required && " *"}
                                                        </Typography>
                                                        <select
                                                            value={data.inputs[field.id] ?? ""}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    id,
                                                                    field.id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                borderRadius: "4px",
                                                                border: "1px solid #00473C",
                                                                fontSize: "1rem",
                                                                backgroundColor: "#ffffff",
                                                            }}
                                                        >
                                                            <option value="">Select...</option>
                                                            {field.options?.map((option) => (
                                                                <option
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </Box>
                                                ) : (
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#00473C",
                                                                fontWeight: 600,
                                                                marginBottom: 0.5,
                                                            }}
                                                        >
                                                            {field.label}
                                                            {field.required && " *"}
                                                            {field.unit && ` (${field.unit})`}
                                                        </Typography>
                                                        <input
                                                            type={field.type}
                                                            value={data.inputs[field.id] ?? ""}
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    id,
                                                                    field.id,
                                                                    field.type === "number"
                                                                        ? Number(e.target.value)
                                                                        : e.target.value,
                                                                )
                                                            }
                                                            min={field.min}
                                                            max={field.max}
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px",
                                                                borderRadius: "4px",
                                                                border: "1px solid #00473C",
                                                                fontSize: "1rem",
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>

                    {/* Calculate Button */}
                    <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleCalculateAll}
                            disabled={!allCalculatorsHaveData}
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
                            Calculate
                        </Button>
                    </Box>

                    {/* Results Section */}
                    {hasAnyResults && (
                        <Box sx={{ marginTop: 6 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: "#00473C",
                                    fontWeight: 700,
                                    marginBottom: 3,
                                    textAlign: "center",
                                }}
                            >
                                Results
                            </Typography>

                            {selectedCalculators.map((id) => {
                                const data = calculatorData[id]
                                if (!data?.result) return null

                                return (
                                    <Box
                                        key={id}
                                        sx={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                            padding: { xs: 2, sm: 3 },
                                            marginBottom: 2,
                                            border: "2px solid #00473C",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "#00473C",
                                                fontWeight: 600,
                                                marginBottom: 2,
                                            }}
                                        >
                                            {data.config.name}
                                        </Typography>
                                        
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    color: "#00473C",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {data.result.value} {data.result.unit}
                                            </Typography>
                                            {data.result.category && (
                                                <Box
                                                    sx={{
                                                        backgroundColor: getCategoryColor(
                                                            data.result.category,
                                                        ),
                                                        borderRadius: "4px",
                                                        padding: "6px 12px",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#ffffff",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {data.result.category}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#666",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {data.result.interpretation}
                                        </Typography>
                                    </Box>
                                )
                            })}

                            {/* Generate PDF Button */}
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleGeneratePDF}
                                    startIcon={<Printer size={20} weight="bold" />}
                                    sx={{
                                        backgroundColor: "#00473C",
                                        color: "#ffffff",
                                        padding: "12px 32px",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        "&:hover": {
                                            backgroundColor: "#01b011",
                                        },
                                    }}
                                >
                                    Generate PDF Report
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* PDF Preview Modal */}
                {hasAnyResults && (
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
