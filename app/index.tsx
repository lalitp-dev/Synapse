import { View, Text, TouchableOpacity } from "react-native";
import { KnowledgeGraph } from "../src/features/graph/components/KnowledgeGraph";
import { useAuthStore } from "../src/features/auth/store/useAuthStore";

export default function HomeScreen() {
  const session = useAuthStore((state) => state.session);

  return (
    <View className="flex-1 bg-background relative">
      {/* Absolute positioning to put Graph in background */}
      <View className="absolute inset-0">
        <KnowledgeGraph />
      </View>

      {/* Foreground UI Overlay */}
      <View className="pt-16 px-6 pointer-events-none">
        {/* pointer-events-none allows touching the graph below if we added interaction */}
        <Text className="text-white text-3xl font-bold">My Synapse</Text>
        <Text className="text-gray-400">{session?.user.email} • Online</Text>
      </View>
    </View>
  );
}
