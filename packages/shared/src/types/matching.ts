export type MatchingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface Matching {
  id: string;
  modelId: string;
  designerId: string;
  status: MatchingStatus;
  treatmentStyle: string;
  referenceImageUrls: string[];
  availableDates: string[];
  proposedPrice: number;
  allowContentUsage: boolean;
  allowFaceExposure: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReservationStatus = "confirmed" | "changed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  matchingId: string;
  scheduledAt: string;
  location?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}
