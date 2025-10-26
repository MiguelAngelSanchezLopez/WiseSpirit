/**
 * Voice feedback helper for accessibility
 * Reuses existing ElevenLabs integration
 * Prevents overlapping audio by canceling previous playback
 */

let currentAudio: HTMLAudioElement | null = null;

async function playAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve) => {
    // Stop and cancel any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = document.createElement("audio");
    currentAudio = audio;
    
    audio.src = audioUrl;
    audio.onended = () => {
      currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      currentAudio = null;
      resolve(); // Continue even if audio fails
    };
    audio.play().catch(() => {
      // Handle play() promise rejection
      currentAudio = null;
      resolve();
    });
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

