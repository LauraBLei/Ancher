// Journal types and utilities
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createJournalEntry = (
  userId: string,
  title: string,
  content: string
): Omit<JournalEntry, "id" | "createdAt" | "updatedAt"> => {
  return {
    userId,
    title,
    content,
  };
};
