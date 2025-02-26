import axios from 'axios';
import { CreateMoodRequest, Mood } from '../typings/Mood';

const API_URL = import.meta.env.VITE_API_URL

console.log(import.meta.env);

export const moodsService = {
  // Get all moods
  async getAll(): Promise<Mood[]> {
    try {
      const response = await axios.get(`${API_URL}/moods`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch moods:', error);
      return [];
    }
  },

  // Get a single mood by ID
  async getById(id: string): Promise<Mood> {
    const response = await axios.get(`${API_URL}/moods/${id}`);
    return response.data;
  },

  // Create a new mood
  async create(mood: CreateMoodRequest): Promise<Mood> {
    const response = await axios.post(`${API_URL}/moods`, mood);
    return response.data;
  },

  // Update an existing mood
  async update(id: string, mood: Partial<Mood>): Promise<Mood> {
    const response = await axios.put(`${API_URL}/moods/${id}`, mood);
    return response.data;
  },

  // Delete a mood
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/moods/${id}`);
  },

  // Wipe database (development only)
  async wipeDatabase(): Promise<{ message: string }> {
    if (import.meta.env.DEV) { 
      const response = await axios.post(`${API_URL}/wipe-db`);
      return response.data;
    }
    throw new Error('Database wipe is only available in development mode');
  }
};