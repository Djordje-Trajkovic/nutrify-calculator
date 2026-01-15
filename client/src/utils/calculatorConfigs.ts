import { CalculatorConfig } from "@/utils/types"

// Mifflin-St Jeor Equation Constants
const MSJ_WEIGHT_COEFFICIENT = 10
const MSJ_HEIGHT_COEFFICIENT = 6.25
const MSJ_AGE_COEFFICIENT = 5
const MSJ_MALE_CONSTANT = 5
const MSJ_FEMALE_CONSTANT = -161

// Devine Formula Constants
const DEVINE_MALE_BASE = 50
const DEVINE_FEMALE_BASE = 45.5
const DEVINE_HEIGHT_COEFFICIENT = 2.3
const DEVINE_HEIGHT_OFFSET = 60
const CM_TO_INCHES = 2.54

// Helper function to calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(gender: string, age: number, weight: number, height: number): number {
    const baseCalculation = MSJ_WEIGHT_COEFFICIENT * weight + MSJ_HEIGHT_COEFFICIENT * height - MSJ_AGE_COEFFICIENT * age
    return gender === "male" 
        ? baseCalculation + MSJ_MALE_CONSTANT 
        : baseCalculation + MSJ_FEMALE_CONSTANT
}

export const bmiCalculatorConfig: CalculatorConfig = {
    id: "bmi",
    name: "BMI Calculator",
    description: "Body Mass Index - Measure body fat based on height and weight",
    fields: [
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
        {
            id: "height",
            label: "Height",
            type: "number",
            unit: "cm",
            required: true,
            min: 100,
            max: 250,
        },
    ],
    calculate: (inputs) => {
        const weight = Number(inputs.weight)
        const heightCm = Number(inputs.height)
        const heightM = heightCm / 100
        
        const bmi = weight / (heightM * heightM)
        
        let category = ""
        let interpretation = ""
        
        if (bmi < 16) {
            category = "Severe Thinness"
            interpretation = "Your BMI indicates severe thinness. This may indicate malnutrition or other health concerns. Please consult with a healthcare provider."
        } else if (bmi >= 16 && bmi < 17) {
            category = "Moderate Thinness"
            interpretation = "Your BMI indicates moderate thinness. Consider consulting with a healthcare provider or nutritionist to ensure you're getting adequate nutrition."
        } else if (bmi >= 17 && bmi < 18.5) {
            category = "Mild Thinness"
            interpretation = "Your BMI indicates mild thinness. You may benefit from consulting with a nutritionist to optimize your diet."
        } else if (bmi >= 18.5 && bmi < 25) {
            category = "Normal Weight"
            interpretation = "Your BMI is in the normal range. Maintain a balanced diet and regular physical activity to stay healthy."
        } else if (bmi >= 25 && bmi < 30) {
            category = "Overweight"
            interpretation = "Your BMI indicates you are overweight. Consider adopting a balanced diet and regular exercise routine. Consulting with a healthcare provider may be beneficial."
        } else if (bmi >= 30 && bmi < 35) {
            category = "Obese Class I"
            interpretation = "Your BMI indicates Class I obesity. It's recommended to consult with a healthcare provider for a personalized weight management plan."
        } else if (bmi >= 35 && bmi < 40) {
            category = "Obese Class II"
            interpretation = "Your BMI indicates Class II obesity. Medical consultation is strongly recommended to discuss health risks and weight management strategies."
        } else {
            category = "Obese Class III"
            interpretation = "Your BMI indicates Class III obesity. Please consult with a healthcare provider immediately to address potential health risks and develop a comprehensive treatment plan."
        }
        
        return {
            value: Math.round(bmi * 10) / 10,
            unit: "kg/m²",
            interpretation,
            category,
        }
    },
}

