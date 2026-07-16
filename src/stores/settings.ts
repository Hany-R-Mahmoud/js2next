import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BackupSettings } from '@/lib/learning/backup';

interface SettingsStore {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  setSettings: (settings: BackupSettings) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      reducedMotion: false,
      highContrast: false,
      fontSize: 'normal',
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      setFontSize: (size) => set({ fontSize: size }),
      setSettings: (settings) => set(settings),
      resetSettings: () => set({ reducedMotion: false, highContrast: false, fontSize: 'normal' }),
    }),
    { name: 'learn-next-settings' }
  )
);
