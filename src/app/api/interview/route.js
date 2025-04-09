import {
    GoogleGenerativeAI
} from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyDc1w-XAJY9dmQcPOeH7eZ-e2SjYEyHHwI");

// const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
// });
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21",
  });

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function POST(req) {
    try {
        const { user_res, history } = await req.json();
        if (!user_res || !history) {
            return NextResponse.json({ error: "history and user_response is req." }, { status: 400 });
        }
        const chatSession = model.startChat({
            generationConfig,
            history: history,
        });
        const res = await chatSession.sendMessage(user_res);
        const result = res.response.text();
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error", message:error.message }, { status: 500 });
    }
}