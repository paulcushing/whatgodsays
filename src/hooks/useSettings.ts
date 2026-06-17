"use client";

import { useCallback, useEffect, useState } from "react";

import {
  loadSettings,
  setGender as persistGender,
  setName as persistName,
  setPersonalize as persistPersonalize,
  type Gender,
  type Settings,
} from "@/storage/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const setPersonalize = useCallback((value: boolean) => {
    persistPersonalize(value);
    setSettings((current) =>
      current ? { ...current, personalize: value } : current,
    );
  }, []);

  const setName = useCallback((value: string) => {
    persistName(value);
    setSettings((current) => (current ? { ...current, name: value } : current));
  }, []);

  const setGender = useCallback((value: Gender) => {
    persistGender(value);
    setSettings((current) =>
      current ? { ...current, gender: value } : current,
    );
  }, []);

  return {
    ready: settings !== null,
    settings,
    setPersonalize,
    setName,
    setGender,
  };
}
