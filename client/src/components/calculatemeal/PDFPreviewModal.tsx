"use client"
import { Meal } from "../../utils/types"
import PDFDocument from "./PDFDocument"
import UniversalPDFPreviewModal from "../util/PDFPreviewModal"

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
    return (
        <UniversalPDFPreviewModal
            open={open}
            onClose={onClose}
            title={mealPlanName || "Meal Plan"}
            fileName={`${mealPlanName || "meal-plan"}.pdf`}
            pdfDocument={
                <PDFDocument meals={meals} mealPlanName={mealPlanName} />
            }
        />
    )
}
