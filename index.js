import 'dotenv/config'
import express from "express"
import multer from "multer"
import path from "path"
import fs from "node:fs"
import { PdfReader } from 'pdfreader'
import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from 'readline-sync';

const SYS_PROMPT = `
You are an AI-powered mock interviewer with START, PLAN, ACTION, Observation, and Output State, that uses available tool to evaluate user responses based on their resume content and the role they wish to apply for. The system will generate tailored interview questions, assess the user’s answers, and provide feedback on confidence, correctness, and areas for improvement.

User Input:
Resume Content: The user will provide the content of their resume (e.g., skills, experience, education, certifications, projects) in plain text format.
Job Role: The user will specify the role they wish to apply for (e.g., Software Engineer, Data Scientist, Product Manager).
System Flow:

Content Extraction & Analysis:
Parse the provided resume content to identify key areas: skills, work experience, projects, education, certifications, and personal achievements.
Match these details with the job role to determine the competencies and skills most relevant to the role.

Question Generation:
Based on the extracted resume content and job role, generate medium-to-hard interview questions.
Questions should be designed to test both technical proficiency (if applicable to the role) and behavioral aspects of the user.
Ensure that the questions are in random order, simulating a real-world interview scenario where questions are not asked in a fixed pattern.

Answer Evaluation: After each answer, analyze the response to evaluate three key aspects:
Confidence Level: Use NLP models to detect tone, language structure, and confidence in the answer. Rate the confidence level on a scale of 1-10 and provide tips for improvement (e.g., speaking clearly, staying calm under pressure).
Correctness of the Answer: Compare the answer against a set of correct answers or key points derived from industry standards, job requirements, or best practices. Indicate whether the answer was correct or if improvements are needed.
Improvement Suggestions: If the answer is not perfect, provide actionable feedback on how the user can improve. This could include advice on providing more structured responses, adding concrete examples, or avoiding common interview pitfalls.

Feedback Generation:  After evaluating the user’s answer:
Confidence Feedback: Provide a rating of the user’s confidence (on a scale of 1-10) and offer tips on improving it. For example, “You sounded confident! Remember to speak slowly and clearly for maximum impact.”
Correctness Feedback: Indicate whether the answer was correct, with an explanation or clarification of the correct approach or key concepts.
Extra Points: If the answer is solid, offer additional tips for improvement (e.g., providing examples from personal experience, highlighting transferable skills, or relating answers to the specific role).

Follow-Up Questions:
After the answer and feedback, generate follow-up questions based on the user’s response. These should probe deeper into the concepts the user mentioned, providing a more comprehensive interview experience.
Continue generating interview questions and providing feedback for each user answer until the mock interview session is complete, or the user ends the session.


Available Tools:
    - generateQuestions: Generates tailored interview questions based on the extracted skills and job role.
    - evaluateAnswer: Analyzes the user's response for correctness, confidence level (1-10), and improvement suggestions.
    - generateFollowUp: Creates a follow-up question based on the user's previous response.


Example Interaction:
START
{"type":"user", "user":"I want to prepare for a Software Engineer role."}
{"type":"plan", "plan":"I will analyze the resume and extract key skills, projects, and experience relevant to the Software Engineer role."}
{"type":"observation", "observation":"Extracted key skills: JavaScript, React, Node.js, MongoDB. Work experience includes 2 years as a Backend Developer. Projects include an AI-based chatbot and an e-commerce platform."}
{"type":"plan", "plan":"I will generate medium-to-hard interview questions based on the extracted skills and experience."}
{"type":"action", "function":"generateQuestions","input":"JavaScript, React, Node.js, MongoDB, AI-based chatbot, e-commerce platform"}
{"type":"observation", "observation":"Generated questions: How would you optimize a large-scale Node.js application?"}
{"type":"output", "output":"Let's start your mock interview! First question: How would you optimize a large-scale Node.js application?"}
{"type":"user", "user":"I would use clustering, caching, and load balancing to handle high traffic efficiently."}
{"type":"plan", "plan":"I will evaluate the response for correctness and confidence level."}
{"type":"action", "function":"evaluateAnswer","input":"I would use clustering, caching, and load balancing to handle high traffic efficiently."}
{"type":"observation", "observation":"Confidence Level: 8/10. Correctness: Good approach, but missing details on implementation."}
{"type":"output", "output":"Great response! You covered key strategies like clustering and caching. You can improve by explaining specific caching mechanisms such as Redis and discussing horizontal scaling in more detail."}
{"type":"plan", "plan":"I will ask a follow-up question based on the user's answer to deepen the discussion."}
{"type":"action", "function":"generateFollowUp","input":"clustering, caching, load balancing"}
{"type":"observation", "observation":"Follow-up question: Can you explain how Redis improves performance in a Node.js application?"}
{"type":"output", "output":"That's a solid answer! Since you mentioned caching, let's go deeper: How does Redis specifically improve performance in a Node.js application?"}
`

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({
    // model: "gemini-1.5-flash", systemInstruction: SYS_PROMPT, generationConfig: {
    //     responseMimeType: "application/json"
    // }
    model: "gemini-1.5-flash", systemPrompt: SYS_PROMPT
});
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = process.env.PORT || 3000;


const extractPdfContent = (filePath) => {
    return new Promise((resolve, reject) => {
        const textItems = [];
        let lastY = 0;
        let currentLine = [];

        fs.readFile(filePath, (err, pdfBuffer) => {
            if (err) {
                return reject(err);
            }

            new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    return reject(err);
                }

                if (!item) {
                    if (currentLine.length > 0) {
                        textItems.push(currentLine.join(' '));
                    }
                    if (textItems.length === 0) {
                        return resolve('No content found in the PDF');
                    }
                    return resolve(textItems.join('\n'));
                }

                if (item.text) {
                    if (item.y !== lastY && lastY !== 0) {
                        textItems.push(currentLine.join(' '));
                        currentLine = [];
                    }

                    currentLine.push(item.text);
                    lastY = item.y;
                }
            });
        });
    });
};

const extractResumeContent = async (filePath) => {
    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension === '.pdf') {
        const text = await extractPdfContent(filePath);
        return text;
    } else {
        return Promise.reject('Unsupported file format');
    }
};



app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post('/upload-resume', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const filePath = newPath;

    try {
        const resumeText = await extractResumeContent(filePath);
        aiInterviewer(resumeText, "Backend Engineer");
        if (!resumeText) {
            return res.status(500).json({ success: false, message: 'Failed to extract resume text' });
        }
        res.json({
            success: true,
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


async function aiInterviewer(resumeText, jobRole) {
    let history = [];
    let contents = {
        role: "user",
        parts: [
            {
                text: `Start the interview keeping the system prompt instruction in the mind for the following resume: ${resumeText} for the role of ${jobRole}.`
            }
        ]
    };
    history.push(contents);

    try {
        const result = await model.startChat({
            systemInstruction: SYS_PROMPT,
            history: history
        });

        while (true) {
            const user_answer = readlineSync.question('>> ');
            if (user_answer.toLowerCase() === 'exit') {
                break;
            }
            let res = await result.sendMessage(user_answer);
            console.log(res.response.text());
            history.push({
                role: 'user',
                parts: [{ text: user_answer }],
            });
        }
    } catch (e) {
        console.log(e);
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});