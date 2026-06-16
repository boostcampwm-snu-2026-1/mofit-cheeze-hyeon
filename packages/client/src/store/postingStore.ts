import { create } from "zustand";

export interface DesignerPosting {
  id: string;
  recruitStyle: string;
  proposedPrice: number;
  availableSlots: string[];
}

interface PostingStore {
  postings: DesignerPosting[];
  addPosting: (p: Omit<DesignerPosting, "id">) => void;
  updatePosting: (id: string, p: Partial<Omit<DesignerPosting, "id">>) => void;
  deletePosting: (id: string) => void;
}

const DEFAULT_POSTINGS: DesignerPosting[] = [
  {
    id: "post-1",
    recruitStyle: "레이어드 커트 + 스타일링",
    proposedPrice: 0,
    availableSlots: ["2026-06-20", "2026-06-21", "2026-06-22", "2026-06-25"],
  },
  {
    id: "post-2",
    recruitStyle: "C컬 자연 웨이브 펌",
    proposedPrice: 30000,
    availableSlots: ["2026-06-18", "2026-06-19", "2026-06-24"],
  },
];

export const usePostingStore = create<PostingStore>((set) => ({
  postings: DEFAULT_POSTINGS,
  addPosting: (p) =>
    set((s) => ({
      postings: [...s.postings, { ...p, id: `post-${Date.now()}` }],
    })),
  updatePosting: (id, p) =>
    set((s) => ({
      postings: s.postings.map((posting) =>
        posting.id === id ? { ...posting, ...p } : posting
      ),
    })),
  deletePosting: (id) =>
    set((s) => ({ postings: s.postings.filter((p) => p.id !== id) })),
}));
