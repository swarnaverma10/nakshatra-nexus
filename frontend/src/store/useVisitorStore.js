import { create } from 'zustand'

const useVisitorStore = create((set, get) => ({
  visitorId: null,
  visitor: null,
  selfieUrl: null,
  avatarUrl: null,
  astrology: null,
  aura: null,
  spiritAnimal: null,
  archetype: null,
  wheelResult: null,
  destinyVault: null,
  geminiInsight: null,
  passportUrl: null,
  qrUrl: null,

  setVisitorId: (id) => set({ visitorId: id }),
  setVisitor: (v) => set({ visitor: v }),
  setSelfieUrl: (url) => set({ selfieUrl: url }),
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setAstrology: (data) => set({ astrology: data }),
  setAura: (data) => set({ aura: data }),
  setSpiritAnimal: (data) => set({ spiritAnimal: data }),
  setArchetype: (data) => set({ archetype: data }),
  setWheelResult: (data) => set({ wheelResult: data }),
  setDestinyVault: (data) => set({ destinyVault: data }),
  setGeminiInsight: (text) => set({ geminiInsight: text }),
  setPassportUrl: (url) => set({ passportUrl: url }),
  setQrUrl: (url) => set({ qrUrl: url }),

  reset: () => set({
    visitorId: null, visitor: null, selfieUrl: null, avatarUrl: null,
    astrology: null, aura: null, spiritAnimal: null, archetype: null,
    wheelResult: null, destinyVault: null, geminiInsight: null,
    passportUrl: null, qrUrl: null,
  }),
}))

export default useVisitorStore