export const bmrCalculatorConfig: CalculatorConfig = {
    id: "bmr",
    name: "BMR Calculator",
    description: "Basal Metabolic Rate - Calculate your resting energy expenditure",
    fields: [
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "age",
            label: "Age",
            type: "number",
            unit: "years",
            required: true,
            min: 1,
            max: 120,
        },
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
        {
            id: "height",
            label: "Height",
            type: "number",
            unit: "cm",
            required: true,
            min: 100,
            max: 250,
        },
    ],
    calculate: (inputs) => {
        const gender = inputs.gender as string
        const age = Number(inputs.age)
        const weight = Number(inputs.weight)
        const height = Number(inputs.height)
        
        const bmr = calculateBMR(gender, age, weight, height)
        
        const interpretation = `Your Basal Metabolic Rate (BMR) is ${Math.round(bmr)} calories per day. This is the number of calories your body needs to maintain basic physiological functions at rest. To determine your total daily calorie needs, multiply your BMR by your activity level factor.`
        
        return {
            value: Math.round(bmr),
            unit: "kcal/day",
            interpretation,
            category: "Resting Energy Expenditure",
        }
    },
}

export const tdeeCalculatorConfig: CalculatorConfig = {
    id: "tdee",
    name: "TDEE Calculator",
    description: "Total Daily Energy Expenditure - Estimate your daily calorie needs",
    fields: [
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "age",
            label: "Age",
            type: "number",
            unit: "years",
            required: true,
            min: 1,
            max: 120,
        },
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
        {
            id: "height",
            label: "Height",
            type: "number",
            unit: "cm",
            required: true,
            min: 100,
            max: 250,
        },
        {
            id: "activity",
            label: "Activity Level",
            type: "select",
            required: true,
            options: [
                { label: "Sedentary (little or no exercise)", value: "1.2" },
                { label: "Lightly active (exercise 1-3 days/week)", value: "1.375" },
                { label: "Moderately active (exercise 3-5 days/week)", value: "1.55" },
                { label: "Very active (exercise 6-7 days/week)", value: "1.725" },
                { label: "Extremely active (physical job or training twice/day)", value: "1.9" },
            ],
        },
    ],
    calculate: (inputs) => {
        const gender = inputs.gender as string
        const age = Number(inputs.age)
        const weight = Number(inputs.weight)
        const height = Number(inputs.height)
        const activityMultiplier = Number(inputs.activity)
        
        const bmr = calculateBMR(gender, age, weight, height)
        
        // Calculate TDEE
        const tdee = bmr * activityMultiplier
        
        const interpretation = `Your Total Daily Energy Expenditure (TDEE) is approximately ${Math.round(tdee)} calories per day. This is the total number of calories you burn in a day, including your BMR and physical activity. To maintain your current weight, consume this many calories. To lose weight, consume fewer calories; to gain weight, consume more.`
        
        return {
            value: Math.round(tdee),
            unit: "kcal/day",
            interpretation,
            category: "Daily Calorie Needs",
        }
    },
}

export const ibwCalculatorConfig: CalculatorConfig = {
    id: "ibw",
    name: "IBW Calculator",
    description: "Ideal Body Weight - Calculate your healthy weight range",
    fields: [
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "height",
            label: "Height",
            type: "number",
            unit: "cm",
            required: true,
            min: 100,
            max: 250,
        },
    ],
    calculate: (inputs) => {
        const gender = inputs.gender as string
        const heightCm = Number(inputs.height)
        
        // Devine Formula
        const heightInches = (heightCm / CM_TO_INCHES) - DEVINE_HEIGHT_OFFSET
        const ibw = gender === "male"
            ? DEVINE_MALE_BASE + DEVINE_HEIGHT_COEFFICIENT * heightInches
            : DEVINE_FEMALE_BASE + DEVINE_HEIGHT_COEFFICIENT * heightInches
        
        // Healthy weight range (IBW ± 10%)
        const lowerRange = Math.round(ibw * 0.9)
        const upperRange = Math.round(ibw * 1.1)
        
        const interpretation = `Your Ideal Body Weight (IBW) is approximately ${Math.round(ibw)} kg. A healthy weight range for your height is ${lowerRange}-${upperRange} kg. This calculation uses the Devine Formula and is a general guideline. Individual factors such as muscle mass, bone density, and body composition should also be considered.`
        
        return {
            value: Math.round(ibw),
            unit: "kg",
            interpretation,
            category: "Ideal Body Weight",
        }
    },
}

