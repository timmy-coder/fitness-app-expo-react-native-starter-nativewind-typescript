import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import {defineQuery} from 'groq'
import { client } from "@/lib/sanity/client";
import { Exercise, ExercisesQueryResult } from "@/lib/sanity/types";
import ExerciseCard from "@/app/components/ExerciseCard";

// Define the query outside the component for proper type generation and it must always be unique
export const exercisesQuery = defineQuery(`*[_type == "exercise"] {
  ...
}`);

function Exercises() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [exercises, setExercises] = React.useState<ExercisesQueryResult>([]);
  const [filteredExercises, setFilteredExercises] = React.useState<ExercisesQueryResult>([])

  const fetchExercises = async () => {
    try{
      // Fetch exercises from Sanity
      const exercise = await client.fetch(exercisesQuery);
      setExercises(exercise);
      setFilteredExercises(exercise);
    }
    catch(error){
      console.error("Error fetching exercises:", error);
      Alert.alert("Error", "Failed to fetch exercises. Please try again later.");
    }
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter((exercise: any) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);

  }, [searchQuery, exercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Exercise Library
        </Text>
        <Text className="text-gray-600 mt-1">
          Discover and master new exercises
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-800"
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Exercise List */}
      <FlatList 
      keyExtractor={(item) => item._id} // Unique key for each exercise
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 24}}
      data={filteredExercises} 
      renderItem={({ item }: { item: Exercise }) => (
        <ExerciseCard item={item} onPress={() => router.push(`/exercise-detail?id=${item._id}`)} />
      )}
      refreshControl={
        <RefreshControl

        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={["#3BB2F6"]} // Andriod
        tintColor={"#3BB2F6"} // iOS
        title="Pull to refresh exercises" // iOS
        titleColor={"#6B7280"} // iOS
        />
      }

      ListEmptyComponent={
        <View className="bg-white rounded-2xl p-8 items-center">
          <Ionicons name="fitness-outline" size={64} color="#9CA3AF"/>
          <Text className="text-xl font-semibold text-gray-900 mt-4">
            {searchQuery ? "No exercises found" : "Loading exercises..."}
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            {searchQuery ? "Try a different search term" : "Your exercises will appear here"}
          </Text>
        </View>
      }
      
      />
    </SafeAreaView>
  );
}

export default Exercises;
