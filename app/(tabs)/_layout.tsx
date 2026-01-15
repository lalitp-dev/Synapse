import { Tabs, useRouter } from "expo-router"; // <--- Added useRouter
import { View, TouchableOpacity } from "react-native"; // <--- Added TouchableOpacity
import { Home, Search, PlusCircle } from "lucide-react-native";

export default function TabLayout() {
  const router = useRouter(); // <--- Initialize Router

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderTopColor: "#1E293B",
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* The Middle "Magic" Button */}
      <Tabs.Screen
        name="create"
        options={{
          title: "", // No text label
          tabBarIcon: ({ color }) => (
            // Visuals only
            <View className="bg-primary p-3 rounded-full -mt-8 shadow-lg shadow-indigo-500/50">
              <PlusCircle size={30} color="white" />
            </View>
          ),
          // THE FIX: We completely override the button component.
          // Instead of a standard tab, it's just a Touchable that pushes a new route.
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                // Ignore the default "switch tab" behavior
                // Go to our Modal screen instead
                router.push("/note-editor");
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