// Harris-Benedict Equation Calculator
export const harrisBenedictCalculatorConfig: CalculatorConfig = {
    id: "harris-benedict",
    name: "Harris-Benedict Equation",
    description: "Calculate BMR using the Harris-Benedict equation (revised 1984)",
    fields: [
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "age",
            label: "Age",
            type: "number",
            unit: "years",
            required: true,
            min: 1,
            max: 120,
        },
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
        {
            id: "height",
            label: "Height",
            type: "number",
            unit: "cm",
            required: true,
            min: 100,
            max: 250,
        },
    ],
    calculate: (inputs) => {
        const gender = inputs.gender as string
        const age = Number(inputs.age)
        const weight = Number(inputs.weight)
        const height = Number(inputs.height)
        
        // Harris-Benedict Equation (Revised 1984)
        let bmr: number
        if (gender === "male") {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
        }
        
        const interpretation = `Using the Harris-Benedict equation (revised 1984), your Basal Metabolic Rate is ${Math.round(bmr)} calories per day. This represents the minimum energy your body needs to maintain vital functions at rest.`
        
        return {
            value: Math.round(bmr),
            unit: "kcal/day",
            interpretation,
            category: "Basal Metabolic Rate",
        }
    },
}

// Schofield (WHO) Equation Calculator
export const schofieldCalculatorConfig: CalculatorConfig = {
    id: "schofield",
    name: "Schofield (WHO) Equation",
    description: "Calculate BMR using the Schofield equation recommended by WHO",
    fields: [
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "age",
            label: "Age",
            type: "number",
            unit: "years",
            required: true,
            min: 1,
            max: 120,
        },
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
    ],
    calculate: (inputs) => {
        const gender = inputs.gender as string
        const age = Number(inputs.age)
        const weight = Number(inputs.weight)
        
        // Schofield Equation (WHO recommendation)
        let bmr: number
        if (gender === "male") {
            if (age < 3) {
                bmr = 59.512 * weight - 30.4
            } else if (age < 10) {
                bmr = 22.706 * weight + 504.3
            } else if (age < 18) {
                bmr = 17.686 * weight + 658.2
            } else if (age < 30) {
                bmr = 15.057 * weight + 692.2
            } else if (age < 60) {
                bmr = 11.472 * weight + 873.1
            } else {
                bmr = 11.711 * weight + 587.7
            }
        } else {
            if (age < 3) {
                bmr = 58.317 * weight - 31.1
            } else if (age < 10) {
                bmr = 20.315 * weight + 485.9
            } else if (age < 18) {
                bmr = 13.384 * weight + 692.6
            } else if (age < 30) {
                bmr = 14.818 * weight + 486.6
            } else if (age < 60) {
                bmr = 8.126 * weight + 845.6
            } else {
                bmr = 9.082 * weight + 658.5
            }
        }
        
        const interpretation = `Using the Schofield equation (WHO recommended), your Basal Metabolic Rate is ${Math.round(bmr)} calories per day. This equation is widely used internationally and considers age-specific metabolic differences.`
        
        return {
            value: Math.round(bmr),
            unit: "kcal/day",
            interpretation,
            category: "Basal Metabolic Rate",
        }
    },
}

