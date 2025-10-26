/**
 * Voice feedback helper for accessibility
 * Reuses existing ElevenLabs integration
 */

let audioQueue: HTMLAudioElement[] = [];
let isPlaying = false;

async function playAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.onerror = () => resolve(); // Continue even if audio fails
    audio.play();
  });
}

async function speak(text: string): Promise<void> {
  try {
    const response = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.warn("Voice feedback failed:", response.status);
      return;
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    await playAudio(audioUrl);
    URL.revokeObjectURL(audioUrl);
  } catch (error) {
    console.warn("Voice feedback error:", error);
  }
}

export default speak;

