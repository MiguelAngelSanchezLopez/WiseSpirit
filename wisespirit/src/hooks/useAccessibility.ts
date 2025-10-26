"use client";

import { useEffect, useState, useCallback } from "react";
import speak from "@/lib/voice";

interface AccessibilitySettings {
  enabled: boolean;
  keyboardMode: boolean;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") return { enabled: false, keyboardMode: false };
    
    const saved = localStorage.getItem("accessibility-mode");
    return saved ? JSON.parse(saved) : { enabled: false, keyboardMode: false };
  });

  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  // Detect keyboard vs mouse navigation
  useEffect(() => {
    const handleMouseDown = () => {
      setIsKeyboardNavigation(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
        setIsKeyboardNavigation(true);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-enable if keyboard navigation detected
  useEffect(() => {
    if (isKeyboardNavigation && !settings.enabled) {
      setSettings((prev) => {
        const updated = { ...prev, enabled: true };
        if (typeof window !== "undefined") {
          localStorage.setItem("accessibility-mode", JSON.stringify(updated));
        }
        return updated;
      });
    }
  }, [isKeyboardNavigation, settings.enabled]);

  const announce = useCallback((text: string) => {
    if (settings.enabled) {
      speak(text);
    }
  }, [settings.enabled]);

  const toggleAccessibility = useCallback(() => {
    const updated = { ...settings, enabled: !settings.enabled };
    setSettings(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessibility-mode", JSON.stringify(updated));
    }
    if (updated.enabled) {
      speak("Accessibility mode enabled");
    } else {
      speak("Accessibility mode disabled");
    }
  }, [settings]);

  return {
    announce,
    toggleAccessibility,
    isEnabled: settings.enabled,
  };
}

