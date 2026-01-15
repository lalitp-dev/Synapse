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
import { useAuthStore } from "../../src/features/auth/store/useAuthStore";
export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    // 1. Call Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
      setLoading(false);
    } else {
      // 2. Update Global Store
      setSession(data.session);
      // 3. Navigate will be handled by the Root Layout protector later,
      // but for now we manually push to tabs to test.
      router.replace("/(tabs)");
    }
  }

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <View className="mb-10">
        <Text className="text-primary text-4xl font-bold mb-2">Synapse.</Text>
        <Text className="text-gray-400 text-lg">
          Welcome back to your second brain.
        </Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-4">
        <View>
          <Text className="text-gray-300 mb-2 font-medium">Email</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-700 focus:border-primary"
            placeholder="elon@mars.com"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-gray-300 mb-2 font-medium">Password</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-700 focus:border-primary"
            placeholder="••••••••"
            placeholderTextColor="#64748B"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`bg-primary p-4 rounded-xl items-center mt-4 ${
            loading ? "opacity-70" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
