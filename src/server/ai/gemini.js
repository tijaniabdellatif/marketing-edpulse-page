"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLearningPath = void 0;
exports.generateLearningPathAction = generateLearningPathAction;
var genai_1 = require("@google/genai");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
});
var GEMINI_API_KEY = "AIzaSyAsDqa5hod3qGJBmxxcBQsyYPZLkvr5-Iw";
function initializeGenAI(token) {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error("No API Key Found");
        }
        var genAI_1 = new genai_1.GoogleGenAI({
            apiKey: token,
        });
        return genAI_1;
    }
    catch (error) {
        console.log(error.message);
    }
}
var genAI = initializeGenAI(GEMINI_API_KEY);
var generateLearningPath = function (visitorId) { return __awaiter(void 0, void 0, void 0, function () {
    var visitor, interestsText, preferencesText, prompt_1, result, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!genAI) {
                    throw new Error("GenAI not initialized");
                }
                return [4 /*yield*/, prisma.visitor.findUnique({
                        where: { id: visitorId },
                        include: {
                            interests: true,
                            preferences: true,
                        },
                    })];
            case 1:
                visitor = _a.sent();
                if (!visitor) {
                    throw new Error("Visitor with ID ".concat(visitorId, " not found"));
                }
                interestsText = visitor.interests
                    .map(function (interest) { return interest.type; })
                    .join(", ");
                preferencesText = visitor.preferences
                    .map(function (preference) { return preference.type; })
                    .join(", ");
                prompt_1 = "\n      Task: Create a personalized English learning path for ".concat(visitor.firstName, " ").concat(visitor.lastName, ".\n      \n      Student Profile:\n      - Personal Goals: ").concat(visitor.reasons || "General English improvement", "\n      - Interests: ").concat(interestsText || "Not specified", "\n      - Learning Preferences: ").concat(preferencesText || "Not specified", "\n      \n      Instructions:\n      1. Create a 8-week personalized learning path\n      2. Include specific activities tailored to their interests and learning preferences\n      3. Structure each week with 3-5 learning activities\n      4. Ensure the plan progresses in difficulty\n      5. Include specific resources they can use (websites, apps, practice exercises)\n      \n      Format your response as:\n      - An introduction paragraph personalizing the plan to the student\n      - Week-by-week breakdown with bullet points for activities\n      - A conclusion with tips for success\n    ");
                return [4 /*yield*/, genAI.models.generateContent({
                        model: "gemini-1.5-flash-001",
                        contents: [prompt_1],
                    })];
            case 2:
                result = _a.sent();
                response = (result === null || result === void 0 ? void 0 : result.text) || "No response generated";
                return [2 /*return*/, response];
            case 3:
                error_1 = _a.sent();
                console.log("failed to generate learning path", error_1.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.generateLearningPath = generateLearningPath;
function generateLearningPathAction(visitorId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.generateLearningPath)(visitorId)];
        });
    });
}
var testWithRealDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var visitorId, learningPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                visitorId = "493bea7a-8002-4112-bb06-80bc54626395";
                return [4 /*yield*/, (0, exports.generateLearningPath)(visitorId)];
            case 1:
                learningPath = _a.sent();
                console.log(learningPath);
                return [2 /*return*/];
        }
    });
}); };
testWithRealDatabase();
