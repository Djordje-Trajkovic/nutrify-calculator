"use client"
import { useState, useCallback, useEffect } from "react"
import { Modal, Button, CircularProgress } from "@mui/material"
import { X, DownloadSimple } from "@phosphor-icons/react"
import { pdf } from "@react-pdf/renderer"
import { Meal } from "../../utils/types"
import PDFDocument from "./PDFDocument"

type Props = {
    open: boolean
    onClose: () => void
    meals: Meal[]
    mealPlanName: string
}

export default function PDFPreviewModal({
    open,
    onClose,
    meals,
    mealPlanName,
}: Props) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const generatePdfUrl = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const blob = await pdf(
                <PDFDocument meals={meals} mealPlanName={mealPlanName} />,
            ).toBlob()
            const url = URL.createObjectURL(blob)
            setPdfUrl(url)
        } catch (err) {
            console.error("Error generating PDF:", err)
            setError("Failed to generate PDF preview. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [meals, mealPlanName])

    // Generate PDF when modal opens using useEffect
    useEffect(() => {
        if (open && !pdfUrl && !isLoading && !error) {
            generatePdfUrl()
        }
    }, [open, pdfUrl, isLoading, error, generatePdfUrl])

    // Clean up URL when modal closes
    const handleClose = () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl)
            setPdfUrl(null)
        }
        setError(null)
        onClose()
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const blob = await pdf(
                <PDFDocument meals={meals} mealPlanName={mealPlanName} />,
            ).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `${mealPlanName || "meal-plan"}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Error downloading PDF:", err)
            setError("Failed to download PDF. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center"
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "95vh",
                    width: "95vw",
                    maxWidth: "1400px",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 24px",
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: "#00473C",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            margin: 0,
                        }}
                    >
                        PDF Preview - {mealPlanName || "Meal Plan"}
                    </h2>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                            variant="contained"
                            onClick={handleDownload}
                            disabled={isDownloading || isLoading}
                            style={{
                                backgroundColor: "#10b981",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {isDownloading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <DownloadSimple size={20} weight="bold" />
                            )}
                            Download PDF
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            style={{
                                borderColor: "#ffffff",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                textTransform: "none",
                            }}
                        >
                            <X size={20} />
                            Close
                        </Button>
                    </div>
                </div>

                {/* PDF Preview Area */}
                <div
                    style={{
                        flex: 1,
                        overflow: "hidden",
                        backgroundColor: "#374151",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {isLoading && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: "16px",
                            }}
                        >
                            <CircularProgress
                                size={48}
                                style={{ color: "#ffffff" }}
                            />
                            <span
                                style={{ color: "#ffffff", fontWeight: 500 }}
                            >
                                Generating PDF preview...
                            </span>
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: "16px",
                                color: "#ef4444",
                            }}
                        >
                            <span>{error}</span>
                            <Button
                                variant="contained"
                                onClick={generatePdfUrl}
                                style={{
                                    backgroundColor: "#00473C",
                                    color: "#ffffff",
                                }}
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {pdfUrl && !isLoading && !error && (
                        <iframe
                            src={pdfUrl}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                            title="PDF Preview"
                        />
                    )}
                </div>
            </div>
        </Modal>
    )
}
