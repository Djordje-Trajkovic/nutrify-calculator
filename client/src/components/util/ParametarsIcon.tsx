"use client"

import { FireSimple , Drop, Egg, BowlFood, Bread, Timer, Barbell, Pause, ListNumbers, MapPinSimple, Star, Calendar, Envelope, Phone, Translate, BookOpenText,} from "@phosphor-icons/react"
import { JSX } from "react";


type FoodIntakeParametarsIcon = {
  parametarName: string,
  iconSize? : number,
  containerSize?: number
}


const ParametarsIcon:React.FC<FoodIntakeParametarsIcon>=({parametarName, iconSize = 24, containerSize = 45})=>{

  const iconMap: Record<string, JSX.Element> = {
        Calories: <FireSimple size={iconSize} color="white" />,
        Proteins:  <Egg size={iconSize} color="white" />,
        Fats: <Drop  size={iconSize} color="white" />,
        Carbohydrates: <Bread size={iconSize} color="white" />,
        Time: <Timer size={iconSize} color="white"/>,
        Exercises: <Barbell size={iconSize} color="white"></Barbell>,
        Pause: <Pause size={iconSize} color="white"></Pause>,
        Series: <ListNumbers size={iconSize} color="white"></ListNumbers>,
        Location: <MapPinSimple size={iconSize} color="white"></MapPinSimple>,
        Rating: <Star size={iconSize} color="white"></Star>,
        Experience: <Calendar size={iconSize} color="white"></Calendar>,
        Mail: <Envelope size={iconSize} color="white" />,
        Phone: <Phone size={iconSize} color="white"  />,
        Languages: <Translate size={iconSize} color="white" />,
        Education: <BookOpenText size={iconSize} color="white" />,
        Calendar: <Calendar size={iconSize} color="white"/>
    };
  
  return  <div
  style={{ minHeight: `${containerSize}px`, minWidth: `${containerSize}px` }}
  className={`rounded-lg text-sm  flex justify-center items-center ${
      parametarName === "Calories"
          ? "bg-[#FF4163]"
          : parametarName === "Proteins"
            ? "bg-[#C56532]"
            : parametarName === "Fats"
              ? "bg-[#5A8AFF]"
              : parametarName === "Carbohydrates" ? "bg-[#E3CB2A]" : "bg-DarkGreen" 
  }`}
>{iconMap[parametarName] || <BowlFood size={iconSize} color="white"/>}</div>
}

export default ParametarsIcon