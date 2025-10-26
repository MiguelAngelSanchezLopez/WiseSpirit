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
      case "HIGH": return "text-green-600";
      case "MEDIUM": return "text-yellow-600";
      case "LOW": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4" role="main" aria-label="WiseSpirit decision maker">
      {showToast && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-in fade-in zoom-in">
          <span className="font-medium">Accessibility mode available — press A to enable</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-white hover:text-blue-100 font-bold text-lg transition-colors"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-7xl font-bold mb-4 gradient-text tracking-tight">
          WiseSpirit
        </h1>
        <p className="text-lg text-gray-600 mb-4">AI-Powered Bottle Handling Assistant</p>
        
        {/* Accessibility Toggle */}
        <button
          onClick={toggleAccessibility}
          onFocus={() => isEnabled && speakLabel("Toggle voice guidance", "button")}
          className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isEnabled
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
              : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-label="Toggle voice guidance"
          aria-pressed={isEnabled}
        >
          {isEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
        </button>
      </div>

      {/* Input Fields Container */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        <div className="flex flex-col">
          <label htmlFor="airline-select" className="text-gray-700 font-semibold mb-2">
            Airline
          </label>
          <select
            id="airline-select"
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        </div>

        <div className="flex flex-col">
          <label htmlFor="bottle-select" className="text-gray-700 font-semibold mb-2">
            Bottle Type
          </label>
          <select
            id="bottle-select"
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="volume-input" className="text-gray-700 font-semibold mb-2">
            Remaining Volume (%)
          </label>
          <input
            id="volume-input"
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter remaining volume percentage"
            type="number"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            onFocus={() => isEnabled && speakLabel("Volume", "number input")}
            required
            aria-label="Enter remaining volume percentage"
          />
        </div>
        
        <button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 rounded-lg w-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg"
          type="submit"
          disabled={isSubmitting}
          onFocus={() => isEnabled && speakLabel("Get Decision", "button")}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "⏳ Processing..." : "🚀 Get Decision"}
        </button>
      </form>

      {decisionData && (
        <div className="mt-8 w-full max-w-2xl" aria-live="polite" aria-label="Decision results">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold gradient-text mb-3">
                Decision: {decisionData.action || decisionData.decision}
              </h2>
              {decisionData.confidence && (
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getConfidenceColor(decisionData.confidence)}`}>
                  Confidence: {decisionData.confidence}
                </span>
              )}
            </div>

            {decisionData.reasoning && (
              <div className="mb-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2 text-lg">📊 Reasoning</h3>
                <p className="text-blue-900">{decisionData.reasoning}</p>
              </div>
            )}

            {decisionData.operatorInstructions && (
              <div className="mb-6 p-5 bg-cyan-50 rounded-xl border border-cyan-100">
                <h3 className="font-semibold text-cyan-800 mb-2 text-lg">📋 Instructions</h3>
                <p className="text-cyan-900 whitespace-pre-line">{decisionData.operatorInstructions}</p>
              </div>
            )}

            {decisionData.safetyNotes && (
              <div className="mb-6 p-5 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                <h3 className="font-semibold text-amber-800 mb-2 text-lg">⚠️ Safety Notes</h3>
                <p className="text-amber-900">{decisionData.safetyNotes}</p>
              </div>
            )}

            {decisionData.nextSteps && (
              <div className="mb-6 p-5 bg-purple-50 rounded-xl border border-purple-100">
                <h3 className="font-semibold text-purple-800 mb-2 text-lg">➡️ Next Steps</h3>
                <p className="text-purple-900">{decisionData.nextSteps}</p>
              </div>
            )}

            {audioUrl && (
              <div className="text-center">
                <audio controls src={audioUrl} className="mt-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
