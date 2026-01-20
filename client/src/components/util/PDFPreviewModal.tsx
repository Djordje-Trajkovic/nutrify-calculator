"use client"
import { useState, useCallback, useEffect, ReactElement, JSXElementConstructor, useRef } from "react"
import { Modal, Button, CircularProgress, IconButton, Tooltip } from "@mui/material"
import { X, DownloadSimple, MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowsOut } from "@phosphor-icons/react"
import { pdf } from "@react-pdf/renderer"

type Props = {
    open: boolean
    onClose: () => void
    title: string
    fileName?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfDocument: ReactElement<any, string | JSXElementConstructor<any>>
}

export default function PDFPreviewModal({
    open,
    onClose,
    title,
    fileName,
    pdfDocument,
}: Props) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [zoom, setZoom] = useState(100)
    const [isPanning, setIsPanning] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    const generatePdfUrl = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const blob = await pdf(pdfDocument).toBlob()
            const url = URL.createObjectURL(blob)
            setPdfUrl(url)
        } catch (err) {
            console.error("Error generating PDF:", err)
            setError("Failed to generate PDF preview. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [pdfDocument])

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
        setZoom(100)
        setPosition({ x: 0, y: 0 })
        onClose()
    }

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 25, 300))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 25, 50))
    }

    const handleResetZoom = () => {
        setZoom(100)
        setPosition({ x: 0, y: 0 })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 100) {
            e.preventDefault() // Prevent text selection
            setIsPanning(true)
            setStartPos({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning && zoom > 100) {
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y,
            })
        }
    }

    const handleMouseUp = () => {
        setIsPanning(false)
    }

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.deltaY < 0) {
                handleZoomIn()
            } else {
                handleZoomOut()
            }
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            const blob = await pdf(pdfDocument).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = fileName || `${title.replace(/\s+/g, "_")}.pdf`
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
                        PDF Preview - {title}
                    </h2>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        {/* Zoom Controls */}
                        <div
                            style={{
                                display: "flex",
                                gap: "4px",
                                alignItems: "center",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                padding: "4px",
                            }}
                        >
                            <Tooltip title="Zoom Out">
                                <IconButton
                                    onClick={handleZoomOut}
                                    disabled={zoom <= 50}
                                    size="small"
                                    style={{
                                        color: "#ffffff",
                                    }}
                                >
                                    <MagnifyingGlassMinus size={20} weight="bold" />
                                </IconButton>
                            </Tooltip>
                            <span
                                style={{
                                    color: "#ffffff",
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    minWidth: "50px",
                                    textAlign: "center",
                                }}
                            >
                                {zoom}%
                            </span>
                            <Tooltip title="Zoom In">
                                <IconButton
                                    onClick={handleZoomIn}
                                    disabled={zoom >= 300}
                                    size="small"
                                    style={{
                                        color: "#ffffff",
                                    }}
                                >
                                    <MagnifyingGlassPlus size={20} weight="bold" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset Zoom">
                                <IconButton
                                    onClick={handleResetZoom}
                                    size="small"
                                    style={{
                                        color: "#ffffff",
                                    }}
                                >
                                    <ArrowsOut size={20} weight="bold" />
                                </IconButton>
                            </Tooltip>
                        </div>

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
                    ref={containerRef}
                    style={{
                        flex: 1,
                        overflow: zoom > 100 ? "hidden" : "auto",
                        backgroundColor: "#374151",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: zoom > 100 ? (isPanning ? "grabbing" : "grab") : "default",
                        position: "relative",
                        userSelect: zoom > 100 ? "none" : "auto",
                        WebkitUserSelect: zoom > 100 ? "none" : "auto",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
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
                        <div
                            style={{
                                transform: `scale(${zoom / 100}) translate(${position.x / (zoom / 100)}px, ${position.y / (zoom / 100)}px)`,
                                transformOrigin: "center center",
                                transition: isPanning ? "none" : "transform 0.2s ease-out",
                                width: "100%",
                                height: "100%",
                                pointerEvents: zoom > 100 ? "none" : "auto",
                                userSelect: "none",
                                WebkitUserSelect: "none",
                            }}
                        >
                            <iframe
                                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
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
