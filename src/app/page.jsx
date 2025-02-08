"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Star, Users, Brain, Target, Sparkles } from "lucide-react"

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02, translateY: -5 }}
    whileTap={{ scale: 0.98 }}
    className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center text-center group hover:bg-white/15 transition-all duration-300 border border-white/10"
  >
    <motion.div
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 bg-gradient-to-br from-white/20 to-white/5 p-4 rounded-xl"
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-bold mt-6 mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-base text-gray-300 leading-relaxed">{description}</p>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
  </motion.div>
)

const StepIndicator = ({ number, text, isLast }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex items-center group"
  >
    <div className="relative">
      <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        whileHover={{ scale: 1.2, opacity: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-50"
      />
    </div>
    <span className="text-lg font-medium ml-4 text-white group-hover:text-blue-200 transition-colors">
      {text}
    </span>
    {!isLast && (
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        className="hidden md:block h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent ml-4 mr-4 flex-grow"
      />
    )}
  </motion.div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Brain size={60} className="text-blue-400" />
          </motion.div>
          <h1 className="text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Interviewer
          </h1>
          <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master your interview skills with our advanced AI-powered platform. Get real-time feedback and personalized coaching.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/interview">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform">
                Start Your Interview
                <ArrowRight className="ml-2 animate-pulse" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24"
        >
          <FeatureCard
            icon={<Target size={40} className="text-blue-400" />}
            title="Realistic Scenarios"
            description="Experience industry-specific interview questions tailored to your role and experience level."
          />
          <FeatureCard
            icon={<Sparkles size={40} className="text-purple-400" />}
            title="Instant Feedback"
            description="Get real-time analysis of your responses with actionable insights to improve your performance."
          />
          <FeatureCard
            icon={<Users size={40} className="text-pink-400" />}
            title="Personalized Practice"
            description="Customize your interview experience with AI-driven adaptations based on your progress."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Path to Success
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
            <StepIndicator number="1" text="Upload Resume" />
            <StepIndicator number="2" text="Choose Role" />
            <StepIndicator number="3" text="Start Interview" />
            <StepIndicator number="4" text="Get Feedback" isLast />
          </div>
        </motion.div>
      </div>
    </div>
  )
}