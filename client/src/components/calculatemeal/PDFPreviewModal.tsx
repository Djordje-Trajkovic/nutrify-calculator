"use client"
import { useState, useCallback } from "react"
import { Modal, Button, CircularProgress } from "@mui/material"
import {
    MagnifyingGlassPlus,
    MagnifyingGlassMinus,
    X,
    ArrowsOut,
    DownloadSimple,
} from "@phosphor-icons/react"
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
    const [zoom, setZoom] = useState(100)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const minZoom = 25
    const maxZoom = 200
    const zoomStep = 25

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

    // Generate PDF when modal opens
    const handleOpen = useCallback(() => {
        if (open && !pdfUrl && !isLoading) {
            generatePdfUrl()
        }
    }, [open, pdfUrl, isLoading, generatePdfUrl])

    // Call handleOpen when open changes
    if (open && !pdfUrl && !isLoading && !error) {
        handleOpen()
    }

    // Clean up URL when modal closes
    const handleClose = () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl)
            setPdfUrl(null)
        }
        setZoom(100)
        setError(null)
        onClose()
    }

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + zoomStep, maxZoom))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - zoomStep, minZoom))
    }

    const handleResetZoom = () => {
        setZoom(100)
    }

    const handleDownload = async () => {
        setIsLoading(true)
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
            setIsLoading(false)
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

                    {/* Zoom Controls */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleZoomOut}
                            disabled={zoom <= minZoom || isLoading}
                            style={{
                                minWidth: "40px",
                                padding: "8px",
                                borderColor: "#ffffff",
                                color: "#ffffff",
                            }}
                        >
                            <MagnifyingGlassMinus size={20} />
                        </Button>

                        <span
                            style={{
                                color: "#ffffff",
                                minWidth: "60px",
                                textAlign: "center",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            {zoom}%
                        </span>

                        <Button
                            variant="outlined"
                            onClick={handleZoomIn}
                            disabled={zoom >= maxZoom || isLoading}
                            style={{
                                minWidth: "40px",
                                padding: "8px",
                                borderColor: "#ffffff",
                                color: "#ffffff",
                            }}
                        >
                            <MagnifyingGlassPlus size={20} />
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleResetZoom}
                            disabled={isLoading}
                            style={{
                                minWidth: "40px",
                                padding: "8px",
                                borderColor: "#ffffff",
                                color: "#ffffff",
                            }}
                            title="Reset Zoom"
                        >
                            <ArrowsOut size={20} />
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                            variant="contained"
                            onClick={handleDownload}
                            disabled={isLoading}
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
                            {isLoading ? (
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
                        overflow: "auto",
                        backgroundColor: "#f3f4f6",
                        padding: "24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
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
                                style={{ color: "#00473C" }}
                            />
                            <span
                                style={{ color: "#00473C", fontWeight: 500 }}
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
                        <div
                            style={{
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: "top center",
                                transition: "transform 0.2s ease",
                            }}
                        >
                            <iframe
                                src={pdfUrl}
                                style={{
                                    width: "842px", // A4 landscape width in pixels at 96dpi
                                    height: "595px", // A4 landscape height
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    backgroundColor: "#ffffff",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                                title="PDF Preview"
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}
