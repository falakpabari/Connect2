"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const INTERESTS = [
  "Consulting",
  "Finance",
  "Product",
  "SWE",
  "Quant",
  "Data Science",
  "Startups",
  "Other",
];

const GRAD_YEARS = [2026, 2027, 2028, 2029, 2030];

export default function WaitlistJoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "Brown University",
    gradYear: "",
    interests: [] as string[],
    targetCompanies: "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.university || !formData.gradYear) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (formData.interests.length === 0) {
      setError("Please select at least one interest.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6 py-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md w-full text-center"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 flex justify-center"
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-400" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-4">
              You&apos;re on the list!
            </h2>

            <p className="text-slate-300 mb-8 leading-relaxed">
              We&apos;ll email you when spots open. Get ready to connect with professionals who can help you reach your goals.
            </p>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                Back to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6 py-24">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl w-full"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-500/20">
                Founding Cohort
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Join the Waitlist
            </h1>
            <p className="text-slate-300 text-lg">
              Be among the first 200 students at Brown.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
                Full Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Jane Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                Email <span className="text-emerald-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="jane@brown.edu"
              />
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-semibold text-slate-200 mb-2">
                University <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                id="university"
                required
                value={formData.university}
                disabled
                className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label htmlFor="gradYear" className="block text-sm font-semibold text-slate-200 mb-2">
                Graduation Year <span className="text-emerald-400">*</span>
              </label>
              <select
                id="gradYear"
                required
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="">Select year</option>
                {GRAD_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Interests <span className="text-emerald-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Companies */}
            <div>
              <label htmlFor="targetCompanies" className="block text-sm font-semibold text-slate-200 mb-2">
                Target Companies <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="targetCompanies"
                value={formData.targetCompanies}
                onChange={(e) => setFormData({ ...formData, targetCompanies: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="e.g., McKinsey, Google, Goldman Sachs"
              />
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-semibold text-slate-200 mb-2">
                What are you hoping to get out of Connect2? <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Share your goals and what you'd like to learn..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </motion.button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
