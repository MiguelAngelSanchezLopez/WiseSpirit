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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4" role="main" aria-label="WiseSpirit decision maker">
      {showToast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <span>Accessibility mode available — press A to enable</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-white hover:text-gray-200 font-bold"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">WiseSpirit</h1>
        <button
          onClick={toggleAccessibility}
          onFocus={() => isEnabled && speakLabel("Toggle voice guidance", "button")}
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle voice guidance"
          aria-pressed={isEnabled}
        >
          {isEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <label htmlFor="airline-select" className="sr-only">
          Select airline
        </label>
        <select
          id="airline-select"
          className="w-full p-3 border rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full p-3 border rounded-lg shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full p-3 border rounded-lg shadow-sm placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
          disabled={isSubmitting}
          onFocus={() => isEnabled && speakLabel("Get Decision", "button")}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Get Decision"}
        </button>
      </form>

      {decisionData && (
        <div className="mt-8 w-full max-w-2xl" aria-live="polite" aria-label="Decision results">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Decision: {decisionData.action || decisionData.decision}
              </h2>
              {decisionData.confidence && (
                <span className={`text-sm font-medium ${getConfidenceColor(decisionData.confidence)}`}>
                  Confidence: {decisionData.confidence}
                </span>
              )}
            </div>

            {decisionData.reasoning && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Reasoning:</h3>
                <p className="text-gray-600">{decisionData.reasoning}</p>
              </div>
            )}

            {decisionData.operatorInstructions && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Instructions:</h3>
                <p className="text-gray-600 whitespace-pre-line">{decisionData.operatorInstructions}</p>
              </div>
            )}

            {decisionData.safetyNotes && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <h3 className="font-semibold text-yellow-800 mb-1">Safety Notes:</h3>
                <p className="text-yellow-700">{decisionData.safetyNotes}</p>
              </div>
            )}

            {decisionData.nextSteps && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Next Steps:</h3>
                <p className="text-gray-600">{decisionData.nextSteps}</p>
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
