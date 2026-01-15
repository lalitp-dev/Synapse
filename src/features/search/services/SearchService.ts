import { supabase } from '../../../services/supabase';
import { GeminiService } from '../../ai/services/GeminiService';

export const SearchService = {
  /**
   * Performs a semantic search using Vector Embeddings.
   * This matches MEANING, not just keywords.
   */
  async searchNotes(query: string, userId: string) {
    try {
      // 1. Turn the user's search query into a Vector
      const embedding = await GeminiService.generateEmbedding(query);

      // 2. Call the Postgres RPC function
      const { data, error } = await supabase.rpc('match_notes', {
        query_embedding: embedding,
        match_threshold: 0.5, // 0.5 is a good baseline for relevance
        match_count: 10,
        user_id_param: userId
      });

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Search Error:', error);
      throw error;
    }
  }
};