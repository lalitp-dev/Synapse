import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "../../src/services/supabase";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Registration Error", error.message);
      setLoading(false);
    } else {
      Alert.alert("Success", "Account created! Please sign in.");
      router.back(); // Go back to login
    }
  }

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <View className="mb-10">
        <Text className="text-white text-3xl font-bold mb-2">
          Create Account
        </Text>
        <Text className="text-gray-400">
          Start building your knowledge base.
        </Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-300 mb-2 font-medium">Email</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-700"
            placeholder="you@domain.com"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-gray-300 mb-2 font-medium">Password</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-700"
            placeholder="••••••••"
            placeholderTextColor="#64748B"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-white p-4 rounded-xl items-center mt-4"
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-background font-bold text-lg">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold">Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
