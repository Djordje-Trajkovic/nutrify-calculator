# Universal PDFPreviewModal Component

## Overview
The `PDFPreviewModal` is a universal, reusable component for previewing and downloading PDF documents throughout the application. It handles all the common functionality of PDF preview modals including:

- PDF generation and preview
- Download functionality
- Loading and error states
- Consistent styling and UX
- Memory management (URL cleanup)

## Location
`/client/src/components/util/PDFPreviewModal.tsx`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback function when modal closes |
| `title` | `string` | Yes | Title displayed in modal header |
| `fileName` | `string` | No | Custom filename for downloaded PDF (defaults to sanitized title) |
| `pdfDocument` | `ReactElement` | Yes | The @react-pdf/renderer Document component to render |

## Usage Examples

### Basic Example
```tsx
import PDFPreviewModal from "@/components/util/PDFPreviewModal"
import MyPDFDocument from "./MyPDFDocument"

function MyComponent() {
    const [previewOpen, setPreviewOpen] = useState(false)
    
    return (
        <>
            <Button onClick={() => setPreviewOpen(true)}>
                Preview PDF
            </Button>
            
            <PDFPreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="My Document"
                fileName="my-custom-filename.pdf"
                pdfDocument={<MyPDFDocument data={myData} />}
            />
        </>
    )
}
```

### Meal Plan Example
```tsx
<PDFPreviewModal
    open={open}
    onClose={onClose}
    title={mealPlanName || "Meal Plan"}
    fileName={`${mealPlanName || "meal-plan"}.pdf`}
    pdfDocument={<PDFDocument meals={meals} mealPlanName={mealPlanName} />}
/>
```

### Calculator Results Example
```tsx
<PDFPreviewModal
    open={open}
    onClose={onClose}
    title={calculatorName}
    fileName={`${calculatorName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`}
    pdfDocument={
        <CalculatorPDFDocument
            calculatorName={calculatorName}
            fields={fields}
            inputs={inputs}
            result={result}
        />
    }
/>
```

## Features

### Zoom Controls
- **Zoom In/Out buttons**: Adjust zoom level from 50% to 300% in 25% increments
- **Zoom percentage display**: Shows current zoom level
- **Reset zoom button**: Quickly return to 100% zoom and center position
- **Keyboard zoom**: Hold Ctrl/Cmd and scroll mouse wheel to zoom
- **Smooth transitions**: Animated zoom transitions for better UX

### Pan and Navigate
- **Drag to pan**: When zoomed in (>100%), click and drag to move around the PDF
- **Visual feedback**: Cursor changes to grab/grabbing when panning is available
- **Position reset**: Zoom reset also centers the PDF view

### Automatic PDF Generation
- PDF is generated automatically when the modal opens
- Uses memoization to prevent unnecessary regenerations
- Shows loading state during generation

### Error Handling
- Displays user-friendly error messages
- Provides retry functionality
- Prevents modal from being stuck in error state

### Download Functionality
- Download button with loading indicator
- Automatic filename generation or custom filename
- Proper cleanup of blob URLs

### Memory Management
- Automatically revokes object URLs on modal close
- Prevents memory leaks from blob URLs

### Responsive Design
- Adapts to different screen sizes
- Optimized for desktop and mobile viewing

## Styling
The component uses consistent styling with the rest of the application:
- Brand colors (#00473C for header, #01b011 for download button)
- Material-UI components for buttons and loading indicators
- Phosphor Icons for close and download icons

## Previous Implementations
This universal component replaces the following specialized modals:
- `/calculatemeal/PDFPreviewModal.tsx` - Now a thin wrapper
- `/calculator/CalculatorPDFPreviewModal.tsx` - Now a thin wrapper
- `/screening/ScreeningPDFPreviewModal.tsx` - Now a thin wrapper
- `/calculator/MultiCalculatorPDFPreviewModal.tsx` - Now a thin wrapper

## Benefits of Universal Approach

1. **DRY Principle**: Single source of truth for PDF preview logic
2. **Consistency**: Same UX across all PDF previews in the app
3. **Maintainability**: Bug fixes and improvements apply everywhere
4. **Flexibility**: Easy to add new PDF types without duplicating code
5. **Type Safety**: Strongly typed with TypeScript
6. **Performance**: Efficient memory management and lazy loading

## Creating New PDF Previews

To add a new PDF preview to your application:

1. Create your PDF Document component using `@react-pdf/renderer`:
```tsx
import { Document, Page, Text } from "@react-pdf/renderer"

function MyPDFDocument({ data }: Props) {
    return (
        <Document>
            <Page>
                <Text>Your content here</Text>
            </Page>
        </Document>
    )
}
```

2. Create a wrapper component (optional, for convenience):
```tsx
import PDFPreviewModal from "@/components/util/PDFPreviewModal"
import MyPDFDocument from "./MyPDFDocument"

export default function MyPDFPreviewModal({ open, onClose, data }: Props) {
    return (
        <PDFPreviewModal
            open={open}
            onClose={onClose}
            title="My Document Title"
            fileName="my-document.pdf"
            pdfDocument={<MyPDFDocument data={data} />}
        />
    )
}
```

3. Use it in your component:
```tsx
const [previewOpen, setPreviewOpen] = useState(false)

<MyPDFPreviewModal
    open={previewOpen}
    onClose={() => setPreviewOpen(false)}
    data={myData}
/>
```
