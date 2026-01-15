import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"
import { CalculatorField, CalculatorResult, CalculatorConfig } from "@/utils/types"

type CalculatorData = {
    config: CalculatorConfig
    inputs: Record<string, string | number>
    result: CalculatorResult | null
}

type Props = {
    calculatorData: Record<string, CalculatorData>
    selectedCalculators: string[]
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 25,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#00473C",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 10,
        color: "#666666",
    },
    calculatorSection: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    calculatorTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#00473C",
        marginTop: 15,
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
        paddingLeft: 10,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 4,
    },
    inputValue: {
        fontSize: 9,
        color: "#666666",
        marginLeft: 10,
    },
    resultContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: "#FAF9F6",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#00473C",
    },
    resultValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#00473C",
        textAlign: "center",
        marginBottom: 10,
    },
    categoryContainer: {
        padding: 8,
        marginBottom: 10,
        backgroundColor: "#00473C",
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    interpretationText: {
        fontSize: 9,
        color: "#333333",
        lineHeight: 1.6,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 9,
        color: "#999999",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        paddingTop: 10,
    },
    summarySection: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: "#FAF9F6",
        borderRadius: 8,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 12,
    },
    summaryItem: {
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    summaryItemName: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 4,
    },
    summaryItemValue: {
        fontSize: 10,
        color: "#666666",
    },
})

export default function MultiCalculatorPDFDocument({
    calculatorData,
    selectedCalculators,
}: Props) {
    const getFieldLabel = (
        field: CalculatorField,
        inputs: Record<string, string | number>,
    ) => {
        if (field.type === "select" && field.options) {
            const option = field.options.find(
                (opt) => opt.value === inputs[field.id],
            )
            return option?.label || String(inputs[field.id])
        }
        return String(inputs[field.id])
    }

    // Get all unique input fields from all selected calculators
    const allFields = new Map<string, { field: CalculatorField; value: string | number }>()
    
    selectedCalculators.forEach((id) => {
        const data = calculatorData[id]
        if (data) {
            data.config.fields.forEach((field) => {
                if (!allFields.has(field.id)) {
                    allFields.set(field.id, {
                        field,
                        value: data.inputs[field.id],
                    })
                }
            })
        }
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Comprehensive Nutritional Assessment Report
                    </Text>
                    <Text style={styles.subtitle}>
                        Generated on {new Date().toLocaleDateString()} at{" "}
                        {new Date().toLocaleTimeString()}
                    </Text>
                </View>

                {/* Input Values Section */}
                <View style={styles.calculatorSection}>
                    <Text style={styles.calculatorTitle}>Input Values</Text>
                    {Array.from(allFields.values()).map(({ field, value }) => (
                        <View key={field.id} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                {field.label}
                            </Text>
                            <Text style={styles.inputValue}>
                                {getFieldLabel(field, { [field.id]: value })}
                                {field.unit ? ` ${field.unit}` : ""}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Results Summary Section */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Results Summary</Text>
                    {selectedCalculators.map((id) => {
                        const data = calculatorData[id]
                        if (!data?.result) return null

                        return (
                            <View key={id} style={styles.summaryItem}>
                                <Text style={styles.summaryItemName}>
                                    {data.config.name}
                                </Text>
                                <Text style={styles.summaryItemValue}>
                                    {data.result.value} {data.result.unit}
                                    {data.result.category
                                        ? ` - ${data.result.category}`
                                        : ""}
                                </Text>
                            </View>
                        )
                    })}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Nutrify Calculator - Nutritional Assessment Tool</Text>
                    <Text>
                        This report is for informational purposes only and should not
                        replace professional medical advice.
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
