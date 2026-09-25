import { client } from "@/lib/sanity/client";
import { GetWorkoutQueryResult, Workout } from "@/lib/sanity/types";
import { useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";

export const getWorkoutQuery = defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc){
  _id,
  date,
  duration,
  exercises[]{
    exercise-> {
      _id,
      name
    },
    sets[]{
      reps,
      weight,
      weightUnit,
      _type,
      _key
    },
    _type,
    _key
  }
}`)

export default function HistoryPage() {
  const {user} = useUser();
  const [workouts, setWorkouts] = useState<GetWorkoutQueryResult>([]);
  const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const {refresh} = useLocalSearchParams();
   const router = useRouter();

  const fetchWorkouts = async () => {
    if (!user?.id) return;
    try {
      const results = await client.fetch(getWorkoutQuery, {userId: user.id});
      setWorkouts(results)
      
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false)
    }
  }

 useEffect(() => {
    fetchWorkouts()
  }, [user?.id])


  useEffect(() => {
    if (refresh === "true"){
      fetchWorkouts();
      // Clear the refresh parameter from the URL
      router.replace("/(app)/(tabs)/history")
    }
  }, [refresh])

  const onRefresh = () => {
    setRefreshing(true)
    fetchWorkouts();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if(date.toDateString() === today.toDateString()){
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()){
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      })
    }
  }

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return "Duration not recorded";
    return formatDuration(seconds)

  }

  return (
    <SafeAreaView className="flex flex-1">
      <Text>History</Text>
    </SafeAreaView>
  );
}
