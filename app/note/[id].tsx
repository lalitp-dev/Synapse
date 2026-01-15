import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react-native";
import { supabase } from "../../src/services/supabase";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams(); // Get the ID from the URL
  const router = useRouter();

  // Fetch the specific note
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading)
    return (
      <View className="flex-1 bg-background justify-center">
        <ActivityIndicator color="#4F46E5" />
      </View>
    );

  return (
    <View className="flex-1 bg-background px-4 pt-12">
      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <ArrowLeft color="white" size={28} />
      </TouchableOpacity>

      <ScrollView>
        <Text className="text-gray-400 text-sm mb-2">
          {new Date(note.created_at).toLocaleDateString()}
        </Text>
        <Text className="text-white text-xl leading-8">{note.content}</Text>
      </ScrollView>
    </View>
  );
}
