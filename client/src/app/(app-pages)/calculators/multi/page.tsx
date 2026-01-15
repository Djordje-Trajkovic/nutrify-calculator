import React, { Suspense } from "react"
import { Typography, Box } from "@mui/material"
import AppContainer from "@/components/util/AppContainer"
import MultiCalculatorContent from "@/components/calculator/MultiCalculatorContent"

function LoadingFallback() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                paddingY: 4,
                textAlign: "center",
            }}
        >
            <Typography variant="h5">Loading calculator...</Typography>
        </Box>
    )
}

export default function MultiCalculatorPage() {
    return (
        <AppContainer>
            <Suspense fallback={<LoadingFallback />}>
                <MultiCalculatorContent />
            </Suspense>
        </AppContainer>
    )
}
