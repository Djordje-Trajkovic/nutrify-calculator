import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"
import { CalculatorField, CalculatorResult } from "@/utils/types"

type Props = {
    calculatorName: string
    fields: CalculatorField[]
    inputs: Record<string, string | number>
    result: CalculatorResult
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
        fontSize: 22,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 10,
        color: "#666666",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#00473C",
        marginTop: 20,
        marginBottom: 12,
    },
    inputContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 6,
    },
    inputValue: {
        fontSize: 10,
        color: "#666666",
        marginLeft: 15,
    },
    resultContainer: {
        marginTop: 25,
        padding: 20,
        backgroundColor: "#FAF9F6",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#00473C",
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 10,
    },
    resultValue: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#00473C",
        textAlign: "center",
        marginBottom: 15,
    },
    categoryContainer: {
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#00473C",
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    interpretationText: {
        fontSize: 10,
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
})

export default function CalculatorPDFDocument({
    calculatorName,
    fields,
    inputs,
    result,
}: Props) {
    const getFieldLabel = (field: CalculatorField) => {
        if (field.type === "select" && field.options) {
            const option = field.options.find(
                (opt) => opt.value === inputs[field.id],
            )
            return option?.label || String(inputs[field.id])
        }
        return String(inputs[field.id])
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{calculatorName}</Text>
                    <Text style={styles.subtitle}>
                        Generated on {new Date().toLocaleDateString()} at{" "}
                        {new Date().toLocaleTimeString()}
                    </Text>
                </View>

                {/* Input Values Section */}
                <Text style={styles.sectionTitle}>Input Values</Text>
                {fields.map((field) => (
                    <View key={field.id} style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{field.label}</Text>
                        <Text style={styles.inputValue}>
                            {getFieldLabel(field)}
                            {field.unit ? ` ${field.unit}` : ""}
                        </Text>
                    </View>
                ))}

                {/* Results Section */}
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Result</Text>
                    <Text style={styles.resultValue}>
                        {result.value} {result.unit}
                    </Text>

                    {result.category && (
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>
                                {result.category}
                            </Text>
                        </View>
                    )}

                    <Text style={styles.interpretationText}>
                        {result.interpretation}
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Nutrify Calculator - Nutritional Assessment Tool</Text>
                    <Text>
                        This report is for informational purposes only and should not replace professional medical advice.
                    </Text>
                </View>
            </Page>
        </Document>
    )
}
