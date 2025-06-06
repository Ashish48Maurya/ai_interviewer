import { NextResponse } from "next/server";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const userQuery = 
        `
            You are an AI-powered proctor designed to analyze video footage from online test sessions and detect cheating behaviors with high accuracy. Carefully examine the provided video and determine if the test-taker exhibits any suspicious activity. Specifically, analyze for the following cheating patterns:

            Eye & Head Movement: Detect if the user frequently looks away from the screen, shifts their gaze unnaturally, or repeatedly looks down (potentially at notes or another device).

            Multiple Faces Detection: Identify if multiple people appear in the video, which could indicate collaboration or unauthorized assistance.

            Presence of External Devices: Recognize if the user interacts with a phone, another screen, or any external device. Detect unusual hand movements suggesting hidden devices.

            Whispering or Speech Detection: Flag instances where the user is speaking softly or mouthing words, which may indicate receiving external help.

            Background Activity: Identify any unauthorized individuals appearing in the background or unusual activities suggesting assistance from another person.

            Face Obstruction & Disappearance: Detect if the user frequently hides their face, leaves the frame, or covers the webcam.

            Time-Based Behavior Analysis: Observe patterns of consistent rule-breaking behavior over time, such as periodic glancing, frequent device usage, or assistance from another person.
        `;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type || "video/mp4";
        const fileName = file.name || "uploaded-video.mp4";

        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, fileBuffer);


        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: fileType,
            displayName: fileName,
        });

        fs.unlinkSync(filePath);


        let file1 = await fileManager.getFile(uploadResponse.file.name);
        while (file1.state === FileState.PROCESSING) {
            process.stdout.write(".")
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            file1 = await fileManager.getFile(uploadResponse.file.name)
        }

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: file1.mimeType,
                    fileUri: file1.uri,
                },
            },
            { text: userQuery },
        ]);

        const textResponse = await result.response.text();
        return NextResponse.json({ message: textResponse });
    } catch (err) {
        console.error("Error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
