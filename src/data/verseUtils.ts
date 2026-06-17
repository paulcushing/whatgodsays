export type TruthCategory =
  | "Purpose"
  | "Identity"
  | "Fear"
  | "Anxiety"
  | "Rejection"
  | "Shame"
  | "Failure"
  | "Loneliness";

export type Truth = {
  id: string;
  category: TruthCategory;
  statement: string;
  personalized?: {
    masculine: string;
    feminine: string;
  };
  reference: string;
  verse: string;
  reflectionQuestion: string;
  journalPrompt: string;
};

export type Struggle = {
  id: string;
  label: string;
  category: TruthCategory;
  lie: string;
  truth: string;
  verses: { reference: string; verse: string }[];
  reflection: string;
  prayer: string;
};

export type ContentPayload = {
  version: string;
  truths: Truth[];
  struggles: Struggle[];
};
