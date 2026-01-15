"use client"
import { useState } from "react"
import Link from "next/link"
import { Box, Typography, Button, Checkbox, FormControlLabel } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import { useRouter } from "next/navigation"

export default function CalculatorsPage() {
    const [selectedCalculators, setSelectedCalculators] = useState<string[]>([])
    const router = useRouter()

    const calculatorOptions = [
        {
            id: "bmi",
            title: "BMI Calculator",
            description: "Body Mass Index - Measure body fat based on height and weight",
            href: "/calculators/bmi",
        },
        {
            id: "harris-benedict",
            title: "Harris-Benedict Equation",
            description: "Calculate BMR using the Harris-Benedict equation (revised 1984)",
            href: "/calculators/harris-benedict",
        },
        {
            id: "schofield",
            title: "Schofield (WHO) Equation",
            description: "Calculate BMR using the WHO-recommended Schofield equation",
            href: "/calculators/schofield",
        },
        {
            id: "bmr",
            title: "Mifflin-St.Jeor Equation",
            description: "Calculate BMR using the Mifflin-St.Jeor equation",
            href: "/calculators/bmr",
        },
        {
            id: "owen",
            title: "Owen Equation",
            description: "Calculate BMR using the Owen equation",
            href: "/calculators/owen",
        },
        {
            id: "cunningham",
            title: "Cunningham Equation",
            description: "Calculate RMR using lean body mass",
            href: "/calculators/cunningham",
        },
        {
            id: "ireton-jones",
            title: "Ireton-Jones Equation",
            description: "Calculate energy needs for critically ill patients",
            href: "/calculators/ireton-jones",
        },
        {
            id: "tdee",
            title: "TDEE Calculator",
            description: "Total Daily Energy Expenditure - Estimate your daily calorie needs",
            href: "/calculators/tdee",
        },
        {
            id: "ibw",
            title: "IBW Calculator",
            description: "Ideal Body Weight - Calculate your healthy weight range",
            href: "/calculators/ibw",
        },
    ]

    const handleCheckboxChange = (calculatorId: string) => {
        setSelectedCalculators((prev) => {
            if (prev.includes(calculatorId)) {
                return prev.filter((id) => id !== calculatorId)
            } else {
                return [...prev, calculatorId]
            }
        })
    }

    const handleProceed = () => {
        if (selectedCalculators.length > 0) {
            const query = new URLSearchParams({ calculators: selectedCalculators.join(",") })
            router.push(`/calculators/multi?${query.toString()}`)
        }
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
                        Nutrition Calculators
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            marginBottom: 3,
                        }}
                    >
                        Select one or more calculators to use and generate a combined report
                    </Typography>
                </Box>

                <Box
                    sx={{
                        maxWidth: "1000px",
                        margin: "0 auto",
                        padding: { xs: 2, sm: 3 },
                    }}
                >
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#00473C",
                                fontWeight: 600,
                                marginBottom: 2,
                            }}
                        >
                            Choose Calculators (select multiple)
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            {calculatorOptions.map((option) => (
                                <Box
                                    key={option.id}
                                    sx={{
                                        border: selectedCalculators.includes(option.id)
                                            ? "2px solid #00473C"
                                            : "1px solid #e0e0e0",
                                        borderRadius: "8px",
                                        padding: 2,
                                        backgroundColor: selectedCalculators.includes(option.id)
                                            ? "#FAF9F6"
                                            : "#ffffff",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "#00473C",
                                            backgroundColor: "#FAF9F6",
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedCalculators.includes(option.id)}
                                                onChange={() => handleCheckboxChange(option.id)}
                                                sx={{
                                                    color: "#00473C",
                                                    "&.Mui-checked": {
                                                        color: "#00473C",
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "#00473C",
                                                        marginBottom: 0.5,
                                                    }}
                                                >
                                                    {option.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#666",
                                                        fontSize: "0.875rem",
                                                    }}
                                                >
                                                    {option.description}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ margin: 0, width: "100%" }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            marginTop: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleProceed}
                            disabled={selectedCalculators.length === 0}
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
                                "&:disabled": {
                                    backgroundColor: "#cccccc",
                                    color: "#666666",
                                },
                            }}
                        >
                            Proceed with Selected ({selectedCalculators.length})
                        </Button>
                    </Box>

                    <Box sx={{ marginTop: 4, textAlign: "center" }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#666",
                                marginBottom: 2,
                            }}
                        >
                            Or use individual calculators:
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: 2,
                            }}
                        >
                            {calculatorOptions.map((option) => (
                                <Link
                                    key={option.id}
                                    href={option.href}
                                    style={{
                                        color: "#01b011",
                                        textDecoration: "none",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {option.title} →
                                </Link>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </AppContainer>
    )
}
