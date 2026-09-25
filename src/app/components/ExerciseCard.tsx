import { urlFor } from "@/lib/sanity/client";
import { Exercise, ExercisesQueryResult } from "@/lib/sanity/types";
import { getDifficultyColor, getDifficultyText } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean; // Assuming ExercisesQueryResult is the type for an exercise item
}

function ExerciseCard({ item, onPress, showChevron }: ExerciseCardProps) {

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100"
    >
      <View className="flex-row p-4">
        <View className="w-20 h-20 bg-white rounded-xl mr-4 overflow-hidden">
          {item.image?.asset?._ref ? (
            <Image
              source={{ uri: urlFor(item.image.asset._ref).url() }}
              resizeMode="contain"
              className="w-full h-full"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
              <Ionicons name="fitness" size={24} color="white" />
            </View>
          )}
        </View>

        <View className="flex-1 justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {item.description || "No description available."}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className={`px-3 py-1 rounded-full ${getDifficultyColor(item.difficulty || "")}`}>
              <Text className="text-xs font-semibold text-white">
                {getDifficultyText(item.difficulty || "")}
              </Text>
            </View>

            {showChevron && (
              <TouchableOpacity className="pb-2">
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}

          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ExerciseCard;
