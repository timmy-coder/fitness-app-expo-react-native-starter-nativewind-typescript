import { useAuth, useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "../components/GoogleSignIn";

export default function SignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignIn = async () => {

    if(!isLoaded) return;
    if(!emailAddress || !password){
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      // Handle the error in your app.
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling

      // This is the signup flow 
      //Add sign up api for fitness flow
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      // Handle the error in your app.
      return;
    }

    setIsVerifying(true);
      
    } catch (error) {
      
    }
    finally{
      setIsLoading(false)
    }

  
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      // Handle the error in your app.
      return;
    }

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      // Handle the error in your app.
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return (
      <View>
        <Text>You're signed in</Text>
      </View>
    );
  }

  if (isVerifying) {
    return (
      <View>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-6">
          <View className="flex-1 justify-center">
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Ionicons name="fitness" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                FitTracker
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                <Text>
                  Track your fitness journey {"\n"}and reach your goals
                </Text>
              </Text>
            </View>

            {/* Sign in form */}

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Welcome Back
              </Text>
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                  <Ionicons name="mail-outline" size={20} color={"#6B7280"} />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor={"#9CA3AF"}
                    onChangeText={setEmailAddress}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={"#6B7280"}
                  />
                  <TextInput
                    autoCapitalize="none"
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor={"#9CA3AF"}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    className="flex-1 ml-3 text-gray-900"
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>

            {/* Button */}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSignIn}
              disabled={isLoading}
              className={`rounded-xl py-4 shadow-sm  ${
                isLoading ? "bg-gray-400" : "bg-blue-600"
              } mb-4`}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <Ionicons name="refresh" size={20} color="white" />
                ) : (
                  <Ionicons name="log-in-outline" size={20} color="white" />
                )}

                <Text className="text-white font-semibold text-lg ml-2">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}

            <View className="flex-row items-center py-4">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-4 text-gray-500 text-sm">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Google sign button */}
            <GoogleSignIn/>

             {/* SignUp link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Link href={"/sign-up"} asChild>
            <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
            </Link>

          </View>
          </View>
        </View>

        <View className="pb-6">
          <Text className="text-center text-gray-500 text-sm">
            Start your fitness journey today
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
