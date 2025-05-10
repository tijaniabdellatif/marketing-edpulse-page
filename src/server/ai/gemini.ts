import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({
    path:".env"
})


const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
});

type Interest = {
  type: string;
};

type Preference = {
  type: string;
};

type VisitorData = {
  firstName: string;
  lastName: string;
  reasons: string;
  interests: Interest[];
  preferences: Preference[];
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAsDqa5hod3qGJBmxxcBQsyYPZLkvr5-Iw";
function initializeGenAI(token: string) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("No API Key Found");
    }

    const genAI = new GoogleGenAI({
      apiKey: token,
    });

    return genAI;
  } catch (error: any) {
    console.log(error.message);
  }
}

const genAI = initializeGenAI(GEMINI_API_KEY!);

export const generateLearningPath = async (visitorId: string) => {
  try {
    if (!genAI) {
      throw new Error("GenAI not initialized");
    }

    const visitor = await prisma.visitor.findUnique({
      where: { id: visitorId },
      include: {
        interests: true,
        preferences: true,
      },
    });

    if (!visitor) {
      throw new Error(`Visitor with ID ${visitorId} not found`);
    }

    const interestsText = visitor.interests
      .map((interest) => interest.type)
      .join(", ");

    const preferencesText = visitor.preferences
      .map((preference) => preference.type)
      .join(", ");

    const prompt = `
      Task: Create a personalized English learning path for ${visitor.firstName} ${visitor.lastName}.
      
      Student Profile:
      - Personal Goals: ${visitor.reasons || "General English improvement"}
      - Interests: ${interestsText || "Not specified"}
      - Learning Preferences: ${preferencesText || "Not specified"}
      
      Instructions:
      1. Create a 8-week personalized learning path
      2. Include specific activities tailored to their interests and learning preferences
      3. Structure each week with 3-5 learning activities
      4. Ensure the plan progresses in difficulty
      5. Include specific resources they can use (websites, apps, practice exercises)
      
      Format your response as:
      - An introduction paragraph personalizing the plan to the student
      - Week-by-week breakdown with bullet points for activities
      - A conclusion with tips for success
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: [prompt],
    });

    const response = result?.text || "No response generated";
    return response;
  } catch (error: any) {
    console.log("failed to generate learning path", error.message);
  }
};

export async function generateLearningPathAction(visitorId: string){
    return generateLearningPath(visitorId);
}
