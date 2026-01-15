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

export const calculatorConfigs = {
    bmi: bmiCalculatorConfig,
    bmr: bmrCalculatorConfig,
    tdee: tdeeCalculatorConfig,
    ibw: ibwCalculatorConfig,
}
