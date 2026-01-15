"use client"
import React from "react"
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Typography,
} from "@mui/material"
import { CalculatorField } from "@/utils/types"

type Props = {
    fields: CalculatorField[]
    inputs: Record<string, string | number>
    onInputChange: (fieldId: string, value: string | number) => void
    onCalculate: () => void
    calculatorName: string
}

export default function CalculatorForm({
    fields,
    inputs,
    onInputChange,
    onCalculate,
    calculatorName,
}: Props) {
    const allFieldsFilled = fields.every((field) => {
        if (!field.required) return true
        const value = inputs[field.id]
        return value !== undefined && value !== "" && value !== null
    })

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                padding: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    backgroundColor: "#FAF9F6",
                    borderRadius: "8px",
                    padding: { xs: 2, sm: 3 },
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
                    {calculatorName}
                </Typography>

                {fields.map((field) => (
                    <Box key={field.id} sx={{ marginBottom: 2.5 }}>
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
                                    value={inputs[field.id] ?? ""}
                                    onChange={(e) =>
                                        onInputChange(field.id, e.target.value)
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
                                value={inputs[field.id] ?? ""}
                                onChange={(e) =>
                                    onInputChange(
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
                                helperText={field.unit ? `Unit: ${field.unit}` : ""}
                            />
                        )}
                    </Box>
                ))}

                <Button
                    variant="contained"
                    onClick={onCalculate}
                    disabled={!allFieldsFilled}
                    fullWidth
                    sx={{
                        backgroundColor: "#00473C",
                        color: "#ffffff",
                        padding: "12px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        marginTop: 2,
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
        </Box>
    )
}
