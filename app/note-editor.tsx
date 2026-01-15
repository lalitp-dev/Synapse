import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Camera, Save, X, Sparkles } from "lucide-react-native";
import { GeminiService } from "../src/features/ai/services/GeminiService";
import { supabase } from "../src/services/supabase";
import { useAuthStore } from "../src/features/auth/store/useAuthStore";

export default function NoteEditor() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);

  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Handle Image Picking
  const pickImage = async () => {
    try {
      // Request camera permissions first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"], // Fixed: Changed from ImagePicker.MediaType.Images
        allowsEditing: true,
        quality: 0.5, // Don't upload 4K images, it slows down AI
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Camera Error", "Failed to open camera.");
    }
  };

  // 2. Process with Gemini
  const processImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      const description = await GeminiService.analyzeImage(uri);
      // Append the AI's finding to the current note
      setContent((prev) => prev + "\n\n[AI Analysis]:\n" + description);
    } catch (e) {
      Alert.alert("AI Error", "Could not analyze image.");
      console.error("Image processing error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Save to Supabase
  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Empty Note", "Please add some content before saving.");
      return;
    }

    if (!session?.user?.id) {
      Alert.alert("Auth Error", "You must be logged in to save notes.");
      return;
    }

    setIsSaving(true);

    try {
      // Step A: Generate Embedding (Context-Aware part)
      const embedding = await GeminiService.generateEmbedding(content);

      // Step B: Save Note to Supabase
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: session.user.id,
          content: content,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (data) {
        // 1. Generate Embedding
        // Note: We use the text content + the AI description for the embedding
        const embedding = await GeminiService.generateEmbedding(content);

        // 2. Save to 'note_embeddings' table
        const { error: embeddingError } = await supabase
          .from("note_embeddings")
          .insert({
            note_id: data.id,
            user_id: session.user.id,
            embedding: embedding,
          });

        if (embeddingError) {
          console.error("Embedding Error:", embeddingError);
        }
      }

      Alert.alert("Success", "Note saved successfully!");
      router.back();
    } catch (e) {
      Alert.alert("Save Error", (e as Error).message);
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background pt-12 px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <X color="#94A3B8" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">New Synapse</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving || !content.trim()}
        >
          {isSaving ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <Save color={content.trim() ? "#4F46E5" : "#64748B"} size={28} />
          )}
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <TextInput
          className="text-white text-lg leading-relaxed min-h-[200px]"
          multiline
          placeholder="What's on your mind? (Type or snap a photo)"
          placeholderTextColor="#64748B"
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          autoFocus
        />

        {/* Image Preview */}
        {imageUri && (
          <View className="mt-4 relative">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-64 rounded-xl"
              resizeMode="cover"
            />
            {isProcessing && (
              <View className="absolute inset-0 bg-black/50 justify-center items-center rounded-xl">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-white mt-2 font-bold">
                  Gemini is analyzing...
                </Text>
              </View>
            )}
            {/* Remove image button */}
            {!isProcessing && (
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                className="absolute top-2 right-2 bg-black/70 rounded-full p-2"
              >
                <X color="#FFFFFF" size={20} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Toolbar */}
      <View className="mb-6 flex-row gap-4">
        <TouchableOpacity
          onPress={pickImage}
          disabled={isProcessing}
          className="flex-row items-center bg-surface px-4 py-3 rounded-full border border-gray-700"
        >
          <Camera color="#F8FAFC" size={20} />
          <Text className="text-white ml-2 font-medium">
            {isProcessing ? "Processing..." : "Magic Camera"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
