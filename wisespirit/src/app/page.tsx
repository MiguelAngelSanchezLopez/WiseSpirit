"use client";
import { useState } from "react";

export default function HomePage() {
  const [airlineName, setAirlineName] = useState("");
  const [bottleType, setBottleType] = useState("");
  const [volume, setVolume] = useState(0);
  const [decision, setDecision] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ airlineName, bottleType, volume }),
    });
    const data = await res.json();
    setDecision(data.decision);

    if (data.decision) {
      const voiceRes = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `Action: ${data.decision}` }),
      });
      const blob = await voiceRes.blob();
      setAudioUrl(URL.createObjectURL(blob));
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">WiseSpirit</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input
          className="w-full p-2 border rounded"
          placeholder="Airline name"
          value={airlineName}
          onChange={(e) => setAirlineName(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Bottle type"
          value={bottleType}
          onChange={(e) => setBottleType(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Remaining % (0-100)"
          type="number"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
          Get Decision
        </button>
      </form>

      {decision && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">Decision: {decision}</h2>
          {audioUrl && <audio controls src={audioUrl} className="mt-4" aria-label="Decision audio feedback" />}
        </div>
      )}
    </main>
  );
}
