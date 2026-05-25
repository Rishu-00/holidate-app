import React, { useState } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useFonts } from "expo-font";
import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  const [tripData, setTripData] = useState<any>({});

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', 
        alignItems: 'center', backgroundColor: '#0D0D0F' }}>
        <Text style={{ color: '#C9A84C', fontSize: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-trip/search-place" 
          options={{ headerShown: false }} />
        <Stack.Screen name="create-trip/select-traveler" 
          options={{ headerShown: false }} />
        <Stack.Screen name="create-trip/select-dates" 
          options={{ headerShown: false }} />
        <Stack.Screen name="create-trip/select-budget" 
          options={{ headerShown: false }} />
        <Stack.Screen name="create-trip/review-trip" 
          options={{ headerShown: false }} />
        <Stack.Screen name="create-trip/generate-trip" 
          options={{ headerShown: false }} />
        <Stack.Screen name="hotels" 
          options={{ headerShown: false }} />
      </Stack>
    </CreateTripContext.Provider>
  );
}