import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"
import { Meal, NutritionalFields } from "../../utils/types"
import PDFMealTable from "./PDFMealTable"

type Props = {
    meals: Meal[]
    mealPlanName: string
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#00473C",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: "#666666",
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 8,
        marginTop: 15,
    },
    tableSection: {
        marginBottom: 10,
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 8,
        color: "#666666",
        borderTopWidth: 1,
        borderTopColor: "#cccccc",
        paddingTop: 8,
    },
    pageNumber: {
        fontSize: 8,
        color: "#666666",
    },
})

// Define field groups for nutritional categories
const fieldGroups: {
    title: string
    fields: (keyof NutritionalFields)[]
}[] = [
    {
        title: "Basic Information",
        fields: ["Kcal", "Amount", "Volume_per_Unit", "Water", "Ashes"],
    },
    {
        title: "Proteins",
        fields: [
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
        ],
    },
    {
        title: "Fats",
        fields: [
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
        ],
    },
    {
        title: "Carbohydrates (Simple)",
        fields: [
            "Carbohydrates_total",
            "Carbohydrates_mono",
            "Carbohydrates_poli",
            "Carbohydrates_fructose",
            "Carbohydrates_glucose",
            "Carbohydrates_sucrose",
            "Carbohydrates_lactose",
            "Carbohydrates_maltose",
            "Carbohydrates_isomaltulose",
        ],
    },
    {
        title: "Carbohydrates (Complex) & Fiber",
        fields: [
            "Carbohydrates_Noncaloric_Carbohydrates",
            "Carbohydrates_Organic_Acids",
            "Carbohydrates_Polyols",
            "Fiber_total",
            "Fiber_Soluble",
            "Fiber_Insoluble",
            "Fiber_Fructooligosaccharides",
            "Fiber_Galactooligosaccharides",
            "Sugars",
        ],
    },
    {
        title: "Health Indices",
        fields: ["Cholesterol", "Atherogenic_index", "Glycemic_index"],
    },
    {
        title: "Minerals",
        fields: [
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
        ],
    },
    {
        title: "Vitamins",
        fields: [
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
        ],
    },
]

export default function PDFDocument({ meals, mealPlanName }: Props) {
    const generationDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Header */}
                <View style={styles.header} fixed>
                    <Text style={styles.title}>
                        {mealPlanName || "Meal Plan"} - Nutritional Report
                    </Text>
                    <Text style={styles.subtitle}>
                        Generated on: {generationDate}
                    </Text>
                </View>

                {/* Tables for each field group */}
                {fieldGroups.map((group) => (
                    <View key={group.title} style={styles.tableSection}>
                        <Text style={styles.sectionTitle}>{group.title}</Text>
                        <PDFMealTable meals={meals} fields={group.fields} />
                    </View>
                ))}

                {/* Footer with page numbers */}
                <View style={styles.footer} fixed>
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `Page ${pageNumber} of ${totalPages} | ${mealPlanName || "Meal Plan"}`
                        }
                    />
                </View>
            </Page>
        </Document>
    )
}
