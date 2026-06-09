import { create } from "zustand";
import {
  DEFAULT_MOCK_MATCHINGS_MODEL,
  DEFAULT_MOCK_MATCHINGS_DESIGNER,
  type MockMatching,
} from "../lib/mockData";

interface MatchStore {
  modelMatchings: MockMatching[];
  designerMatchings: MockMatching[];
  addMatching: (m: MockMatching) => void;
  updateStatus: (id: string, status: "accepted" | "rejected") => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  modelMatchings: DEFAULT_MOCK_MATCHINGS_MODEL,
  designerMatchings: DEFAULT_MOCK_MATCHINGS_DESIGNER,

  addMatching: (m) =>
    set((s) => ({ modelMatchings: [m, ...s.modelMatchings] })),

  updateStatus: (id, status) =>
    set((s) => ({
      designerMatchings: s.designerMatchings.map((m) =>
        m.id === id ? { ...m, status } : m
      ),
    })),
}));
