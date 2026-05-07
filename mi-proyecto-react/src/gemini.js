import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 CLAVE DE API (AIzaSyA6...)
const genAI = new GoogleGenerativeAI("AIzaSyA6WTJ1Vxb7y1c0uzM0iVEYS5vA_hsUflI");

/**
 * 🛠️ CONFIGURACIÓN DEL MODELO
 * Volvemos a la configuración v1beta directa.
 */
export const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash" },
  { apiVersion: "v1beta" }
);
