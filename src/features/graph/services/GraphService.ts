import { supabase } from '../../../services/supabase';
// ... types ...

export const GraphService = {
  async fetchGraphData(userId: string) {
    // 1. GET REAL NOTES
    const { data: notes, error } = await supabase
      .from('notes')
      .select('id, content') // We only need ID and Title
      .eq('user_id', userId)
      .limit(50);

    if (error) throw error;

// ... inside fetchGraphData ...

    const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    const nodes = notes.map((note) => ({
      id: note.id,
      title: note.content, // Pass the full content, UI will truncate
      // Pick a random color from our palette
      color: colors[Math.floor(Math.random() * colors.length)], 
      r: 15 + Math.random() * 10,
      x: Math.random() * 300, 
      y: Math.random() * 500,
    }));
    // 3. Create Fake Links (Since we don't have explicit connections yet)
    // In Phase 8+, we would use Vector Similarity to create REAL links.
    const links: any[] = [];
    nodes.forEach((source, i) => {
      // Create a chain
      if (i < nodes.length - 1) {
        links.push({ source: source.id, target: nodes[i + 1].id });
      }
    });

    return { nodes, links };
  }
};