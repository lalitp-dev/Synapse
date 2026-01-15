import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Search as SearchIcon, FileText } from "lucide-react-native";
import { SearchService } from "../../src/features/search/services/SearchService";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore"; // Check your path (store vs stores)
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const session = useAuthStore((state) => state.session);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim() || !session?.user.id) return;

    setLoading(true);
    try {
      const data = await SearchService.searchNotes(query, session.user.id);
      setResults(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background pt-16 px-4">
      <Text className="text-white text-3xl font-bold mb-6">Search Synapse</Text>

      {/* Search Bar */}
      <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 border border-gray-700 mb-6">
        <SearchIcon color="#94A3B8" size={20} />
        <TextInput
          className="flex-1 text-white ml-3 text-lg"
          placeholder="Ask your second brain..."
          placeholderTextColor="#64748B"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            query.length > 0 ? (
              <Text className="text-gray-500 text-center mt-10">
                No relevant memories found.
              </Text>
            ) : (
              <Text className="text-gray-500 text-center mt-10">
                Try searching for concepts like "Project ideas" or "Receipts"
              </Text>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-surface p-4 rounded-xl mb-3 border border-gray-800">
              <View className="flex-row justify-between mb-2">
                <FileText color="#4F46E5" size={16} />
                <Text className="text-emerald-400 text-xs">
                  {Math.round(item.similarity * 100)}% Match
                </Text>
              </View>
              <Text
                className="text-white text-base leading-6"
                numberOfLines={3}
              >
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
