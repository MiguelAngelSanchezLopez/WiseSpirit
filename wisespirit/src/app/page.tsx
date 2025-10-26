"use client";
import { useState, useEffect } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";

interface DecisionData {
  action?: string;
  decision?: string; // fallback for old format
  confidence?: string;
  reasoning?: string;
  operatorInstructions?: string;
  safetyNotes?: string;
  nextSteps?: string;
}

export default function HomePage() {
  const [airlineName, setAirlineName] = useState("");
  const [bottleType, setBottleType] = useState("");
  const [volume, setVolume] = useState(0);
  const [decisionData, setDecisionData] = useState<DecisionData | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { announce, speakLabel, speakChange, toggleAccessibility, isEnabled, showToast, setShowToast } = useAccessibility();

  // Announce airline selection when it changes
  useEffect(() => {
    if (airlineName && isEnabled) {
      speakChange("Airline", airlineName);
    }
  }, [airlineName, speakChange, isEnabled]);

  // Announce bottle type selection when it changes
  useEffect(() => {
    if (bottleType && isEnabled) {
      speakChange("Bottle type", bottleType);
    }
  }, [bottleType, speakChange, isEnabled]);

  // Announce volume changes
  useEffect(() => {
    if (volume > 0 && isEnabled) {
      speakChange("Volume", `${volume} percent`);
    }
  }, [volume, speakChange, isEnabled]);

  // Announce decision when it arrives
  useEffect(() => {
    if (decisionData && isEnabled) {
      const action = decisionData.action || decisionData.decision || "Unknown";
      announce(`Decision: ${action}`);
    }
  }, [decisionData, announce, isEnabled]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isEnabled) {
      announce("Processing decision, please wait");
    }

    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airlineName, bottleType, volume }),
      });
      const data = await res.json();
      setDecisionData(data);

      const actionText = data.action || data.decision;
      if (actionText) {
        const voiceRes = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: `Action: ${actionText}` }),
        });
        const blob = await voiceRes.blob();
        setAudioUrl(URL.createObjectURL(blob));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case "HIGH": return "text-emerald-400";
      case "MEDIUM": return "text-amber-400";
      case "LOW": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden" role="main" aria-label="WiseSpirit decision maker">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.1),_transparent_70%)]" />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
          <span className="font-medium">Accessibility mode available — press A to enable</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-white hover:text-blue-100 font-bold text-xl"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Header Bar */}
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
          WiseSpirit
        </h1>
        <button
          onClick={toggleAccessibility}
          onFocus={() => isEnabled && speakLabel("Toggle voice guidance", "button")}
          className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
            isEnabled
              ? "bg-emerald-500/90 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 focus:ring-2 focus:ring-emerald-400"
              : "bg-gray-700/50 hover:bg-gray-600 text-gray-200 focus:ring-2 focus:ring-blue-500"
          }`}
          aria-label="Toggle voice guidance"
          aria-pressed={isEnabled}
        >
          {isEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
        </button>
      </div>

      {/* Main Card */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-blue-100 mb-2">Bottle Decision Form</h2>
          <p className="text-gray-300 text-sm">Enter details to receive AI-powered handling instructions</p>
        </div>

        <label htmlFor="airline-select" className="sr-only">
          Select airline
        </label>
        <select
          id="airline-select"
          className="w-full p-4 bg-slate-800/70 rounded-xl border border-slate-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={airlineName}
          onChange={(e) => setAirlineName(e.target.value)}
          onFocus={() => isEnabled && speakLabel("Airline", "dropdown")}
          required
          aria-label="Select airline"
        >
          <option value="">Select an airline...</option>
          <option value="Aeromexico">Aeromexico</option>
          <option value="British Airways">British Airways</option>
          <option value="Delta Air Lines">Delta Air Lines</option>
          <option value="Emirates">Emirates</option>
          <option value="Lufthansa">Lufthansa</option>
          <option value="Qatar Airways">Qatar Airways</option>
          <option value="Singapore Airlines">Singapore Airlines</option>
          <option value="Swiss International Air Lines">Swiss International Air Lines</option>
        </select>
        
        <label htmlFor="bottle-select" className="sr-only">
          Select bottle type
        </label>
        <select
          id="bottle-select"
          className="w-full p-4 bg-slate-800/70 rounded-xl border border-slate-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          value={bottleType}
          onChange={(e) => setBottleType(e.target.value)}
          onFocus={() => isEnabled && speakLabel("Bottle type", "dropdown")}
          required
          aria-label="Select bottle type"
        >
          <option value="">Select bottle type...</option>
          <option value="Champagne">Champagne</option>
          <option value="Wine">Wine</option>
          <option value="Beer">Beer</option>
          <option value="Whiskey">Whiskey</option>
          <option value="Vodka">Vodka</option>
          <option value="Gin">Gin</option>
          <option value="Rum">Rum</option>
          <option value="Tequila">Tequila</option>
          <option value="Brandy">Brandy</option>
          <option value="Cognac">Cognac</option>
          <option value="Premium Scotch">Premium Scotch</option>
          <option value="Single Malt">Single Malt</option>
        </select>
        
        <label htmlFor="volume-input" className="sr-only">
          Enter remaining volume percentage
        </label>
        <input
          id="volume-input"
          className="w-full p-4 bg-slate-800/70 rounded-xl border border-slate-600 placeholder:text-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          placeholder="Remaining % (0-100)"
          type="number"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          onFocus={() => isEnabled && speakLabel("Volume", "number input")}
          required
          aria-label="Enter remaining volume percentage"
        />

        <button 
          className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          type="submit"
          disabled={isSubmitting}
          onFocus={() => isEnabled && speakLabel("Get Decision", "button")}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "⏳ Processing..." : "🚀 Get Decision"}
        </button>
      </form>

      {/* Decision Results */}
      {decisionData && (
        <div className="mt-8 w-full max-w-2xl" aria-live="polite" aria-label="Decision results">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Decision: {decisionData.action || decisionData.decision}
              </h2>
              {decisionData.confidence && (
                <span className={`text-sm font-semibold ${getConfidenceColor(decisionData.confidence)}`}>
                  Confidence: {decisionData.confidence}
                </span>
              )}
            </div>

            {decisionData.reasoning && (
              <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                <h3 className="font-semibold text-blue-300 mb-2">📊 Reasoning:</h3>
                <p className="text-blue-100">{decisionData.reasoning}</p>
              </div>
            )}

            {decisionData.operatorInstructions && (
              <div className="mb-6 p-4 bg-cyan-900/20 rounded-xl border border-cyan-700/30">
                <h3 className="font-semibold text-cyan-300 mb-2">📋 Instructions:</h3>
                <p className="text-cyan-100 whitespace-pre-line">{decisionData.operatorInstructions}</p>
              </div>
            )}

            {decisionData.safetyNotes && (
              <div className="mb-6 p-4 bg-amber-900/30 rounded-xl border-l-4 border-amber-500">
                <h3 className="font-semibold text-amber-300 mb-2">⚠️ Safety Notes:</h3>
                <p className="text-amber-100">{decisionData.safetyNotes}</p>
              </div>
            )}

            {decisionData.nextSteps && (
              <div className="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-700/30">
                <h3 className="font-semibold text-purple-300 mb-2">➡️ Next Steps:</h3>
                <p className="text-purple-100">{decisionData.nextSteps}</p>
              </div>
            )}

            {audioUrl && (
              <div className="text-center">
                <audio controls src={audioUrl} className="mt-4 w-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
