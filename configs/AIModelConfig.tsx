import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyC8-iBY1gBA4Aoe-tjIoud8yaPKMDEXdr0";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

// Trip generation ke liye (JSON format)
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

// Chat ke liye (plain text)
const chatConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
};

// Trip generation session
export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "\nGenerate Travel Plan for Location: New York USA, for 1 Days and 1 Night for Family with a Luxury budget with a Flight details, Flight Price with Booking url, Hotels options list with Hotel Name, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and Places to visit nearby with place Name, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for 1 days and 1 night with each day plan with best time to visit in JSON format." },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n{\n  \"flight\": {\n    \"details\": {\n      \"airline\": \"Delta Airlines\",\n      \"flightNumber\": \"DL1234\"\n    }\n  }\n}\n```" },
            ],
        },
    ],
});

// Chat bot session (plain text)
export const chatBotSession = model.startChat({
    generationConfig: chatConfig,
    history: [
        {
            role: "user",
            parts: [{ text: "You are a helpful travel assistant for the Holidate app. Answer travel questions concisely." }],
        },
        {
            role: "model",
            parts: [{ text: "I'm your AI Travel Assistant! I can help you with destinations, hotels, itineraries, budget tips, and weather information. What would you like to know?" }],
        },
    ],
});