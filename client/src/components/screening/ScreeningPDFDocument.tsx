import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"
import { ScreeningQuestion } from "@/utils/types"

type Props = {
    screeningName: string
    questions: ScreeningQuestion[]
    selections: Record<string, string | number>
    score: number
    interpretation: string
    riskLevel: string
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
    questionContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    questionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 6,
    },
    answerText: {
        fontSize: 10,
        color: "#666666",
        marginLeft: 15,
    },
    scoreContainer: {
        marginTop: 25,
        padding: 20,
        backgroundColor: "#FAF9F6",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#00473C",
    },
    scoreTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#00473C",
        marginBottom: 10,
    },
    scoreValue: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#00473C",
        textAlign: "center",
        marginBottom: 15,
    },
    riskLevelContainer: {
        padding: 12,
        marginBottom: 10,
    },
    riskLevelText: {
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
        fontSize: 8,
        color: "#666666",
        borderTopWidth: 1,
        borderTopColor: "#cccccc",
        paddingTop: 10,
    },
})

export default function ScreeningPDFDocument({
    screeningName,
    questions,
    selections,
    score,
    interpretation,
    riskLevel,
}: Props) {
    const generationDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    const getSelectedOptionLabel = (
        question: ScreeningQuestion,
        value: string | number,
    ): string => {
        const option = question.options.find((opt) => opt.value === value)
        return option ? option.label : String(value)
    }

    const getRiskLevelColor = (): string => {
        if (riskLevel.toLowerCase().includes("high")) return "#d32f2f"
        if (riskLevel.toLowerCase().includes("moderate")) return "#f57c00"
        return "#01b011"
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{screeningName}</Text>
                    <Text style={styles.subtitle}>
                        Generated on: {generationDate}
                    </Text>
                </View>

                {/* Questions and Answers */}
                <Text style={styles.sectionTitle}>Screening Responses</Text>
                {questions.map((question, index) => (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.questionTitle}>
                            {index + 1}. {question.title}
                        </Text>
                        <Text style={styles.answerText}>
                            Answer:{" "}
                            {getSelectedOptionLabel(
                                question,
                                selections[question.id],
                            )}
                        </Text>
                    </View>
                ))}

                {/* Score and Results */}
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreTitle}>Evaluation Results</Text>
                    <Text style={styles.scoreValue}>{score}</Text>
                    <View
                        style={[
                            styles.riskLevelContainer,
                            { backgroundColor: getRiskLevelColor() },
                        ]}
                    >
                        <Text style={styles.riskLevelText}>{riskLevel}</Text>
                    </View>
                    <Text style={styles.interpretationText}>
                        {interpretation}
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>{screeningName} Report</Text>
                </View>
            </Page>
        </Document>
    )
}
