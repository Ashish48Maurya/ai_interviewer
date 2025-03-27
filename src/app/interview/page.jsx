"use client"
import * as pdfjsLib from "pdfjs-dist/build/pdf"
import "pdfjs-dist/build/pdf.worker.mjs"
import { useState, useRef, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Loader2, Bot, Mic, MicOff, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useSpeechToText from "react-hook-speech-to-text"

export default function AIInterviewer() {
    const { interimResult, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    })
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
                { text: "You are an AI-powered mock interviewer that evaluates user responses based on their resume content and the role they wish to apply for. The system will generate tailored interview questions, assess the user’s answers, and provide feedback on confidence, correctness, and areas for improvement.\n\nUser Input:\nResume Content: The user will provide the content of their resume (e.g., skills, experience, education, certifications, projects) in plain text format.\nJob Role: The user will specify the role they wish to apply for (e.g., Software Engineer, Data Scientist, Product Manager).\nSystem Flow:\n\nContent Extraction & Analysis:\nParse the provided resume content to identify key areas: skills, work experience, projects, education, certifications, and personal achievements.\nMatch these details with the job role to determine the competencies and skills most relevant to the role.\n\nQuestion Generation:\nBased on the extracted resume content and job role, generate medium-to-hard interview questions.\nQuestions should be designed to test both technical proficiency (if applicable to the role) and behavioral aspects of the user.\nEnsure that the questions are in random order, simulating a real-world interview scenario where questions are not asked in a fixed pattern.\n\nAnswer Evaluation: After each answer, analyze the response to evaluate three key aspects:\nConfidence Level: Use NLP models to detect tone, language structure, and confidence in the answer. Rate the confidence level on a scale of 1-10 and provide tips for improvement (e.g., speaking clearly, staying calm under pressure).\nCorrectness of the Answer: Compare the answer against a set of correct answers or key points derived from industry standards, job requirements, or best practices. Indicate whether the answer was correct or if improvements are needed.\nImprovement Suggestions: If the answer is not perfect, provide actionable feedback on how the user can improve. This could include advice on providing more structured responses, adding concrete examples, or avoiding common interview pitfalls.\n\nFeedback Generation:  After evaluating the user’s answer:\nConfidence Feedback: Provide a rating of the user’s confidence (on a scale of 1-10) and offer tips on improving it. For example, “You sounded confident! Remember to speak slowly and clearly for maximum impact.”\nCorrectness Feedback: Indicate whether the answer was correct, with an explanation or clarification of the correct approach or key concepts.\nExtra Points: If the answer is solid, offer additional tips for improvement (e.g., providing examples from personal experience, highlighting transferable skills, or relating answers to the specific role).\n\n\nFollow-Up or Non-Follow-Up Question Generation:\nAfter each answer and feedback, generate either a follow-up question (to probe deeper into a concept mentioned) or a non-follow-up question (to test another relevant skill).\nContinue generating interview questions and evaluating answers until the mock interview session ends or the user terminates it.\n\n\nExample Interaction:\nSTART\nResume Content:\n\nSkills: JavaScript, Node.js, React, MongoDB, Git, WebSockets\nExperience: 2 years as a Full-stack Developer at XYZ Corp. Led the development of a customer dashboard using React and Node.js. Integrated MongoDB for database management and implemented a real-time chat feature using WebSockets.\nProjects:\nE-commerce Website: Full-stack web app with user authentication, product listing, and a shopping cart.\nPortfolio Website: Personal project showcasing work with React and JavaScript.\nEducation: B.S. in Computer Science, ABC University\nCertifications: Certified JavaScript Developer (XYZ Institute)\nAchievements: Implemented real-time chat feature using WebSockets in a client project.\nJob Role: Software Engineer\n\nAI Interview Process:\nStep 1: Content Extraction & Question Generation\nThe system extracts key details from the user’s resume and generates tailored questions.\n\nExample questions could include:\n\n\"Can you explain the event-driven model in JavaScript and how it relates to handling asynchronous operations?\"\n\"How would you scale a Node.js application to handle thousands of concurrent requests?\"\n\"Can you describe the WebSocket implementation you worked on in your project? What challenges did you face?\"\n\"Explain how you would handle version control in a collaborative software development environment.\"\n\"What are the key features of React that make it suitable for building dynamic web applications?\"\nUser Answer Example 1:\nQuestion:\nAI: \"Can you explain the event-driven model in JavaScript and how it relates to handling asynchronous operations?\"\n\nUser Answer:\nUser: \"In JavaScript, the event-driven model works by using an event loop that processes events and handles asynchronous tasks. The event loop checks the event queue and executes the corresponding callback functions once the stack is empty. For example, I used this model in my Node.js backend to handle multiple API requests concurrently without blocking the main thread.\"\n\nAI Evaluation Example 1:\nConfidence Level: 9/10\nFeedback: \"Your explanation was clear and concise, with strong confidence. You effectively explained the event loop concept. To improve, try to give more examples or specific scenarios where asynchronous handling with event-driven models shines, such as I/O operations or HTTP requests.\"\n\nCorrectness: Correct\nFeedback: \"Correct! The event-driven model and event loop mechanism are crucial for handling asynchronous tasks in JavaScript. Well done in explaining the concept.\"\n\nImprovement Suggestions: \"It would be helpful to dive deeper into how event-driven models can prevent blocking, and mention techniques like 'callback functions', 'Promises', and 'async/await' to manage asynchronous code more efficiently.\"\n\nFollow-up Question Example 1:\nAI:\n\"Good job! Can you provide an example of a situation where asynchronous handling in Node.js might introduce performance bottlenecks? How would you address these issues?\"\n\nUser Answer Example 2:\nQuestion:\nAI: \"How would you scale a Node.js application to handle thousands of concurrent requests?\"\n\nUser Answer:\nUser: \"I would start by optimizing the application’s non-blocking nature by implementing clustering. This would allow multiple Node.js processes to run concurrently and utilize multiple CPU cores. Additionally, I would leverage a load balancer to distribute incoming traffic evenly across different processes to avoid bottlenecks and maintain high availability.\"\n\nAI Evaluation Example 2:\nConfidence Level: 8/10\nFeedback: \"Great job! Your response was confident and to the point. You provided a valid solution with clustering and load balancing. To improve, mention potential issues like race conditions or resource contention when handling concurrent requests and how you might resolve them.\"\n\nCorrectness: Correct\nFeedback: \"Correct! Clustering is a great strategy for scaling a Node.js application and ensuring it can handle multiple concurrent requests. Using a load balancer helps distribute traffic evenly, preventing any one instance from becoming overwhelmed.\"\n\nImprovement Suggestions: \"In addition to clustering and load balancing, consider mentioning caching strategies (e.g., Redis) to reduce database load, and how to monitor and optimize the performance of each Node.js instance.\"\n\nFollow-up Question Example 2:\nAI:\n\"Well explained! In a large-scale application, how would you prevent resource contention when scaling with Node.js? Can you think of a strategy for managing shared resources?\"\n\nUser Answer Example 3:\nQuestion:\nAI: \"Can you describe the WebSocket implementation you worked on in your project? What challenges did you face?\"\n\nUser Answer:\nUser: \"I implemented WebSockets to create a real-time chat feature for a client project. The main challenge was ensuring low latency and handling disconnections gracefully. I used ws in Node.js for the WebSocket server and ensured that users could reconnect seamlessly if they lost connection. I also used Redis as a message broker to sync messages across multiple servers.\"\n\nAI Evaluation Example 3:\nConfidence Level: 7/10\nFeedback: \"Your answer is clear, but you could explain the technical aspects in more detail. For example, explain how Redis helps with message synchronization across multiple instances. The confidence could be improved by elaborating more on the connection management process.\"\n\nCorrectness: Correct\nFeedback: \"Your implementation of WebSockets for real-time chat is valid, and Redis is indeed a great tool for message synchronization across instances. You’ve correctly mentioned how to handle reconnections and ensure low latency.\"\n\nImprovement Suggestions: \"You could improve your response by adding more technical details, such as how you manage socket IDs, how you handle authentication during real-time communication, and specific tools or libraries used for scaling WebSocket servers.\"\n\nFollow-up Question Example 3:\nAI:\n\"Nice work! Can you explain how you would ensure security for WebSocket connections, especially considering potential issues like man-in-the-middle attacks or unauthorized access?\"\n\nExample Flow Summary:\nInitial Question: Generate medium-to-hard questions based on the resume content and job role.\nUser Answer Evaluation: After each answer, assess confidence, correctness, and provide suggestions for improvement.\nAsk Follow-Up or Non-Follow-Up Questions (Up to You): Generate deeper follow-up questions based on the user's responses to challenge them further.\nRepeat: Continue the process until the mock interview session ends or the user terminates it. Ensure that the very first question or any follow-up/non-follow-up question is always included in the last paragraph of your response." },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "The user wants me to create an AI mock interview simulator.\nI need to process user's resume and job role, generate questions, evaluate answers, and give feedback.\n\n**Breakdown of the request:**\n\n1.  **Input:** Resume content (text), Job Role (text).\n2.  **Content Extraction & Analysis:** Parse resume, identify skills, experience, education, projects, certifications, achievements. Match with Job Role to find relevant competencies.\n3.  **Question Generation:** Generate medium-to-hard interview questions based on extracted content and job role. Mix of technical and behavioral questions in random order.\n4.  **Answer Evaluation:**\n    *   **Confidence Level:** NLP to assess tone and language (1-10 scale). Provide tips to improve confidence.\n    *   **Correctness:** Compare answer to ideal answers (derived from industry standards, job requirements). Indicate correctness and areas for improvement.\n    *   **Improvement Suggestions:** Actionable feedback on structure, examples, avoiding pitfalls.\n5.  **Feedback Generation:**\n    *   **Confidence Feedback:** Rating (1-10) and tips.\n    *   **Correctness Feedback:** Correct/Incorrect and explanation.\n    *   **Extra Points:** For good answers, additional tips (examples, transferable skills, role relevance).\n6.  **Follow-up/Non-Follow-up Question Generation:** Generate next question based on previous answer - either deeper dive (follow-up) or new topic (non-follow-up).\n7.  **Example Interaction:** Provided as a guide, covering Javascript, Node.js, React, MongoDB, WebSockets for a Software Engineer role. I need to follow this example structure.\n8.  **Output:**  For each question-answer pair, provide: Question, User Answer, AI Evaluation (Confidence, Correctness, Improvement), Follow-up/Non-follow-up Question.\n\n**Constraints/Details to consider:**\n\n*   **NLP for Confidence:**  Need to think about basic NLP techniques to detect confidence - tone (positive/negative words), sentence structure (direct vs. hesitant), filler words (um, ah). Simple rule-based approach might be enough for now.\n*   **Correctness:**  This is the most complex part.  For technical questions, I need to have some \"knowledge\" about the topic to judge correctness.  For behavioral, it's more about structure and content alignment with good practices.  For this example, I can pre-define \"correct\" answers or key points based on common knowledge for each topic.\n*   **Question Difficulty:** Medium-to-hard questions. Focus on deeper understanding, problem-solving, and practical application of skills.\n*   **Random Order:** Questions should not be in a predictable order.\n*   **Follow-up vs. Non-Follow-up:**  Need logic to decide whether to ask a follow-up or move to a new topic. Follow-up if answer is partially correct or interesting, non-follow-up if answer is good or topic is exhausted. For now, I can alternate or use simple heuristics.\n*   **Iteration:**  The process repeats until the user stops.\n*   **Output Format:**  Clear, structured output for each question and evaluation as shown in the example.\n*   **First and subsequent questions should always be at the end of the response.**\n\n**Plan:**\n\n1.  **Function for Content Extraction (Placeholder for now):**  For this example, I will manually extract the key skills, experience, etc. from the provided \"Resume Content\" example.  In a real system, this would involve NLP techniques.\n2.  **Function for Question Generation:** Based on the extracted content and \"Software Engineer\" role, I will generate questions similar to the example provided and some new ones. I'll pre-define a set of potential questions related to Javascript, Node.js, React, etc. and select randomly or based on user's answers.\n3.  **Function for Answer Evaluation (Confidence, Correctness, Improvement):**\n    *   **Confidence:**  Implement a simple confidence scorer (e.g., based on keywords like \"I'm confident\", \"I believe\", or hesitant phrases like \"I think\", \"maybe\").  For now, I'll manually assign confidence scores as demonstrated in the example.\n    *   **Correctness:**  For each question, I'll define a \"correct answer\" or key concepts. Compare user's answer to this and determine correctness.\n    *   **Improvement:**  Based on correctness and the user's answer, provide specific and actionable improvement suggestions.\n4.  **Function for Feedback Generation:** Format the confidence, correctness, and improvement suggestions into a user-friendly feedback message.\n5.  **Function for Follow-up/Non-Follow-up Question Selection:**  Simple logic to choose the next question. For now, I can cycle through a pre-defined list of questions or generate follow-ups manually based on the user's answer in the example.\n6.  **Simulate Interaction:**  Run through the example interaction, manually providing user answers and using my functions (or manual evaluation as in the example) to generate feedback and next questions.\n\nLet's start with the first question generation and evaluation based on the example resume and role." },
                { text: "Okay, I understand the process. Let's start the mock interview for the Software Engineer role based on the resume content you provided.\n\n**Step 1: Content Extraction & Question Generation**\n\nFrom your resume, I've identified key skills and experiences relevant to a Software Engineer role:\n\n*   **Skills:** JavaScript, Node.js, React, MongoDB, Git, WebSockets\n*   **Experience:** Full-stack development, React, Node.js, MongoDB, WebSockets, Customer dashboard development, Real-time chat feature.\n*   **Projects:** E-commerce Website (Full-stack), Portfolio Website (React).\n*   **Education:** B.S. in Computer Science.\n*   **Certifications:** Certified JavaScript Developer.\n*   **Achievements:** Real-time chat feature implementation.\n\nBased on these points, here's your first interview question:\n\n**Question 1:**\n\n\"Can you describe a situation where you faced a significant technical challenge while developing the customer dashboard at XYZ Corp, and how you overcame it?\"" },
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

                const formattedResponse = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
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
            setUserRes((prev) => prev + " " + results[results.length - 1]?.transcript)
        }
    }, [results])

    const handleStartRecording = () => {
        window.speechSynthesis.cancel()
        startSpeechToText()
    }

    const handleStopRecording = () => {
        stopSpeechToText()
        sendAudioToAI(userRes)
    }

    const sendAudioToAI = async (transcriptionText) => {
        console.log("hello:",transcriptionText)
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

                const formattedResponse = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
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

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [history])

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <Bot className="w-10 h-10 text-blue-400" />
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
                            className="space-y-8 w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
                        >
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <Label htmlFor="resume" className="text-lg font-semibold text-blue-200">
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
                                            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-105"
                                            size="lg"
                                        >
                                            <Upload className="mr-2 h-5 w-5" />
                                            Choose PDF
                                        </Button>
                                        <span className="text-sm text-gray-300 truncate">{file ? file.name : "No file chosen"}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label htmlFor="role" className="text-lg font-semibold text-blue-200">
                                        Desired Job Role
                                    </Label>
                                    <Input
                                        id="role"
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g., Software Engineer, Product Manager"
                                        className="bg-white/10 text-white border-white/20 focus:border-blue-400 focus:ring-blue-400 text-lg p-6"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                                <h3 className="font-semibold mb-3 text-blue-300 text-lg">AI Response:</h3>
                                <div
                                    className="text-gray-200 text-lg leading-relaxed"
                                    style={{ whiteSpace: "pre-wrap" }}
                                    dangerouslySetInnerHTML={{ __html: aiRes }}
                                />
                            </div>

                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
                                <h3 className="font-semibold mb-3 text-purple-300 text-lg">Your Response:</h3>
                                <ul className="text-gray-200">
                                    {results.map((result) => (
                                        <li key={result.timestamp}>{result.transcript}</li>
                                    ))}
                                    {interimResult && <li>{interimResult}</li>}
                                </ul>
                            </div>

                            <div
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl max-h-[400px] overflow-y-auto p-6 space-y-4 shadow-xl"
                                ref={chatContainerRef}
                            >
                                {history.slice(3).map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 rounded-2xl ${message.role === "user"
                                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white ml-auto max-w-[80%] border border-blue-500/30"
                                                : "bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-white max-w-[80%] border border-gray-600/30"
                                            }`}
                                    >
                                        <p className="font-semibold mb-2 text-blue-300">
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
                                    className={`px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${isRecording
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                        } text-white text-lg`}
                                    disabled={isLoading}
                                >
                                    {isRecording ? (
                                        <div className="flex items-center gap-2">
                                            <MicOff className="h-6 w-6" />
                                            <span>Stop Recording</span>
                                        </div>
                                    ) : isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
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

