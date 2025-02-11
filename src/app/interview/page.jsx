"use client"
import * as pdfjsLib from "pdfjs-dist/build/pdf"
import "pdfjs-dist/build/pdf.worker.mjs"
import { useState, useRef, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Loader2, Bot, Mic, MicOff, Upload, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useSpeechToText from 'react-hook-speech-to-text';

export default function AIInterviewer() {
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    const [file, setFile] = useState(null)
    const [role, setRole] = useState("")
    const [isInterviewStarted, setIsInterviewStarted] = useState(false)
    // const [is_Recording, setIsRecording] = useState(false)
    const fileInputRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [userRes, setUserRes] = useState("")
    const [aiRes, setAiRes] = useState("")
    const [history, setHistory] = useState([
        {
            role: "user",
            parts: [
                { text: "You are an AI-powered mock interviewer that evaluates user responses based on their resume content and the role they wish to apply for. The system will generate tailored interview questions, assess the user’s answers, and provide feedback on confidence, correctness, and areas for improvement.\n\nUser Input:\nResume Content: The user will provide the content of their resume (e.g., skills, experience, education, certifications, projects) in plain text format.\nJob Role: The user will specify the role they wish to apply for (e.g., Software Engineer, Data Scientist, Product Manager).\nSystem Flow:\n\nContent Extraction & Analysis:\nParse the provided resume content to identify key areas: skills, work experience, projects, education, certifications, and personal achievements.\nMatch these details with the job role to determine the competencies and skills most relevant to the role.\n\nQuestion Generation:\nBased on the extracted resume content and job role, generate medium-to-hard interview questions.\nQuestions should be designed to test both technical proficiency (if applicable to the role) and behavioral aspects of the user.\nEnsure that the questions are in random order, simulating a real-world interview scenario where questions are not asked in a fixed pattern.\n\nAnswer Evaluation: After each answer, analyze the response to evaluate three key aspects:\nConfidence Level: Use NLP models to detect tone, language structure, and confidence in the answer. Rate the confidence level on a scale of 1-10 and provide tips for improvement (e.g., speaking clearly, staying calm under pressure).\nCorrectness of the Answer: Compare the answer against a set of correct answers or key points derived from industry standards, job requirements, or best practices. Indicate whether the answer was correct or if improvements are needed.\nImprovement Suggestions: If the answer is not perfect, provide actionable feedback on how the user can improve. This could include advice on providing more structured responses, adding concrete examples, or avoiding common interview pitfalls.\n\nFeedback Generation:  After evaluating the user’s answer:\nConfidence Feedback: Provide a rating of the user’s confidence (on a scale of 1-10) and offer tips on improving it. For example, “You sounded confident! Remember to speak slowly and clearly for maximum impact.”\nCorrectness Feedback: Indicate whether the answer was correct, with an explanation or clarification of the correct approach or key concepts.\nExtra Points: If the answer is solid, offer additional tips for improvement (e.g., providing examples from personal experience, highlighting transferable skills, or relating answers to the specific role).\n\n\nFollow-Up Questions:\nAfter the answer and feedback, generate follow-up questions based on the user’s response. These should probe deeper into the concepts the user mentioned, providing a more comprehensive interview experience.\nContinue generating interview questions and providing feedback for each user answer until the mock interview session is complete, or the user ends the session.\n\n  make sure you only asked question based on  the role or from some features or thing that is there in the resume , not apart from the resume if you want to ask some from resume" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "The user wants a mock interview simulator. I need to create a system that takes a resume and job role as input, generates interview questions based on the resume and role, evaluates the user's answers in terms of confidence and correctness, provides feedback, and asks follow-up questions.\n\nHere's a breakdown of the steps:\n\n1. **Content Extraction & Analysis:**  I need to parse the resume (plain text) and identify key sections like skills, experience, education, projects, etc.  Then, I need to relate these to the specified job role to understand relevant competencies.  For simplicity, I can assume keyword-based matching for now.  If the job role is \"Software Engineer\" and the resume mentions \"Python,\" \"Java,\" \"Data Structures,\" these are relevant.\n\n2. **Question Generation:** Based on the extracted keywords and the job role, I need to generate medium-to-hard interview questions.  These should cover both technical and behavioral aspects.  I must ensure the questions are *random* and based *only* on the resume content and the job role.  For a Software Engineer with \"Python\" and \"Data Structures\" on their resume, potential questions could be:\n    * Technical: \"Explain the difference between lists and tuples in Python.\"\n    * Behavioral: \"Describe a time you faced a challenging technical problem and how you solved it.\" (Relating to \"problem-solving\" implied in software engineering).\n\n3. **Answer Evaluation:**  For each user answer, I need to evaluate:\n    * **Confidence Level:**  This is tricky without actual audio input. I'll have to rely on *textual cues* of confidence.  For now, I can assume a simple heuristic:  longer answers with positive language might be considered more confident.  This is a simplification.  I'll use a scale of 1-10.  Tips for improvement could be generic like \"speak clearly,\" \"maintain eye contact\" (although this is text-based).\n    * **Correctness:**  I need a way to check if the answer is correct.  For technical questions, I'll need a predefined set of correct answers or key points.  For behavioral questions, it's more about the *quality* of the story and if it addresses the question.  I'll need to define some criteria for \"correctness.\"\n    * **Improvement Suggestions:**  If the answer isn't perfect, I need to provide actionable feedback.  This could be about structure, examples, avoiding jargon, etc.\n\n4. **Feedback Generation:** After evaluation, I need to present feedback on:\n    * **Confidence:** Rating (1-10) and tips.\n    * **Correctness:**  Correct/Incorrect and explanation.\n    * **Extra Points:**  For good answers, offer advice to make them even better (examples, transferable skills, role-specific relevance).\n\n5. **Follow-Up Questions:** Based on the user's answer, I need to generate follow-up questions.  These should delve deeper into the topics raised in the answer. If the user mentioned \"object-oriented programming\" when talking about Java, a follow-up could be \"Can you explain the principles of OOP?\"\n\n6. **Session Management:**  The system should continue asking questions and providing feedback until the user ends the session.\n\n**Constraint:**  Questions *must* be based on the resume content and the specified job role.  No questions outside of these boundaries.\n\n**Example Scenario:**\n\nResume (Simplified):\n```\nSkills: Python, Java, Data Structures, Algorithms\nExperience: Intern at Tech Company X\nEducation: BS in Computer Science\n```\nJob Role: Software Engineer\n\nQuestion 1 (Technical - based on \"Python\"): \"Explain the concept of decorators in Python.\"\nUser Answer: ...\nEvaluate Answer (Confidence, Correctness, Improvement).\nFeedback.\nFollow-up Question (e.g., \"Can you give an example of when you would use a decorator?\").\nQuestion 2 (Behavioral - based on \"Experience\" and general SE role): \"Tell me about a challenging project you worked on during your internship.\"\nUser Answer: ...\nEvaluate Answer.\nFeedback.\nFollow-up Question.\n... and so on.\n\n**Pre-computation/Pre-analysis:**\n\nFor question generation, I can create categories of questions related to typical resume sections (skills, experience, projects, education) and tailor them to the job role.  For example, for \"Skills,\" if the role is Software Engineer and a skill is \"Java,\" I can have a pool of Java-related technical questions. For \"Experience,\" I can have behavioral questions related to teamwork, problem-solving, etc.  For \"Projects,\" questions about project scope, challenges, outcomes.\n\nFor answer evaluation, I'll need to think about \"correct answers\" for technical questions and criteria for good behavioral answers. This will be more rule-based initially, and can be improved with more sophisticated NLP later.\n\nLet's start building the system step by step. I'll focus on:\n1. Resume parsing (simple keyword extraction).\n2. Question generation (based on keywords and role - initial set of question templates).\n3. Basic answer evaluation (confidence - rudimentary, correctness - keyword matching for technical, criteria for behavioral).\n4. Feedback generation (structured output).\n5. Follow-up questions (simple follow-up based on keywords in the answer)." },
                { text: "Okay, I understand! I'm ready to be your AI mock interviewer. Please provide me with your resume content and the job role you are applying for.\n\nOnce you provide this information, I will:\n\n1.  **Analyze your resume** to identify key skills, experiences, projects, and education relevant to the job role.\n2.  **Generate a set of interview questions** tailored to your resume and the job role. These questions will be a mix of technical and behavioral, depending on the role, and will be in a random order.\n3.  **Ask you the first question.**\n4.  **After you provide your answer**, I will evaluate it based on:\n    *   **Confidence Level (1-10):**  Based on your answer's tone and structure.\n    *   **Correctness:**  Compared to expected answers and industry best practices.\n    *   **Areas for Improvement:**  Specific, actionable feedback.\n5.  **Provide you with feedback** on your confidence, correctness, and suggestions for improvement.\n6.  **Ask a follow-up question** based on your answer to probe deeper.\n\n**Remember**:  All questions will be directly related to the content of your resume and the job role you specify. I will not ask questions that are outside of these boundaries.\n\n**Please provide your resume content and the job role so we can begin!**  I'm looking forward to helping you prepare for your interview." },
            ],
        },
    ])
    const chatContainerRef = useRef(null)

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const textToSpeech = (text) => {
        const speech = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(speech)
    }

    const handleStartInterview = async (user_res) => {
        if (!user_res) return
        setIsLoading(true)
        try {
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_res, history }),
            })
            if (response.ok) {
                setIsInterviewStarted(true)
                const { result } = await response.json()

                const formattedResponse = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                setAiRes(formattedResponse)
                textToSpeech(result)

                const paragraphs = result.trim().split("\n\n")
                const lastParagraph = paragraphs[paragraphs.length - 1]

                setHistory((prev) => [
                    ...prev,
                    { role: "user", parts: [{ text: user_res }] },
                    { role: "model", parts: [{ text: lastParagraph }] },
                ])
            }
        } catch (error) {
            console.error("Error starting interview:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleExtractText = async (e) => {
        e.preventDefault()
        if (!file || !role) return
        setIsLoading(true)
        try {
            const reader = new FileReader()

            reader.onload = async function () {
                const typedarray = new Uint8Array(this.result)
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise
                let extractedText = ""

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i)
                    const textContent = await page.getTextContent()
                    let pageText = ""

                    let lastY,
                        textLine = []
                    textContent.items.forEach((item) => {
                        if (lastY === item.transform[5] || lastY === undefined) {
                            textLine.push(item.str)
                        } else {
                            pageText += textLine.join(" ") + "\n"
                            textLine = [item.str]
                        }
                        lastY = item.transform[5]
                    })
                    pageText += textLine.join(" ")
                    extractedText += pageText + "\n"
                }
                handleStartInterview(`This is my resume text: ${extractedText} and I am applying for the role of ${role}`)
            }

            reader.readAsArrayBuffer(file)
        } catch (error) {
            console.error("Error extracting text:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (results.length > 0) {
            setUserRes((prev) => prev + " " + results[results.length - 1]?.transcript);
        }
    }, [results]);
    

    const handleStartRecording = () => {
        startSpeechToText()
    }

    const handleStopRecording = () => {
        stopSpeechToText()
    }

    const sendAudioToAI = async (transcriptionText) => {
        window.speechSynthesis.cancel()
        setIsLoading(true)
        try {
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_res: transcriptionText, history }),
            })

            if (response.ok) {
                const { result } = await response.json()
                const paragraphs = result.trim().split("\n\n")
                const lastParagraph = paragraphs[paragraphs.length - 1]

                const formattedResponse = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                setAiRes(formattedResponse)
                textToSpeech(result)

                setHistory((prev) => [
                    ...prev,
                    { role: "user", parts: [{ text: transcriptionText }] },
                    { role: "model", parts: [{ text: lastParagraph }] },
                ])
            }
        } catch (error) {
            console.error("Error processing text:", error)
        } finally {
            setIsLoading(false)
            setUserRes("")
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isLoading) {
            sendAudioToAI(userRes)
        }
    }

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [history])

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <Bot className="w-10 h-10 text-purple-600" />
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                        AI Interviewer
                    </h1>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!isInterviewStarted ? (
                        <motion.form
                            key="interview-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleExtractText}
                            className="space-y-8"
                        >
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <Label htmlFor="resume" className="text-lg font-semibold text-gray-800">
                                        Upload Your Resume
                                    </Label>
                                    <div className="mt-1 flex items-center gap-4">
                                        <Input
                                            id="resume"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            ref={fileInputRef}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 transform hover:scale-105"
                                            size="lg"
                                        >
                                            <Upload className="mr-2 h-5 w-5" />
                                            Choose PDF
                                        </Button>
                                        <span className="text-sm text-gray-600 truncate">
                                            {file ? file.name : "No file chosen"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label htmlFor="role" className="text-lg font-semibold text-gray-800">
                                        Desired Job Role
                                    </Label>
                                    <Input
                                        id="role"
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g., Software Engineer, Product Manager"
                                        className="bg-white text-gray-800 border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-lg p-6"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg py-6 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Preparing Your Interview...</span>
                                        </div>
                                    ) : (
                                        "Start Interview"
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-md rounded-lg p-6">
                                <h3 className="font-semibold mb-3 text-indigo-800 text-lg">AI Response:</h3>
                                <div
                                    className="text-gray-700 text-lg leading-relaxed"
                                    style={{ whiteSpace: "pre-wrap" }}
                                    dangerouslySetInnerHTML={{ __html: aiRes }}
                                />
                            </div>

                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h3 className="font-semibold mb-3 text-purple-800 text-lg">Your Response:</h3>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="text"
                                        value={userRes}
                                        onChange={(e) => setUserRes(e.target.value)}
                                        placeholder="Type your response..."
                                        onKeyDown={handleKeyDown}
                                        className="flex-grow bg-white text-gray-800 text-lg p-6"
                                    />
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 text-white h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                                        disabled={isLoading}
                                        onClick={() => sendAudioToAI(userRes)}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <Send className="h-6 w-6" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div
                                className="bg-gradient-to-b from-gray-50 to-white shadow-md rounded-lg max-h-[400px] overflow-y-auto p-6 space-y-4"
                                ref={chatContainerRef}
                            >
                                {history.slice(3).map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 rounded-2xl ${message.role === "user"
                                            ? "bg-gradient-to-r from-purple-100 to-indigo-100 text-gray-800 ml-auto max-w-[80%]"
                                            : "bg-gradient-to-r from-gray-100 to-blue-100 text-gray-800 max-w-[80%]"
                                            }`}
                                    >
                                        <p className="font-semibold mb-2">
                                            {message.role === "user" ? "You" : "AI Interviewer"}
                                        </p>
                                        <p className="text-lg leading-relaxed">{message.parts[0].text}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Button
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                    className={`px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 ${isRecording
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                        } text-white text-lg`}
                                >
                                    {isRecording ? (
                                        <div className="flex items-center gap-2">
                                            <MicOff className="h-6 w-6" />
                                            <span>Stop Recording</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Mic className="h-6 w-6" />
                                            <span>Start Recording</span>
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}