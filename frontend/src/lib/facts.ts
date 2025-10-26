export type FactRecord = {
  id: string;
  text: string;
  status: string;
  createdAt: string;
};

export const FACTS_STORAGE_KEY = "microgen:facts";
