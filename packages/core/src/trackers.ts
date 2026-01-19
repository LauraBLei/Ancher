// Tracker types and utilities
export interface Tracker {
  id: string;
  userId: string;
  name: string;
  type: "habit" | "mood" | "custom";
  createdAt: Date;
}

export interface TrackerEntry {
  id: string;
  trackerId: string;
  value: string | number;
  note?: string;
  timestamp: Date;
}

export const createTracker = (
  userId: string,
  name: string,
  type: Tracker["type"]
): Omit<Tracker, "id" | "createdAt"> => {
  return {
    userId,
    name,
    type,
  };
};