// Owen Equation Calculator
export const owenCalculatorConfig: CalculatorConfig = {
    id: "owen",
    name: "Owen Equation",
    description: "Calculate BMR using the Owen equation",
    fields: [
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
    ],
    calculate: (inputs) => {
        const gender = inputs.gender as string
        const weight = Number(inputs.weight)
        
        // Owen Equation
        let bmr: number
        if (gender === "male") {
            bmr = 879 + (10.2 * weight)
        } else {
            bmr = 795 + (7.18 * weight)
        }
        
        const interpretation = `Using the Owen equation, your Basal Metabolic Rate is ${Math.round(bmr)} calories per day. This equation is simpler and only requires weight, making it useful for quick estimates.`
        
        return {
            value: Math.round(bmr),
            unit: "kcal/day",
            interpretation,
            category: "Basal Metabolic Rate",
        }
    },
}

// Cunningham Equation Calculator
export const cunninghamCalculatorConfig: CalculatorConfig = {
    id: "cunningham",
    name: "Cunningham Equation",
    description: "Calculate RMR using the Cunningham equation (requires lean body mass)",
    fields: [
        {
            id: "leanBodyMass",
            label: "Lean Body Mass",
            type: "number",
            unit: "kg",
            required: true,
            min: 10,
            max: 200,
        },
    ],
    calculate: (inputs) => {
        const leanBodyMass = Number(inputs.leanBodyMass)
        
        // Cunningham Equation
        const rmr = 500 + (22 * leanBodyMass)
        
        const interpretation = `Using the Cunningham equation, your Resting Metabolic Rate is ${Math.round(rmr)} calories per day. This equation is specifically designed for individuals who know their lean body mass and is particularly accurate for athletes and those with measured body composition.`
        
        return {
            value: Math.round(rmr),
            unit: "kcal/day",
            interpretation,
            category: "Resting Metabolic Rate",
        }
    },
}

// Ireton-Jones Equation Calculator
export const iretonJonesCalculatorConfig: CalculatorConfig = {
    id: "ireton-jones",
    name: "Ireton-Jones Equation",
    description: "Calculate energy needs using the Ireton-Jones equation (for critically ill patients)",
    fields: [
        {
            id: "weight",
            label: "Weight",
            type: "number",
            unit: "kg",
            required: true,
            min: 20,
            max: 300,
        },
        {
            id: "age",
            label: "Age",
            type: "number",
            unit: "years",
            required: true,
            min: 1,
            max: 120,
        },
        {
            id: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
            ],
        },
        {
            id: "ventilated",
            label: "Mechanically Ventilated",
            type: "select",
            required: true,
            options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ],
        },
    ],
    calculate: (inputs) => {
        const weight = Number(inputs.weight)
        const age = Number(inputs.age)
        const gender = inputs.gender as string
        const ventilated = inputs.ventilated as string
        
        // Ireton-Jones Equation
        let ee: number
        if (ventilated === "yes") {
            // Ventilated version
            ee = 1925 - (10 * age) + (5 * weight) + (281 * (gender === "male" ? 1 : 0)) + (292 * 1) - (851 * 0)
        } else {
            // Spontaneously breathing version
            ee = 629 - (11 * age) + (25 * weight) - (609 * 0)
        }
        
        const interpretation = `Using the Ireton-Jones equation, your estimated energy expenditure is ${Math.round(ee)} calories per day. This equation is specifically designed for critically ill patients and considers factors like mechanical ventilation status.`
        
        return {
            value: Math.round(ee),
            unit: "kcal/day",
            interpretation,
            category: "Energy Expenditure",
        }
    },
}

export const calculatorConfigs = {
    bmi: bmiCalculatorConfig,
    bmr: bmrCalculatorConfig,
    tdee: tdeeCalculatorConfig,
    ibw: ibwCalculatorConfig,
    "harris-benedict": harrisBenedictCalculatorConfig,
    schofield: schofieldCalculatorConfig,
    owen: owenCalculatorConfig,
    cunningham: cunninghamCalculatorConfig,
    "ireton-jones": iretonJonesCalculatorConfig,
}
