import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const simulateQuery = async (query: string): Promise<{ data: any[], explanation: string, isError: boolean }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Schema for structured output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        data: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT },
          description: "An array of objects representing the rows returned by the SQL query. Generate realistic dummy data based on the query context."
        },
        explanation: {
          type: Type.STRING,
          description: "A brief technical confirmation message from the database (e.g., '5 rows returned in 0.02s')."
        },
        isError: {
          type: Type.BOOLEAN,
          description: "True if the SQL syntax is invalid, False otherwise."
        }
      },
      required: ["data", "explanation", "isError"]
    };

    const response = await ai.models.generateContent({
      model,
      contents: `You are a MySQL Database Simulator. 
      The user acts as a Slack client sending SQL commands.
      
      User Query: "${query}"

      1. If the query is a SELECT statement, generate realistic mock data (JSON) relevant to the table names mentioned (e.g., users, orders, logs).
      2. If the query is INSERT/UPDATE/DELETE, return an empty data array but a success message in 'explanation'.
      3. If the query is invalid SQL, set isError to true and explain why in 'explanation'.
      
      Be creative with the data. If querying 'users', include fields like id, email, status, created_at.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    
    throw new Error("No response from Gemini");

  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return {
      data: [],
      explanation: "Connection timed out or API error occurred.",
      isError: true
    };
  }
};