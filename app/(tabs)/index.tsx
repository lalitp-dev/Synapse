import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { useAuthStore } from "../../src/features/auth/store/useAuthStore"; // Check path (store/stores)
import { supabase } from "../../src/services/supabase";
import { KnowledgeGraph } from "../../src/features/graph/components/KnowledgeGraph";

export default function HomeScreen() {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-background relative">
      {/* 1. The Graph Background */}
      <View className="absolute inset-0">
        <KnowledgeGraph />
      </View>

      {/* 2. Foreground UI Overlay */}
      <View className="flex-1 pt-16 px-6 justify-between pb-24">
        {/* Top Section: Welcome */}
        <View>
          <Text className="text-white text-3xl font-bold tracking-tight">
            My Synapse
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <Text className="text-gray-400 font-medium">
              {session?.user.email}
            </Text>
          </View>
        </View>

        {/* Bottom Section: Actions */}
        <View className="items-end">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20"
          >
            <LogOut size={16} color="#F87171" />
            <Text className="text-red-400 ml-2 font-bold">Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
