
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a technical material recommendation based on user application input.
 * Uses gemini-3-pro-preview for complex reasoning and technical depth.
 */
export const getMaterialRecommendation = async (userApplication: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a Senior Technical Specialist at Industrial Plastics. 
      A customer is asking for a material recommendation for the following application: "${userApplication}".
      
      Provide a professional, technical response in Markdown. 
      Include:
      1. Suggested Material Category (e.g., Engineering Polymers, Signage Media).
      2. Specific Material recommendation based on common industrial standards.
      3. Technical reasoning (considering Heat, Chemicals, Load if applicable).
      4. A reminder to contact Isando HQ (+27 11 555 0100) for ISO compliance and safety verification.`,
    });
    return response.text || "Technical digest pending review by distribution officer.";
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    // Fallback to static response if API fails or Key is missing
    return `### Technical Material Recommendation\n\nBased on your application requirement: "${userApplication}", please consult with our Senior Technical Specialists at the Isando HQ. \n\nIndustrial polymers require precise environmental evaluation (Heat, Chemicals, Load) which is best handled by our engineering team to ensure ISO compliance and safety standards.\n\n**Contact Central HQ: +27 11 555 0100**`;
  }
};

/**
 * Summarizes user inquiries for administrative quick-view.
 * Uses gemini-3-flash-preview for efficiency and speed.
 */
export const summarizeInquiry = async (message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this industrial inquiry for an admin dashboard in one concise sentence (max 20 words): "${message}"`,
    });
    return response.text?.trim() || "Technical digest pending review.";
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "Technical digest pending review by distribution officer.";
  }
};
