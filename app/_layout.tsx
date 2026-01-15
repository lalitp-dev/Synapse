import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { QueryProvider } from "../src/core/providers/QueryProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          {/* note-editor is a modal, so we set presentation: 'modal' */}
          <Stack.Screen
            name="note-editor"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
