import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
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

export default function SignUp() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp.password({ emailAddress, password });
      if (error) {
        // Handle the error in your app.
        console.log(error);
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        // Handle the error in your app.
        console.log(sendError);
        return;
      }

      setIsVerifying(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    if (!code) {
      Alert.alert("Error", "Please enter the verfication code");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        // Handle the error in your app.
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        // Handle the error in your app.
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Text>You're signed in</Text>
      </View>
    );
  }

  if (isVerifying) {
    return (
      <SafeAreaView className="bg-gray-50" style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 px-6">
            <View className="flex-1 justify-center">
              <View className="items-center mb-8">
                <View className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                  <Ionicons name="fitness" size={40} color="white" />
                </View>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </Text>
                <Text className="text-lg text-gray-600 text-center">
                  <Text>
                    We've sent a verification code to {"\n"} {emailAddress}
                  </Text>
                </Text>
              </View>

              {/* Verification form */}
              <View className="bg-white rounded-2xl p-6 shadow-2m border border-gray-100 mb-6">
                <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Enter Verification Code
                </Text>
                {/* Code innout */}
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200 mb-6">
                  <Ionicons name="key-outline" size={20} color={"#6B7280"} />
                  <TextInput
                    value={code}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={"#9CA3AF"}
                    onChangeText={setCode}
                    className="flex-1 ml-3 text-gray-900 text-center text-lg tracking-widest"
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={isLoading}
                  className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-green-600"}
              
              `}
                  activeOpacity={0.8}
                >
                  <View className={`flex-row items-center justify-center`}>
                    {isLoading ? (
                      <Ionicons name="refresh" size={20} color={"white"} />
                    ) : (
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color={"white"}
                      />
                    )}
                    <Text className="text-white font-semibold text-lg ml-2">
                      {isLoading ? "verifying..." : "Verify Email"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Resend Code */}
                <TouchableOpacity className="py-2">
                  <Text className="text-blue-600 font-medium text-center">
                    <Link href={"/sign-up"}> Didn't recieve the code? Resend</Link>
                   
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}

          <View className="pb-6">
            <Text className="text-center text-gray-500 text-sm">
              Almost there! Just one more step
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      // <View style={styles.container}>
      //   <TextInput
      //     style={styles.input}
      //     value={code}
      //     placeholder="Enter your verification code"
      //     onChangeText={setCode}
      //     keyboardType="numeric"
      //   />
      //   <Button title="Verify" onPress={handleVerify} />
      // </View>
    );
  }

  return (
    <SafeAreaView className="bg-gray-50" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-6">
          {/* Main */}

          <View className="flex-1 justify-center">
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Ionicons name="fitness" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Join FitTracker
              </Text>
              <Text className="text-lg text-gray-600 text-center">
                <Text>
                  Track your fitness journey {"\n"}and reach your goals
                </Text>
              </Text>
            </View>

            {/* Sign Up form */}

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Create Your Account
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
                <Text className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSignUp}
                disabled={isLoading}
                className={`rounded-xl py-4 shadow-sm  ${
                  isLoading ? "bg-gray-400" : "bg-blue-600"
                } mb-4`}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <Ionicons name="refresh" size={20} color="white" />
                  ) : (
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color="white"
                    />
                  )}

                  <Text className="text-white font-semibold text-lg ml-2">
                    {isLoading ? "Signing In..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text>
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>

            {/* SignUp link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600">Already have an account?</Text>
              <Link href={"/sign-in"} asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        {/* Footer */}

        <View className="pb-6">
          <Text className="text-center text-gray-500 text-sm">
            Ready to transform your fitness?
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
