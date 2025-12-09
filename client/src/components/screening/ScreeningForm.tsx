"use client"
import React from "react"
import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Button,
    Typography,
    Box,
} from "@mui/material"
import { ScreeningQuestion } from "@/utils/types"

type Props = {
    questions: ScreeningQuestion[]
    selections: Record<string, string | number>
    onSelectionChange: (questionId: string, value: string | number) => void
    onEvaluate: () => void
}

export default function ScreeningForm({
    questions,
    selections,
    onSelectionChange,
    onEvaluate,
}: Props) {
    const allQuestionsAnswered = questions.every(
        (question) => selections[question.id] !== undefined,
    )

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto",
                padding: { xs: 2, sm: 3, md: 4 },
            }}
        >
            {questions.map((question, index) => (
                <Box
                    key={question.id}
                    sx={{
                        backgroundColor: "#FAF9F6",
                        borderRadius: "8px",
                        padding: { xs: 2, sm: 3 },
                        marginBottom: 3,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        border: "1px solid #e0e0e0",
                    }}
                >
                    {question.section && (
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#01b011",
                                fontWeight: 600,
                                display: "block",
                                marginBottom: 1,
                            }}
                        >
                            {question.section}
                        </Typography>
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#00473C",
                            fontWeight: 600,
                            marginBottom: 2,
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}
                    >
                        {index + 1}. {question.title}
                    </Typography>

                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            value={selections[question.id] ?? ""}
                            onChange={(e) =>
                                onSelectionChange(
                                    question.id,
                                    isNaN(Number(e.target.value))
                                        ? e.target.value
                                        : Number(e.target.value),
                                )
                            }
                        >
                            {question.options.map((option) => (
                                <Box
                                    key={option.value}
                                    sx={{
                                        marginBottom: 1.5,
                                        padding: 1.5,
                                        borderRadius: "6px",
                                        border: "1px solid transparent",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                            borderColor: "#00473C",
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        value={option.value}
                                        control={
                                            <Radio
                                                sx={{
                                                    color: "#00473C",
                                                    "&.Mui-checked": {
                                                        color: "#01b011",
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 500,
                                                        color: "#333",
                                                    }}
                                                >
                                                    {option.label}
                                                </Typography>
                                                {option.description && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#666",
                                                            marginTop: 0.5,
                                                        }}
                                                    >
                                                        {option.description}
                                                    </Typography>
                                                )}
                                                {option.details &&
                                                    option.details.length > 0 && (
                                                        <Box
                                                            component="ul"
                                                            sx={{
                                                                marginTop: 0.5,
                                                                marginLeft: 2,
                                                                paddingLeft: 1,
                                                            }}
                                                        >
                                                            {option.details.map(
                                                                (
                                                                    detail,
                                                                    idx,
                                                                ) => (
                                                                    <Typography
                                                                        component="li"
                                                                        key={idx}
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: "#666",
                                                                            fontSize:
                                                                                "0.875rem",
                                                                        }}
                                                                    >
                                                                        {detail}
                                                                    </Typography>
                                                                ),
                                                            )}
                                                        </Box>
                                                    )}
                                            </Box>
                                        }
                                        sx={{
                                            margin: 0,
                                            alignItems: "flex-start",
                                            width: "100%",
                                        }}
                                    />
                                </Box>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
            ))}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 4,
                }}
            >
                <Button
                    variant="contained"
                    onClick={onEvaluate}
                    disabled={!allQuestionsAnswered}
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
    )
}
