"use client"
import React from "react"
import { Button, Typography, Box } from "@mui/material"
import { Printer, PencilSimple } from "@phosphor-icons/react"
import { CalculatorResult } from "@/utils/types"

type Props = {
    calculatorName: string
    result: CalculatorResult
    onEditData: () => void
    onPrintPage: () => void
}

export default function CalculatorResults({
    calculatorName,
    result,
    onEditData,
    onPrintPage,
}: Props) {
    const getCategoryColor = () => {
        if (!result.category) return "#00473C"
        
        const category = result.category.toLowerCase()
        if (category.includes("severe") || category.includes("obese class iii")) {
            return "#d32f2f"
        }
        if (
            category.includes("moderate") ||
            category.includes("overweight") ||
            category.includes("obese")
        ) {
            return "#f57c00"
        }
        if (category.includes("normal") || category.includes("ideal")) {
            return "#01b011"
        }
        return "#00473C"
    }

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                padding: { xs: 3, sm: 4, md: 5 },
            }}
        >
            <Box
                sx={{
                    backgroundColor: "#FAF9F6",
                    borderRadius: "12px",
                    padding: { xs: 3, sm: 4, md: 5 },
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }}
            >
                {/* Title */}
                <Typography
                    variant="h4"
                    sx={{
                        color: "#00473C",
                        fontWeight: 700,
                        marginBottom: 3,
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                    }}
                >
                    {calculatorName}
                </Typography>

                {/* Result Display */}
                <Box
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: 3,
                        marginBottom: 3,
                        border: "2px solid #00473C",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#666",
                            fontWeight: 500,
                            marginBottom: 1,
                        }}
                    >
                        Result
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#00473C",
                            fontWeight: 700,
                            fontSize: { xs: "2.5rem", sm: "3.5rem" },
                        }}
                    >
                        {result.value}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#666",
                            fontWeight: 500,
                            marginTop: 1,
                        }}
                    >
                        {result.unit}
                    </Typography>
                </Box>

                {/* Category */}
                {result.category && (
                    <Box
                        sx={{
                            backgroundColor: getCategoryColor(),
                            borderRadius: "8px",
                            padding: 2,
                            marginBottom: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                            }}
                        >
                            {result.category}
                        </Typography>
                    </Box>
                )}

                {/* Interpretation */}
                <Box
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: 3,
                        marginBottom: 4,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#333",
                            fontSize: { xs: "0.95rem", sm: "1.1rem" },
                            lineHeight: 1.7,
                            textAlign: "left",
                        }}
                    >
                        {result.interpretation}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={onPrintPage}
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
                        Print / Save PDF
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onEditData}
                        startIcon={<PencilSimple size={20} weight="bold" />}
                        sx={{
                            borderColor: "#00473C",
                            color: "#00473C",
                            padding: "12px 32px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#00473C",
                                color: "#ffffff",
                                borderColor: "#00473C",
                            },
                        }}
                    >
                        Edit data
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
