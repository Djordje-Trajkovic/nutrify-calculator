"use client"
import CalculatorPDFDocument from "./CalculatorPDFDocument"
import { CalculatorField, CalculatorResult } from "@/utils/types"
import UniversalPDFPreviewModal from "../util/PDFPreviewModal"

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
    const fileName = `${calculatorName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`

    return (
        <UniversalPDFPreviewModal
            open={open}
            onClose={onClose}
            title={calculatorName}
            fileName={fileName}
            pdfDocument={
                <CalculatorPDFDocument
                    calculatorName={calculatorName}
                    fields={fields}
                    inputs={inputs}
                    result={result}
                />
            }
        />
    )
}
