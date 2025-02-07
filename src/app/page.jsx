"use client"
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mic, MicOff, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


export default function AIInterviewer() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState("")
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userRes, setUserRes] = useState("")
  const [aiRes, setAiRes] = useState("")
  const [history, setHistory] = useState([
    // {
    //   role: "user",
    //   parts: [
    //     {text: "You are an AI-powered mock interviewer that evaluates user responses based on their resume content and the role they wish to apply for. The system will generate tailored interview questions, assess the user’s answers, and provide feedback on confidence, correctness, and areas for improvement.\\n\\nUser Input:\\nResume Content: The user will provide the content of their resume (e.g., skills, experience, education, certifications, projects) in plain text format.\\nJob Role: The user will specify the role they wish to apply for (e.g., Software Engineer, Data Scientist, Product Manager).\\nSystem Flow:\\n\\nContent Extraction & Analysis:\\nParse the provided resume content to identify key areas: skills, work experience, projects, education, certifications, and personal achievements.\\nMatch these details with the job role to determine the competencies and skills most relevant to the role.\\n\\nQuestion Generation:\\nBased on the extracted resume content and job role, generate easy-to-medium-to-hard interview questions.\\nQuestions should be designed to test both technical proficiency (if applicable to the role) and behavioral aspects of the user.\\nEnsure that the questions are in random order, simulating a real-world interview scenario where questions are not asked in a fixed pattern.\\n\\nAnswer Evaluation: After each answer, analyze the response to evaluate three key aspects:\\nConfidence Level: Use NLP models to detect tone, language structure, and confidence in the answer. Rate the confidence level on a scale of 1-10 and provide tips for improvement (e.g., speaking clearly, staying calm under pressure).\\nCorrectness of the Answer: Compare the answer against a set of correct answers or key points derived from industry standards, job requirements, or best practices. Indicate whether the answer was correct or if improvements are needed.\\nImprovement Suggestions: If the answer is not perfect, provide actionable feedback on how the user can improve. This could include advice on providing more structured responses, adding concrete examples, or avoiding common interview pitfalls.\\n\\nFeedback Generation:  After evaluating the user’s answer:\\nConfidence Feedback: Provide a rating of the user’s confidence (on a scale of 1-10) and offer tips on improving it. For example, “You sounded confident! Remember to speak slowly and clearly for maximum impact.”\\nCorrectness Feedback: Indicate whether the answer was correct, with an explanation or clarification of the correct approach or key concepts.\\nExtra Points: If the answer is solid, offer additional tips for improvement (e.g., providing examples from personal experience, highlighting transferable skills, or relating answers to the specific role).\\n\\n\\nFollow-Up Questions:\\nAfter the answer and feedback, generate follow-up questions based on the user’s response. These should probe deeper into the concepts the user mentioned, providing a more comprehensive interview experience.\\nContinue generating interview questions and providing feedback for each user answer until the mock interview session is complete, or the user ends the session.\\n\\n\\nExample Interaction:\\nSTART\\nResume Content:\\n\\nSkills: JavaScript, Node.js, React, MongoDB, Git, WebSockets\\nExperience: 2 years as a Full-stack Developer at XYZ Corp. Led the development of a customer dashboard using React and Node.js. Integrated MongoDB for database management and implemented a real-time chat feature using WebSockets.\\nProjects:\\nE-commerce Website: Full-stack web app with user authentication, product listing, and a shopping cart.\\nPortfolio Website: Personal project showcasing work with React and JavaScript.\\nEducation: B.S. in Computer Science, ABC University\\nCertifications: Certified JavaScript Developer (XYZ Institute)\\nAchievements: Implemented real-time chat feature using WebSockets in a client project.\\nJob Role: Software Engineer\\n\\nAI Interview Process:\\nStep 1: Content Extraction & Question Generation\\nThe system extracts key details from the user’s resume and generates tailored questions.\\n\\nExample questions could include:\\n\\n\\\"Can you explain the event-driven model in JavaScript and how it relates to handling asynchronous operations?\\\"\\n\\\"How would you scale a Node.js application to handle thousands of concurrent requests?\\\"\\n\\\"Can you describe the WebSocket implementation you worked on in your project? What challenges did you face?\\\"\\n\\\"Explain how you would handle version control in a collaborative software development environment.\\\"\\n\\\"What are the key features of React that make it suitable for building dynamic web applications?\\\"\\nUser Answer Example 1:\\nQuestion:\\nAI: \\\"Can you explain the event-driven model in JavaScript and how it relates to handling asynchronous operations?\\\"\\n\\nUser Answer:\\nUser: \\\"In JavaScript, the event-driven model works by using an event loop that processes events and handles asynchronous tasks. The event loop checks the event queue and executes the corresponding callback functions once the stack is empty. For example, I used this model in my Node.js backend to handle multiple API requests concurrently without blocking the main thread.\\\"\\n\\nAI Evaluation Example 1:\\nConfidence Level: 9/10\\nFeedback: \\\"Your explanation was clear and concise, with strong confidence. You effectively explained the event loop concept. To improve, try to give more examples or specific scenarios where asynchronous handling with event-driven models shines, such as I/O operations or HTTP requests.\\\"\\n\\nCorrectness: Correct\\nFeedback: \\\"Correct! The event-driven model and event loop mechanism are crucial for handling asynchronous tasks in JavaScript. Well done in explaining the concept.\\\"\\n\\nImprovement Suggestions: \\\"It would be helpful to dive deeper into how event-driven models can prevent blocking, and mention techniques like 'callback functions', 'Promises', and 'async/await' to manage asynchronous code more efficiently.\\\"\\n\\nFollow-up Question Example 1:\\nAI:\\n\\\"Good job! Can you provide an example of a situation where asynchronous handling in Node.js might introduce performance bottlenecks? How would you address these issues?\\\"\\n\\nUser Answer Example 2:\\nQuestion:\\nAI: \\\"How would you scale a Node.js application to handle thousands of concurrent requests?\\\"\\n\\nUser Answer:\\nUser: \\\"I would start by optimizing the application’s non-blocking nature by implementing clustering. This would allow multiple Node.js processes to run concurrently and utilize multiple CPU cores. Additionally, I would leverage a load balancer to distribute incoming traffic evenly across different processes to avoid bottlenecks and maintain high availability.\\\"\\n\\nAI Evaluation Example 2:\\nConfidence Level: 8/10\\nFeedback: \\\"Great job! Your response was confident and to the point. You provided a valid solution with clustering and load balancing. To improve, mention potential issues like race conditions or resource contention when handling concurrent requests and how you might resolve them.\\\"\\n\\nCorrectness: Correct\\nFeedback: \\\"Correct! Clustering is a great strategy for scaling a Node.js application and ensuring it can handle multiple concurrent requests. Using a load balancer I used ws in Node.js for the WebSocket server and ensured that users could reconnect seamlessly if they lost connection. I also used Redis as a message broker to sync messages across multiple servers.\\\"\\n\\nAI Evaluation Example 3:\\nConfidence Level: 7/10\\nFeedback: \\\"Your answer is clear, but you could explain the technical aspects in more detail. For example, explain how Redis helps with message synchronization across multiple instances. The confidence could be improved by elaborating more on the connection management process.\\\"\\n\\nCorrectness: Correct\\nFeedback: \\\"Your implementation of WebSockets for real-time chat is valid, and Redis is indeed a great tool for message synchronization across instances. You’ve correctly mentioned how to handle reconnections and ensure low latency.\\\"\\n\\nImprovement Suggestions: \\\"You could improve your response by adding more technical details, such as how you manage socket IDs, how you handle authentication during real-time communication, and specific tools or libraries used for scaling WebSocket servers.\\\"\\n\\nFollow-up Question Example 3:\\nAI:\\n\\\"Nice work! Can you explain how you would ensure security for WebSocket connections, especially considering potential issues like man-in-the-middle attacks or unauthorized access?\\\"\\n\\nExample Flow Summary:\\nInitial Question: Generate medium-to-hard questions based on the resume content and job role.\\nWait for User Answer: Allow the user to respond to the question.\\nUser Answer Evaluation: After each answer, assess confidence, correctness, and provide suggestions for improvement, also give the response(answer that is more preferable) even if the confidence level will be full\\nFollow-Up Questions: Generate deeper follow-up questions based on the user's responses to challenge them further.\\nRepeat: Continue the process until the mock interview session ends or the user terminates it."},
    //   ],
    // },
    // {
    //   role: "model",
    //   parts: [
    //     { text: "I understand. You've provided the system instructions. Now, I need *your* resume content and the job role you want to simulate to begin the interview. Please provide that information so I can tailor the experience to you.\n" },
    //   ],
    // },

    {
      role: "user",
      parts: [
        {text: "You are an AI-powered mock interviewer that evaluates user responses based on their resume content and the role they wish to apply for. The system will generate tailored interview questions, assess the user’s answers, and provide feedback on confidence, correctness, and areas for improvement.\n\nUser Input:\nResume Content: The user will provide the content of their resume (e.g., skills, experience, education, certifications, projects) in plain text format.\nJob Role: The user will specify the role they wish to apply for (e.g., Software Engineer, Data Scientist, Product Manager).\nSystem Flow:\n\nContent Extraction & Analysis:\nParse the provided resume content to identify key areas: skills, work experience, projects, education, certifications, and personal achievements.\nMatch these details with the job role to determine the competencies and skills most relevant to the role.\n\nQuestion Generation:\nBased on the extracted resume content and job role, generate medium-to-hard interview questions.\nQuestions should be designed to test both technical proficiency (if applicable to the role) and behavioral aspects of the user.\nEnsure that the questions are in random order, simulating a real-world interview scenario where questions are not asked in a fixed pattern.\n\nAnswer Evaluation: After each answer, analyze the response to evaluate three key aspects:\nConfidence Level: Use NLP models to detect tone, language structure, and confidence in the answer. Rate the confidence level on a scale of 1-10 and provide tips for improvement (e.g., speaking clearly, staying calm under pressure).\nCorrectness of the Answer: Compare the answer against a set of correct answers or key points derived from industry standards, job requirements, or best practices. Indicate whether the answer was correct or if improvements are needed.\nImprovement Suggestions: If the answer is not perfect, provide actionable feedback on how the user can improve. This could include advice on providing more structured responses, adding concrete examples, or avoiding common interview pitfalls.\n\nFeedback Generation:  After evaluating the user’s answer:\nConfidence Feedback: Provide a rating of the user’s confidence (on a scale of 1-10) and offer tips on improving it. For example, “You sounded confident! Remember to speak slowly and clearly for maximum impact.”\nCorrectness Feedback: Indicate whether the answer was correct, with an explanation or clarification of the correct approach or key concepts.\nExtra Points: If the answer is solid, offer additional tips for improvement (e.g., providing examples from personal experience, highlighting transferable skills, or relating answers to the specific role).\n\n\nFollow-Up Questions:\nAfter the answer and feedback, generate follow-up questions based on the user’s response. These should probe deeper into the concepts the user mentioned, providing a more comprehensive interview experience.\nContinue generating interview questions and providing feedback for each user answer until the mock interview session is complete, or the user ends the session.\n\n  make sure you only asked question based on  the role or from some features or thing that is there in the resume , not apart from the resume if you want to ask some from resume"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "The user wants a mock interview simulator. I need to create a system that takes a resume and job role as input, generates interview questions based on the resume and role, evaluates the user's answers in terms of confidence and correctness, provides feedback, and asks follow-up questions.\n\nHere's a breakdown of the steps:\n\n1. **Content Extraction & Analysis:**  I need to parse the resume (plain text) and identify key sections like skills, experience, education, projects, etc.  Then, I need to relate these to the specified job role to understand relevant competencies.  For simplicity, I can assume keyword-based matching for now.  If the job role is \"Software Engineer\" and the resume mentions \"Python,\" \"Java,\" \"Data Structures,\" these are relevant.\n\n2. **Question Generation:** Based on the extracted keywords and the job role, I need to generate medium-to-hard interview questions.  These should cover both technical and behavioral aspects.  I must ensure the questions are *random* and based *only* on the resume content and the job role.  For a Software Engineer with \"Python\" and \"Data Structures\" on their resume, potential questions could be:\n    * Technical: \"Explain the difference between lists and tuples in Python.\"\n    * Behavioral: \"Describe a time you faced a challenging technical problem and how you solved it.\" (Relating to \"problem-solving\" implied in software engineering).\n\n3. **Answer Evaluation:**  For each user answer, I need to evaluate:\n    * **Confidence Level:**  This is tricky without actual audio input. I'll have to rely on *textual cues* of confidence.  For now, I can assume a simple heuristic:  longer answers with positive language might be considered more confident.  This is a simplification.  I'll use a scale of 1-10.  Tips for improvement could be generic like \"speak clearly,\" \"maintain eye contact\" (although this is text-based).\n    * **Correctness:**  I need a way to check if the answer is correct.  For technical questions, I'll need a predefined set of correct answers or key points.  For behavioral questions, it's more about the *quality* of the story and if it addresses the question.  I'll need to define some criteria for \"correctness.\"\n    * **Improvement Suggestions:**  If the answer isn't perfect, I need to provide actionable feedback.  This could be about structure, examples, avoiding jargon, etc.\n\n4. **Feedback Generation:** After evaluation, I need to present feedback on:\n    * **Confidence:** Rating (1-10) and tips.\n    * **Correctness:**  Correct/Incorrect and explanation.\n    * **Extra Points:**  For good answers, offer advice to make them even better (examples, transferable skills, role-specific relevance).\n\n5. **Follow-Up Questions:** Based on the user's answer, I need to generate follow-up questions.  These should delve deeper into the topics raised in the answer. If the user mentioned \"object-oriented programming\" when talking about Java, a follow-up could be \"Can you explain the principles of OOP?\"\n\n6. **Session Management:**  The system should continue asking questions and providing feedback until the user ends the session.\n\n**Constraint:**  Questions *must* be based on the resume content and the specified job role.  No questions outside of these boundaries.\n\n**Example Scenario:**\n\nResume (Simplified):\n```\nSkills: Python, Java, Data Structures, Algorithms\nExperience: Intern at Tech Company X\nEducation: BS in Computer Science\n```\nJob Role: Software Engineer\n\nQuestion 1 (Technical - based on \"Python\"): \"Explain the concept of decorators in Python.\"\nUser Answer: ...\nEvaluate Answer (Confidence, Correctness, Improvement).\nFeedback.\nFollow-up Question (e.g., \"Can you give an example of when you would use a decorator?\").\nQuestion 2 (Behavioral - based on \"Experience\" and general SE role): \"Tell me about a challenging project you worked on during your internship.\"\nUser Answer: ...\nEvaluate Answer.\nFeedback.\nFollow-up Question.\n... and so on.\n\n**Pre-computation/Pre-analysis:**\n\nFor question generation, I can create categories of questions related to typical resume sections (skills, experience, projects, education) and tailor them to the job role.  For example, for \"Skills,\" if the role is Software Engineer and a skill is \"Java,\" I can have a pool of Java-related technical questions. For \"Experience,\" I can have behavioral questions related to teamwork, problem-solving, etc.  For \"Projects,\" questions about project scope, challenges, outcomes.\n\nFor answer evaluation, I'll need to think about \"correct answers\" for technical questions and criteria for good behavioral answers. This will be more rule-based initially, and can be improved with more sophisticated NLP later.\n\nLet's start building the system step by step. I'll focus on:\n1. Resume parsing (simple keyword extraction).\n2. Question generation (based on keywords and role - initial set of question templates).\n3. Basic answer evaluation (confidence - rudimentary, correctness - keyword matching for technical, criteria for behavioral).\n4. Feedback generation (structured output).\n5. Follow-up questions (simple follow-up based on keywords in the answer)."},
        {text: "Okay, I understand! I'm ready to be your AI mock interviewer. Please provide me with your resume content and the job role you are applying for.\n\nOnce you provide this information, I will:\n\n1.  **Analyze your resume** to identify key skills, experiences, projects, and education relevant to the job role.\n2.  **Generate a set of interview questions** tailored to your resume and the job role. These questions will be a mix of technical and behavioral, depending on the role, and will be in a random order.\n3.  **Ask you the first question.**\n4.  **After you provide your answer**, I will evaluate it based on:\n    *   **Confidence Level (1-10):**  Based on your answer's tone and structure.\n    *   **Correctness:**  Compared to expected answers and industry best practices.\n    *   **Areas for Improvement:**  Specific, actionable feedback.\n5.  **Provide you with feedback** on your confidence, correctness, and suggestions for improvement.\n6.  **Ask a follow-up question** based on your answer to probe deeper.\n\n**Remember**:  All questions will be directly related to the content of your resume and the job role you specify. I will not ask questions that are outside of these boundaries.\n\n**Please provide your resume content and the job role so we can begin!**  I'm looking forward to helping you prepare for your interview."},
      ],
    },
  ])
  // const {
  //   transcript,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition
  // } = useSpeechRecognition();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const textToSpeech = (text) => {
    let speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };


  const handleStartInterview = async (user_res) => {
    if (!user_res) return
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_res, history }),
      })
      if (response.ok) {
        setIsInterviewStarted(true)
        const { result } = await response.json();

        console.log(result);
        

        setAiRes(result)
        textToSpeech(result)

        const paragraphs = result.trim().split("\n\n");
        const lastParagraph = paragraphs[paragraphs.length - 1];

        setHistory((prev) => [...prev, { role: "user", parts: [{ text: user_res }] }, { role: "model", parts: [{ text: lastParagraph }] }])
      } else {
        console.error("Failed to start interview")
      }
    } catch (error) {
      console.error("Error starting interview:", error)
    }
    finally {
      setIsLoading(false)
    }
  }


  const handleExtractText = async (e) => {
    e.preventDefault();
    if (!file || !role) return
    setIsLoading(true)
    try {
      const reader = new FileReader();

      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          let pageText = "";

          let lastY, textLine = [];
          textContent.items.forEach((item) => {
            if (lastY === item.transform[5] || !lastY) {
              textLine.push(item.str);
            } else {
              pageText += textLine.join(' ') + '\n';
              textLine = [item.str];
            }
            lastY = item.transform[5];
          });
          pageText += textLine.join(' ');

          extractedText += pageText + "\n";
        }
        handleStartInterview(`This is my resume text : ${extractedText} and I am applying for the role of ${role}`);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error extracting text:", error);
    }
    finally{
      setIsLoading(false)
    }
  };

  var recognition;

  const handleStartRecording = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognition) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = function () {
        console.log("We are listening...");
        setUserRes(""); // Clear previous results
        setIsRecording(true);
      };

      recognition.onresult = function (event) {
        let interimTranscript = ""; // Stores live text
        let finalTranscript = ""; // Stores final confirmed text

        for (let i = 0; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " "; // Finalized text
          } else {
            interimTranscript += transcript + " "; // Live text
          }
        }

        setUserRes(finalTranscript || interimTranscript); // Update UI in real-time
      };

      recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = function () {
        console.log("Speech recognition stopped.");
        setIsRecording(false);
      };
    }
    recognition.start();
  };

  const handleStopRecording = () => {
    if (recognition) {
      recognition.stop();
      console.log("Recording stopped.");
    }
    setIsRecording(false);
  };

  const sendAudioToAI = async (transcriptionText) => {
    window.speechSynthesis.cancel();  
    const user_res = transcriptionText;
    const requestBody = JSON.stringify({ user_res, history });
    setIsLoading(true)
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody,
      });

      if (response.ok) {
        const { result } = await response.json();

        const paragraphs = result.trim().split("\n\n");
        const lastParagraph = paragraphs[paragraphs.length - 1];
        
        setAiRes(result)
        textToSpeech(result)

        setHistory((prev) => [
          ...prev,
          { role: "user", parts: [{ text: user_res }] },
          { role: "model", parts: [{ text: lastParagraph }] }
        ]);
      } else {
        console.error("Failed to process text");
      }
    } catch (error) {
      console.error("Error processing text:", error);
    }
    finally{
      setIsLoading(false);
      setUserRes("")
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendAudioToAI(userRes);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-6 text-center text-black"
        >
          AI Interviewer
        </motion.h1>

        <AnimatePresence mode="wait">
          {!isInterviewStarted ? (
            <motion.form
              key="interview-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleExtractText}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="resume" className="block text-sm font-medium text-gray-800">
                  Upload Resume (PDF)
                </Label>
                <div className="mt-1 flex items-center">
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
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="mr-2 h-5 w-5 text-gray-400" />
                    Choose file
                  </Button>
                  <span className="ml-3 text-sm text-gray-400">{file ? file.name : "No file chosen"}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-800">
                  Job Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="mt-1 bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full text-white"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Start Interview"}
              </Button>
            </motion.form>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">AI Response:</h3>
                <div style={{ whiteSpace: "pre-wrap" }}>{aiRes}</div>
              </div>
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Your Response:</h3>
                <Input
                  type="text"
                  value={userRes}
                  onChange={(e) => setUserRes(e.target.value)}
                  placeholder="Type your response..."
                  onKeyDown={handleKeyDown}
                  className="flex-grow"
                />
                <Button
                  className="w-full text-white"
                  disabled={isLoading}
                  onClick={()=>{sendAudioToAI(userRes)}}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Okay"}
                </Button>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto mb-4">
                {history.slice(3).map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-3 rounded-lg ${message.role === "user" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                  >
                    <p className="font-semibold">{message.role === "user" ? "You" : "AI Interviewer"}</p>
                    <p>{message.parts[0].text}</p>
                  </div>
                ))}

              </div>
              <div className="flex justify-center">
                <Button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`px-6 py-3 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                  {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}