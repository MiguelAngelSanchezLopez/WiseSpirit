"use client";
import { useState } from "react";

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">WiseSpirit</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Airline name"
          value={airlineName}
          onChange={(e) => setAirlineName(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Bottle type"
          value={bottleType}
          onChange={(e) => setBottleType(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg shadow-sm"
          placeholder="Remaining % (0-100)"
          type="number"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <button className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition-colors">
          Get Decision
        </button>
      </form>

      {decisionData && (
        <div className="mt-8 w-full max-w-2xl">
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
                <audio controls src={audioUrl} className="mt-4" aria-label="Decision audio feedback" />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
