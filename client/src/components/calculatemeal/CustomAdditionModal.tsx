"use client"
import React, { useState } from "react"
import {
    Autocomplete,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material"
import { Minus } from "@phosphor-icons/react"
import { NutritionalFields, CustomAdditionEntry } from "@/utils/types"

const NUTRITIONAL_FIELD_OPTIONS: (keyof NutritionalFields)[] = (
    Object.keys({
        Amount: 0,
        Ashes: 0,
        Atherogenic_index: 0,
        Carbohydrates_fructose: 0,
        Carbohydrates_glucose: 0,
        Carbohydrates_isomaltulose: 0,
        Carbohydrates_lactose: 0,
        Carbohydrates_maltose: 0,
        Carbohydrates_mono: 0,
        Carbohydrates_Noncaloric_Carbohydrates: 0,
        Carbohydrates_Organic_Acids: 0,
        Carbohydrates_poli: 0,
        Carbohydrates_Polyols: 0,
        Carbohydrates_sucrose: 0,
        Carbohydrates_total: 0,
        Carotenoids: 0,
        Cellulose: 0,
        Cholesterol: 0,
        Fat_aa: 0,
        Fat_ala: 0,
        Fat_Arachidonic_Acid: 0,
        Fat_dha: 0,
        Fat_epa: 0,
        Fat_la: 0,
        Fat_mct: 0,
        Fat_saturated: 0,
        Fat_total: 0,
        Fat_unsaturated: 0,
        Fatty_Acids_C10: 0,
        Fatty_Acids_C12: 0,
        Fatty_Acids_C14: 0,
        Fatty_Acids_C6: 0,
        Fatty_Acids_C8: 0,
        Fiber_Fructooligosaccharides: 0,
        Fiber_Galactooligosaccharides: 0,
        Fiber_Insoluble: 0,
        Fiber_Soluble: 0,
        Fiber_total: 0,
        Glycemic_index: 0,
        Kcal: 0,
        MCT_TCM_ratio: 0,
        Mineral_Ca: 0,
        Mineral_Cl: 0,
        Mineral_Cr: 0,
        Mineral_Cu: 0,
        Mineral_F: 0,
        Mineral_Fe: 0,
        Mineral_Jod: 0,
        Mineral_K: 0,
        Mineral_Mg: 0,
        Mineral_Mn: 0,
        Mineral_Mo: 0,
        Mineral_Na: 0,
        Mineral_P: 0,
        Mineral_S: 0,
        Mineral_Se: 0,
        Mineral_Zn: 0,
        Nucleotides: 0,
        Omega3_Omega6_ratio: 0,
        Osmolality: 0,
        Osmolarity: 0,
        Phosphates: 0,
        Protein_animal: 0,
        Protein_Carnitine: 0,
        Protein_Casein: 0,
        Protein_Essential_Amino_Acids: 0,
        Protein_L_Arginin: 0,
        Protein_L_Leucin: 0,
        Protein_plant: 0,
        Protein_taurine: 0,
        Protein_total: 0,
        Protein_Whey: 0,
        Sugars: 0,
        Vitamin_A: 0,
        Vitamin_B1: 0,
        Vitamin_B12: 0,
        Vitamin_B2: 0,
        Vitamin_B3: 0,
        Vitamin_B4_Holin: 0,
        Vitamin_B5: 0,
        Vitamin_B6: 0,
        Vitamin_B7: 0,
        Vitamin_B8_Inositol: 0,
        Vitamin_B9_Folic_Acid: 0,
        Vitamin_C: 0,
        Vitamin_D: 0,
        Vitamin_E: 0,
        Vitamin_K: 0,
        Vitamin_PP: 0,
        Vitamin_RE: 0,
        Volume_per_Unit: 0,
        Water: 0,
    } satisfies Record<keyof NutritionalFields, number>) as (keyof NutritionalFields)[]
).sort()

function formatFieldName(field: string): string {
    return field.replace(/_/g, " ")
}

type Props = {
    open: boolean
    onClose: () => void
    existingAdditions: CustomAdditionEntry[]
    onSave: (additions: CustomAdditionEntry[]) => void
}

const CustomAdditionModal: React.FC<Props> = ({
    open,
    onClose,
    existingAdditions,
    onSave,
}) => {
    const [additions, setAdditions] = useState<CustomAdditionEntry[]>(existingAdditions)
    const [selectedField, setSelectedField] = useState<keyof NutritionalFields | null>(null)
    const [fieldValue, setFieldValue] = useState<number>(0)

    React.useEffect(() => {
        if (open) {
            setAdditions(existingAdditions)
        }
    }, [open, existingAdditions])

    const handleAddEntry = () => {
        if (!selectedField) return
        setAdditions((prev) => [...prev, { field: selectedField, value: fieldValue }])
        setSelectedField(null)
        setFieldValue(0)
    }

    const handleRemoveEntry = (idx: number) => {
        setAdditions((prev) => prev.filter((_, i) => i !== idx))
    }

    const handleSave = () => {
        onSave(additions)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="text-DarkGreen font-Poppins">
                Custom Addition
            </DialogTitle>
            <DialogContent>
                <p className="text-sm text-gray-500 mb-4">
                    Add flat values to this meal&apos;s nutritional totals. Select a field and enter the value to add.
                </p>
                <div className="flex gap-2 items-end mb-4">
                    <Autocomplete
                        options={NUTRITIONAL_FIELD_OPTIONS}
                        getOptionLabel={(option) => formatFieldName(option)}
                        value={selectedField}
                        onChange={(_e, newValue) => setSelectedField(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nutritional Field"
                                size="small"
                            />
                        )}
                        sx={{ flex: 2 }}
                    />
                    <TextField
                        label="Value"
                        type="number"
                        size="small"
                        value={fieldValue}
                        onChange={(e) =>
                            setFieldValue(parseFloat(e.target.value) || 0)
                        }
                        slotProps={{
                            input: {
                                onFocus: (e) => e.target.select(),
                            },
                        }}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        className="bg-LightGreen! hover:bg-LightGreen/80! normal-case!"
                        onClick={handleAddEntry}
                        disabled={!selectedField}
                    >
                        Add
                    </Button>
                </div>

                {additions.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="flex bg-slate-50 px-3 py-2 text-sm font-semibold text-DarkGreen">
                            <span className="flex-1">Field</span>
                            <span className="w-24 text-right">Value</span>
                            <span className="w-10"></span>
                        </div>
                        {additions.map((entry, idx) => (
                            <div
                                key={idx}
                                className="flex items-center px-3 py-2 border-t border-slate-200"
                            >
                                <span className="flex-1 text-sm">
                                    {formatFieldName(entry.field)}
                                </span>
                                <span className="w-24 text-right text-sm font-medium">
                                    +{entry.value}
                                </span>
                                <Button
                                    className="min-w-0! p-1! ml-2!"
                                    onClick={() => handleRemoveEntry(idx)}
                                >
                                    <Minus
                                        size={16}
                                        color="#ef4444"
                                        weight="bold"
                                    />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} className="normal-case!">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    className="bg-LightGreen! hover:bg-LightGreen/80! normal-case!"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomAdditionModal
