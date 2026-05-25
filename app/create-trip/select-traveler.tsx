import {
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRouter, Href } from 'expo-router'
import { TravelerOptions } from '@/constants/Options'
import OptionCard from '@/components/CreateTrip/OptionCard'
import { CreateTripContext } from '@/context/CreateTripContext'

export default function SelectTraveler() {
  const navigation = useNavigation()
  const router = useRouter()

  const context = useContext(CreateTripContext)
  if (!context) {
    throw new Error('CreateTripContext must be used within CreateTripProvider')
  }

  const { tripData, setTripData } = context
  const [selectedTraveler, setSelectedTraveler] = useState<any>(
    tripData?.travelers || null
  )

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Who\'s Traveling',
      headerStyle: { backgroundColor: '#0D0D0F' },
      headerTintColor: '#F0EEE8',
      headerTitleStyle: { color: '#F0EEE8', fontWeight: '700' },
    })
  }, [])

  const setTripDetails = () => {
    if (!selectedTraveler) {
      Alert.alert('Please select a traveler category first!')
      return
    }

    setTripData({
      ...tripData,
      travelers: selectedTraveler,
    })

    router.push('/create-trip/select-dates' as Href)
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Who's Traveling? 👥</Text>
        <Text style={styles.subtitle}>
          Select the type of travelers in your group
        </Text>
      </View>

      <FlatList
        data={TravelerOptions}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setSelectedTraveler(item)}
            style={[
              styles.optionWrapper,
              selectedTraveler?.id === item.id && styles.optionWrapperActive
            ]}>
            <OptionCard
              option={item}
              selectedOption={selectedTraveler}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ gap: 12 }}
      />

      <TouchableOpacity
        onPress={setTripDetails}
        disabled={!selectedTraveler}
        style={[
          styles.button,
          !selectedTraveler && { opacity: 0.5 }
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
    padding: 24,
    paddingTop: 110,
    backgroundColor: '#0D0D0F',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F0EEE8',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6A6865',
    lineHeight: 20,
  },
  optionWrapper: {
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#2A2A30',
    overflow: 'hidden',
  },
  optionWrapperActive: {
    borderColor: '#C9A84C',
    backgroundColor: '#C9A84C11',
  },
  button: {
    backgroundColor: '#C9A84C',
    padding: 16,
    borderRadius: 50,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0D0D0F',
    fontSize: 15,
    fontWeight: '700',
  },
})