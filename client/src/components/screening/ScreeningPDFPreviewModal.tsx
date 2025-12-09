"use client"
import { useState, useCallback, useEffect } from "react"
import { Modal, Button, CircularProgress } from "@mui/material"
import { X, DownloadSimple } from "@phosphor-icons/react"
import { pdf } from "@react-pdf/renderer"
import { ScreeningQuestion } from "@/utils/types"
import ScreeningPDFDocument from "./ScreeningPDFDocument"

type Props = {
    open: boolean
    onClose: () => void
    screeningName: string
    questions: ScreeningQuestion[]
    selections: Record<string, string | number>
    score: number
    interpretation: string
    riskLevel: string
}

export default function ScreeningPDFPreviewModal({
    open,
    onClose,
    screeningName,
    questions,
    selections,
    score,
    interpretation,
    riskLevel,
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
                <ScreeningPDFDocument
                    screeningName={screeningName}
                    questions={questions}
                    selections={selections}
                    score={score}
                    interpretation={interpretation}
                    riskLevel={riskLevel}
                />,
            ).toBlob()
            const url = URL.createObjectURL(blob)
            setPdfUrl(url)
        } catch (err) {
            console.error("Error generating PDF:", err)
            setError("Failed to generate PDF preview. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [screeningName, questions, selections, score, interpretation, riskLevel])

    // Generate PDF when modal opens
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
                <ScreeningPDFDocument
                    screeningName={screeningName}
                    questions={questions}
                    selections={selections}
                    score={score}
                    interpretation={interpretation}
                    riskLevel={riskLevel}
                />,
            ).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `${screeningName.replace(/\s+/g, "_")}_Report.pdf`
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
                        PDF Preview - {screeningName}
                    </h2>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <Button
                            variant="contained"
                            onClick={handleDownload}
                            disabled={isDownloading || isLoading}
                            style={{
                                backgroundColor: "#01b011",
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
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
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
