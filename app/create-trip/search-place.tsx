import { StyleSheet, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRouter, Href } from 'expo-router'
import { CreateTripContext } from '@/context/CreateTripContext'
import { FontAwesome } from '@expo/vector-icons'

export default function SearchPlace() {
  const navigation = useNavigation()
  const router = useRouter()
  const [destination, setDestination] = useState('')

  const context = useContext(CreateTripContext)
  if (!context) throw new Error('CreateTripContext not found')

  const { tripData, setTripData } = context

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Search Place',
      headerStyle: { backgroundColor: '#0D0D0F' },
      headerTintColor: '#F0EEE8',
      headerTitleStyle: { color: '#F0EEE8', fontWeight: '700' },
    })
  }, [])

  const handleNext = () => {
    if (!destination.trim()) {
      Alert.alert('Enter Destination', 'Please enter a destination!')
      return
    }

    const place = {
      name: destination,
      coordinates: null,
      url: null,
    }

    setTripData({
      ...tripData,
      locationinfo: place,
    })

    router.push('/create-trip/select-traveler' as Href)
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Where do you want to go? 🌍</Text>
      <Text style={styles.subtitle}>Enter your destination city or country</Text>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={16} color="#6A6865" />
        <TextInput
          style={styles.input}
          placeholder="e.g., Bali, Paris, Dubai, Kerala..."
          placeholderTextColor="#6A6865"
          value={destination}
          onChangeText={setDestination}
        />
        {destination && (
          <TouchableOpacity onPress={() => setDestination('')}>
            <FontAwesome name="times-circle" size={16} color="#A8A6A0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Preview Card */}
      {destination && (
        <View style={styles.previewCard}>
          <Text style={styles.previewEmoji}>📍</Text>
          <View>
            <Text style={styles.previewText}>{destination}</Text>
            <Text style={styles.previewSub}>Ready to explore!</Text>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} />

      {/* Button */}
      <TouchableOpacity
        disabled={!destination.trim()}
        onPress={handleNext}
        style={[
          styles.button,
          !destination.trim() && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0D0D0F',
    paddingHorizontal: 24,
    paddingTop: 110,
    paddingBottom: 24,
  },
  title: {
    color: '#F0EEE8',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6A6865',
    fontSize: 14,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E1E23',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: '#2A2A30',
  },
  input: {
    flex: 1,
    color: '#F0EEE8',
    fontSize: 15,
    paddingVertical: 14,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1A10',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: '#C9A84C',
  },
  previewEmoji: {
    fontSize: 24,
  },
  previewText: {
    color: '#F0EEE8',
    fontSize: 14,
    fontWeight: '600',
  },
  previewSub: {
    color: '#5DCAA5',
    fontSize: 11,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#C9A84C',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0D0F',
  },
})