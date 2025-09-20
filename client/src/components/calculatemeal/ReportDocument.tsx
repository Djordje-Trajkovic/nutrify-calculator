// ReportDocument.tsx
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import PDFMealTable from "./PDFMealTable"
import { Meal } from "../../utils/types" // adjust import

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff",
        color: "#00473C",
        fontFamily: "Helvetica",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    heading: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#00473C",
    },
})

type Props = {
    meals: Meal[]
}

export default function ReportDocument({ meals }: Props) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Nutritional Report</Text>
                </View>

                {/* Sections */}
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Kcal",
                        "Amount",
                        "Volume_per_Unit",
                        "Water",
                        "Ashes",
                    ]}
                />
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Protein_total",
                        "Protein_plant",
                        "Protein_animal",
                        "Protein_Whey",
                        "Protein_Casein",
                        "Protein_Carnitine",
                        "Protein_taurine",
                        "Protein_Essential_Amino_Acids",
                        "Protein_L_Arginin",
                        "Protein_L_Leucin",
                    ]}
                />
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Fat_total",
                        "Fat_saturated",
                        "Fat_unsaturated",
                        "Fat_la",
                        "Fat_aa",
                        "Fat_ala",
                        "Fat_dha",
                        "Fat_epa",
                        "Fat_mct",
                        "MCT_TCM_ratio",
                        "Fatty_Acids_C6",
                        "Fatty_Acids_C8",
                        "Fatty_Acids_C10",
                        "Fatty_Acids_C12",
                        "Fatty_Acids_C14",
                    ]}
                />
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Carbohydrates_total",
                        "Carbohydrates_mono",
                        "Carbohydrates_poli",
                        "Carbohydrates_fructose",
                        "Carbohydrates_glucose",
                        "Carbohydrates_sucrose",
                        "Carbohydrates_lactose",
                        "Carbohydrates_maltose",
                        "Carbohydrates_isomaltulose",
                        "Carbohydrates_Noncaloric_Carbohydrates",
                        "Carbohydrates_Organic_Acids",
                        "Carbohydrates_Polyols",
                        "Fiber_total",
                        "Fiber_Soluble",
                        "Fiber_Insoluble",
                        "Fiber_Fructooligosaccharides",
                        "Fiber_Galactooligosaccharides",
                        "Sugars",
                    ]}
                />
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Cholesterol",
                        "Atherogenic_index",
                        "Glycemic_index",
                        "Glycemic_load",
                    ]}
                />
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Mineral_Na",
                        "Mineral_K",
                        "Mineral_Ca",
                        "Mineral_Mg",
                        "Mineral_P",
                        "Mineral_Fe",
                        "Mineral_Zn",
                        "Mineral_Cu",
                        "Mineral_Cl",
                        "Mineral_Cr",
                        "Mineral_F",
                        "Mineral_Jod",
                        "Mineral_Mn",
                        "Mineral_Mo",
                        "Mineral_S",
                        "Mineral_Se",
                        "Phosphates",
                    ]}
                />
                <PDFMealTable
                    meals={meals}
                    fields={[
                        "Vitamin_A",
                        "Vitamin_RE",
                        "Carotenoids",
                        "Vitamin_B1",
                        "Vitamin_B2",
                        "Vitamin_B3",
                        "Vitamin_B4_Holin",
                        "Vitamin_B5",
                        "Vitamin_B6",
                        "Vitamin_B7",
                        "Vitamin_B8_Inositol",
                        "Vitamin_B9_Folic_Acid",
                        "Vitamin_B12",
                        "Vitamin_PP",
                        "Vitamin_C",
                        "Vitamin_D",
                        "Vitamin_E",
                        "Vitamin_K",
                        "Nucleotides",
                    ]}
                />
            </Page>
        </Document>
    )
}
