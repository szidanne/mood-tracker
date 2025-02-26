export interface CreateMoodRequest {
  mood: string;
  note?: string;
}

export interface Mood extends CreateMoodRequest {
  id: string;
  timestamp: string;
}