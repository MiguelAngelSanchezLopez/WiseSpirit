"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import speak from "@/lib/voice";

interface AccessibilitySettings {
  enabled: boolean;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({ enabled: false });
  const [showToast, setShowToast] = useState(false);
  const hasShownPrompt = useRef(false);
  const mouseMoved = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate client-side settings from localStorage
  useEffect(() => {
    if (globalThis.window !== undefined) {
      const saved = globalThis.localStorage.getItem("accessibility-mode");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
        } catch (e) {
          console.warn("Failed to parse accessibility settings:", e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Show activation prompt after 3 seconds if no mouse movement
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!settings.enabled && !mouseMoved.current && !hasShownPrompt.current) {
        setShowToast(true);
        speak("Press the A key to activate accessibility mode.");
        hasShownPrompt.current = true;
      }
    }, 3000);

    const handleMouseMove = () => {
      mouseMoved.current = true;
      globalThis.removeEventListener("mousemove", handleMouseMove);
    };

    globalThis.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener("mousemove", handleMouseMove);
    };
  }, [settings.enabled]);

  // Listen for 'A' key to activate accessibility mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a" && !settings.enabled && e.target === document.body) {
        e.preventDefault();
        const updated = { enabled: true };
        setSettings(updated);
        setShowToast(false);
        if (globalThis.window !== undefined) {
          globalThis.localStorage.setItem("accessibility-mode", JSON.stringify(updated));
        }
        speak("Accessibility mode enabled. You can now navigate with keyboard and hear voice feedback.");
      }
    };

    globalThis.addEventListener("keydown", handleKeyPress);
    return () => globalThis.removeEventListener("keydown", handleKeyPress);
  }, [settings.enabled]);

  const announce = useCallback((text: string) => {
    if (settings.enabled) {
      speak(text);
    }
  }, [settings.enabled]);

  const speakLabel = useCallback((label: string, type: string) => {
    if (settings.enabled) {
      speak(`${label}. ${type}`);
    }
  }, [settings.enabled]);

  const speakChange = useCallback((label: string, value: string) => {
    if (settings.enabled) {
      speak(`${label} set to ${value}`);
    }
  }, [settings.enabled]);

  const toggleAccessibility = useCallback(() => {
    const updated = { enabled: !settings.enabled };
    setSettings(updated);
    setShowToast(false);
    if (globalThis.window !== undefined) {
      globalThis.localStorage.setItem("accessibility-mode", JSON.stringify(updated));
    }
    if (updated.enabled) {
      speak("Accessibility mode enabled");
    } else {
      speak("Accessibility mode disabled");
    }
  }, [settings.enabled]);

  return {
    announce,
    speakLabel,
    speakChange,
    toggleAccessibility,
    isEnabled: settings.enabled,
    showToast,
    setShowToast,
  };
}

