"use client";

import { motion } from "framer-motion";
import { UserPlus, Link2, Calendar } from "lucide-react";
import Link from "next/link";

function Hero() {
  const companies = [
    "Goldman Sachs",
    "Morgan Stanley",
    "J.P. Morgan",
    "BlackRock",
    "McKinsey",
    "Bain",
    "BCG",
    "Jane Street",
    "Two Sigma",
    "D.E. Shaw",
    "Citadel",
    "Bridgewater",
    "Google",
    "Microsoft",
    "Meta",
    "Amazon",
    "Apple",
    "Stripe",
    "Databricks"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Hero Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Stop networking.
          <br />
          Start connecting.
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Skip the cold LinkedIn requests, guessing email formats, and fishing for things in common. 
          Speak to professionals who actually want to speak to you.
        </p>

        {/* Network Label */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-400 mb-4 tracking-wide uppercase">
            Our network includes professionals at:
          </p>

          {/* Company List - Scrolling Marquee */}
          <div className="relative overflow-hidden py-4">
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              className="flex gap-3 whitespace-nowrap"
            >
              {[...companies, ...companies].map((company, idx) => (
                <span
                  key={idx}
                  className="text-slate-400 text-sm md:text-base"
                >
                  {company}
                  {idx < companies.length * 2 - 1 && (
                    <span className="mx-3 text-emerald-500">•</span>
                  )}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/waitlist/join">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30"
          >
            Join the Waitlist
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

function ProblemFraming() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Spotlight gradient effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          College recruiting feels like
          <br />
          waging a war in the dark.
        </h2>

        <p className="text-xl md:text-2xl text-emerald-400 font-medium">
          Let Connect2 light the way.
        </p>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign up",
      description: "Share your background, interests, and career goals.",
    },
    {
      icon: Link2,
      title: "Get matched",
      description: "We connect you with professionals aligned with your aspirations.",
    },
    {
      icon: Calendar,
      title: "Book instantly",
      description: "Automatically schedule a time that works for both of you.",
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
            >
              <div className="bg-emerald-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-emerald-400" />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                {step.title}
              </h3>

              <p className="text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScarcityLaunch() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl mx-auto text-center"
      >
        {/* Badge */}
        <div className="inline-block mb-6">
          <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-500/20">
            Founding Cohort
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          We&apos;re starting at Brown.
        </h2>

        <p className="text-2xl md:text-3xl text-slate-300 mb-12 font-medium">
          Capped at 200 students.
        </p>

        {/* CTA */}
        <Link href="/waitlist/join">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-12 py-5 rounded-lg font-semibold text-lg transition-all shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-400/40"
          >
            Request Early Access
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Hero />
      <ProblemFraming />
      <HowItWorks />
      <ScarcityLaunch />
    </div>
  );
}
