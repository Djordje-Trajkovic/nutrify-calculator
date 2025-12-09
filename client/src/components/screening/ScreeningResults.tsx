"use client"
import React from "react"
import { Button, Typography, Box } from "@mui/material"
import { Printer, PencilSimple } from "@phosphor-icons/react"
import Link from "next/link"

type Props = {
    screeningName: string
    score: number
    interpretation: string
    riskLevel: string
    onEditData: () => void
    onPrintPage: () => void
}

export default function ScreeningResults({
    screeningName,
    score,
    interpretation,
    riskLevel,
    onEditData,
    onPrintPage,
}: Props) {
    const getRiskLevelColor = () => {
        if (riskLevel.toLowerCase().includes("high")) return "#d32f2f"
        if (riskLevel.toLowerCase().includes("moderate")) return "#f57c00"
        return "#01b011"
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
                    {screeningName}
                </Typography>

                {/* Score Display */}
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
                        Total Score
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            color: "#00473C",
                            fontWeight: 700,
                            fontSize: { xs: "3rem", sm: "4rem" },
                        }}
                    >
                        {score}
                    </Typography>
                </Box>

                {/* Risk Level */}
                <Box
                    sx={{
                        backgroundColor: getRiskLevelColor(),
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
                        {riskLevel}
                    </Typography>
                </Box>

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
                        {interpretation}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        justifyContent: "center",
                        marginBottom: 3,
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
                        Print page
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

                {/* Link to Calculator */}
                <Box sx={{ marginTop: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#666",
                            marginBottom: 1,
                        }}
                    >
                        Based on these results, you may want to:
                    </Typography>
                    <Link
                        href="/calculator"
                        style={{
                            color: "#01b011",
                            textDecoration: "none",
                            fontWeight: 600,
                            fontSize: "1rem",
                        }}
                    >
                        Calculate nutritional goals →
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}
