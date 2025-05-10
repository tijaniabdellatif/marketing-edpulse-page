"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var genai_1 = require("@google/genai");
var GEMINI_API_KEY = process.env.GEMINI_API_KEY;
function initializeGenAI(token) {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('No API Key Found');
        }
        var genAI_1 = new genai_1.GoogleGenAI({
            apiKey: GEMINI_API_KEY
        });
        return genAI_1;
    }
    catch (error) {
    }
}
var genAI = initializeGenAI(GEMINI_API_KEY);
console.log(genAI);
