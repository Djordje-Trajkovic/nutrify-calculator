"use client"
import { ScreeningQuestion } from "@/utils/types"
import ScreeningPDFDocument from "./ScreeningPDFDocument"
import UniversalPDFPreviewModal from "../util/PDFPreviewModal"

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
    const fileName = `${screeningName.replace(/\s+/g, "_")}_Report.pdf`

    return (
        <UniversalPDFPreviewModal
            open={open}
            onClose={onClose}
            title={screeningName}
            fileName={fileName}
            pdfDocument={
                <ScreeningPDFDocument
                    screeningName={screeningName}
                    questions={questions}
                    selections={selections}
                    score={score}
                    interpretation={interpretation}
                    riskLevel={riskLevel}
                />
            }
        />
    )
}
