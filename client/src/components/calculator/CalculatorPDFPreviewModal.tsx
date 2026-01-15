"use client"
import { useState } from "react"
import { Modal, Box, Button, CircularProgress } from "@mui/material"
import { PDFViewer, pdf } from "@react-pdf/renderer"
import { X } from "@phosphor-icons/react"
import CalculatorPDFDocument from "./CalculatorPDFDocument"
import { CalculatorField, CalculatorResult } from "@/utils/types"

type Props = {
    open: boolean
    onClose: () => void
    calculatorName: string
    fields: CalculatorField[]
    inputs: Record<string, string | number>
    result: CalculatorResult
}

export default function CalculatorPDFPreviewModal({
    open,
    onClose,
    calculatorName,
    fields,
    inputs,
    result,
}: Props) {
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const blob = await pdf(
                <CalculatorPDFDocument
                    calculatorName={calculatorName}
                    fields={fields}
                    inputs={inputs}
                    result={result}
                />,
            ).toBlob()

            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            const fileName = `${calculatorName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading PDF:", error)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="pdf-preview-modal"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "95%", sm: "90%", md: "80%" },
                    height: { xs: "95%", sm: "90%", md: "85%" },
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2,
                        borderBottom: "1px solid #e0e0e0",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            sx={{
                                backgroundColor: "#00473C",
                                color: "#ffffff",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#01b011",
                                },
                            }}
                        >
                            {isDownloading ? (
                                <>
                                    <CircularProgress
                                        size={16}
                                        sx={{ marginRight: 1, color: "#ffffff" }}
                                    />
                                    Downloading...
                                </>
                            ) : (
                                "Download PDF"
                            )}
                        </Button>
                    </Box>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <X size={24} weight="bold" color="#00473C" />
                    </button>
                </Box>

                {/* PDF Viewer */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <PDFViewer
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                        }}
                    >
                        <CalculatorPDFDocument
                            calculatorName={calculatorName}
                            fields={fields}
                            inputs={inputs}
                            result={result}
                        />
                    </PDFViewer>
                </Box>
            </Box>
        </Modal>
    )
}
