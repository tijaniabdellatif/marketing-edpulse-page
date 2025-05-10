
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
function initializeGenAI(token:string){

   try {
        if(!GEMINI_API_KEY){
            throw new Error('No API Key Found');
            
        }

        const genAI = new GoogleGenAI({
            apiKey:token
        })

        return genAI;
   } catch(error:any){

     console.log(error.message);
   }

}

const genAI = initializeGenAI(GEMINI_API_KEY!);

console.log(genAI)



