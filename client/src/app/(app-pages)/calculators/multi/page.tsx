"use client"
import React, { useState, useEffect, useMemo } from "react"
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import { useSearchParams } from "next/navigation"
import { calculatorConfigs } from "@/utils/calculatorConfigs"
import { CalculatorResult, CalculatorConfig, CalculatorField } from "@/utils/types"
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
    const [sharedInputs, setSharedInputs] = useState<Record<string, string | number>>({})
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

    // Get all unique fields from selected calculators
    const uniqueFields = useMemo(() => {
        const fieldMap = new Map<string, CalculatorField>()
        
        selectedCalculators.forEach((id) => {
            const config = calculatorConfigs[id as keyof typeof calculatorConfigs]
            if (config) {
                config.fields.forEach((field) => {
                    if (!fieldMap.has(field.id)) {
                        fieldMap.set(field.id, field)
                    }
                })
            }
        })
        
        return Array.from(fieldMap.values())
    }, [selectedCalculators])

    // Get which calculators are using this field
    const getCalculatorsUsingField = (fieldId: string): string[] => {
        return selectedCalculators.filter((id) => {
            const config = calculatorConfigs[id as keyof typeof calculatorConfigs]
            return config?.fields.some((f) => f.id === fieldId)
        })
    }

    const handleInputChange = (fieldId: string, value: string | number) => {
        setSharedInputs((prev) => ({
            ...prev,
            [fieldId]: value,
        }))
    }

    const handleCalculateAll = () => {
        const updatedData = { ...calculatorData }

        selectedCalculators.forEach((id) => {
            const data = updatedData[id]
            // Check if all required fields for this calculator are filled
            const allFieldsFilled = data.config.fields.every((field) => {
                if (!field.required) return true
                const value = sharedInputs[field.id]
                return value !== undefined && value !== "" && value !== null
            })

            if (allFieldsFilled) {
                // Build inputs object for this calculator from shared inputs
                const calculatorInputs: Record<string, string | number> = {}
                data.config.fields.forEach((field) => {
                    calculatorInputs[field.id] = sharedInputs[field.id]
                })

                const result = data.config.calculate(calculatorInputs)
                updatedData[id] = {
                    ...updatedData[id],
                    inputs: calculatorInputs,
                    result,
                }
            }
        })

        setCalculatorData(updatedData)
    }

    const handleGeneratePDF = () => {
        handleCalculateAll()
        setShowPDFModal(true)
    }

    const allRequiredFieldsFilled = uniqueFields.every((field) => {
        if (!field.required) return true
        const value = sharedInputs[field.id]
        return value !== undefined && value !== "" && value !== null
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
                        maxWidth: "900px",
                        margin: "0 auto",
                        padding: { xs: 2, sm: 3 },
                    }}
                >
                    {/* Selected Calculators Info */}
                    <Box sx={{ marginBottom: 3 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#00473C",
                                fontWeight: 600,
                                marginBottom: 1,
                            }}
                        >
                            Selected Calculators:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {selectedCalculators.map((id) => {
                                const config = calculatorConfigs[id as keyof typeof calculatorConfigs]
                                return (
                                    <Box
                                        key={id}
                                        sx={{
                                            backgroundColor: "#FAF9F6",
                                            border: "1px solid #00473C",
                                            borderRadius: "4px",
                                            padding: "4px 12px",
                                            fontSize: "0.875rem",
                                            color: "#00473C",
                                        }}
                                    >
                                        {config?.name}
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>

                    {/* Unified Form with Shared Inputs */}
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
                            variant="h6"
                            sx={{
                                color: "#00473C",
                                fontWeight: 600,
                                marginBottom: 3,
                                fontSize: { xs: "1rem", sm: "1.25rem" },
                            }}
                        >
                            Enter Your Information
                        </Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2.5 }}>
                            {uniqueFields.map((field) => {
                                const usingCalculators = getCalculatorsUsingField(field.id)
                                const calculatorNames = usingCalculators
                                    .map(id => calculatorConfigs[id as keyof typeof calculatorConfigs]?.name)
                                    .join(", ")

                                return (
                                    <Box key={field.id}>
                                        {field.type === "select" ? (
                                            <FormControl fullWidth>
                                                <InputLabel
                                                    sx={{
                                                        color: "#00473C",
                                                        "&.Mui-focused": {
                                                            color: "#00473C",
                                                        },
                                                    }}
                                                >
                                                    {field.label}
                                                    {field.required && " *"}
                                                </InputLabel>
                                                <Select
                                                    value={sharedInputs[field.id] ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(field.id, e.target.value)
                                                    }
                                                    label={`${field.label}${field.required ? " *" : ""}`}
                                                    sx={{
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "#00473C",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "#01b011",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "#00473C",
                                                        },
                                                    }}
                                                >
                                                    {field.options?.map((option) => (
                                                        <MenuItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                label={field.label}
                                                type={field.type}
                                                value={sharedInputs[field.id] ?? ""}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        field.id,
                                                        field.type === "number"
                                                            ? Number(e.target.value)
                                                            : e.target.value,
                                                    )
                                                }
                                                required={field.required}
                                                inputProps={{
                                                    min: field.min,
                                                    max: field.max,
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": {
                                                            borderColor: "#00473C",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#01b011",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#00473C",
                                                        },
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#00473C",
                                                        "&.Mui-focused": {
                                                            color: "#00473C",
                                                        },
                                                    },
                                                }}
                                                helperText={`${field.unit ? `Unit: ${field.unit}` : ""} ${usingCalculators.length > 1 ? `(Used by: ${calculatorNames})` : ""}`}
                                            />
                                        )}
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>

                    {/* Calculate Button */}
                    <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleCalculateAll}
                            disabled={!allRequiredFieldsFilled}
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
