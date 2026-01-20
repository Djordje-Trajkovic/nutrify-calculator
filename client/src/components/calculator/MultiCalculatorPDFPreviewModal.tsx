"use client"
import MultiCalculatorPDFDocument from "./MultiCalculatorPDFDocument"
import { CalculatorResult, CalculatorConfig } from "@/utils/types"
import UniversalPDFPreviewModal from "../util/PDFPreviewModal"

type CalculatorData = {
    config: CalculatorConfig
    inputs: Record<string, string | number>
    result: CalculatorResult | null
}

type Props = {
    open: boolean
    onClose: () => void
    calculatorData: Record<string, CalculatorData>
    selectedCalculators: string[]
}

export default function MultiCalculatorPDFPreviewModal({
    open,
    onClose,
    calculatorData,
    selectedCalculators,
}: Props) {
    const fileName = `Nutrition_Assessment_Report_${new Date().toISOString().split("T")[0]}.pdf`

    return (
        <UniversalPDFPreviewModal
            open={open}
            onClose={onClose}
            title="Nutrition Assessment Report"
            fileName={fileName}
            pdfDocument={
                <MultiCalculatorPDFDocument
                    calculatorData={calculatorData}
                    selectedCalculators={selectedCalculators}
                />
            }
        />
    )
}
