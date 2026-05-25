import {
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRouter, Href } from 'expo-router'
import CalendarPicker from 'react-native-calendar-picker'
import { CreateTripContext } from '@/context/CreateTripContext'

export default function SelectDates() {
  const navigation = useNavigation()
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const context = useContext(CreateTripContext)
  if (!context) {
    throw new Error('CreateTripContext must be used within CreateTripProvider')
  }

  const { tripData, setTripData } = context

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: 'Select Travel Dates',
      headerStyle: { backgroundColor: '#0D0D0F' },
      headerTintColor: '#F0EEE8',
      headerTitleStyle: { color: '#F0EEE8', fontWeight: '700' },
    })
  }, [])

  const onDateChange = (date: any, type: any) => {
    if (type === 'START_DATE') {
      setStartDate(date)
      setEndDate(undefined)
    } else {
      setEndDate(date)
    }
  }

  const setTripDetails = () => {
    if (!startDate || !endDate) {
      Alert.alert('Please select both start and end dates!')
      return
    }

    const millisecondsDiff = endDate.getTime() - startDate.getTime()
    const totalTravelDays = Math.round(millisecondsDiff / (1000 * 60 * 60 * 24)) + 1

    if (totalTravelDays < 1) {
      Alert.alert('Please select at least one day.')
      return
    }

    setTripData({
      ...tripData,
      startDate: startDate.toLocaleDateString('en-IN'),
      endDate: endDate.toLocaleDateString('en-IN'),
      travelDuration: {
        startDate,
        endDate,
        totalTravelDays,
      },
    })

    router.push('/create-trip/select-budget' as Href)
  }

  const totalDays = startDate && endDate
    ? Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>When are you traveling? 📅</Text>
        <Text style={styles.subtitle}>
          Select your departure and return dates
        </Text>
      </View>

      <View style={styles.calendarContainer}>
  <CalendarPicker
    onDateChange={onDateChange}
    allowRangeSelection
    allowBackwardRangeSelect
    startFromMonday
    showDayStragglers
    maxRangeDuration={30}
    minDate={new Date()}
    selectedRangeStyle={{
      backgroundColor: '#C9A84C44'
    }}
    selectedDayStyle={{
      backgroundColor: '#C9A84C',
    }}
    selectedDayTextColor='#0D0D0F'
    textStyle={{
      color: '#F0EEE8',
      fontWeight: '600',
      fontSize: 14,
    }}
  />
</View>

      {/* Summary Card */}
      {startDate && endDate && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🗓️ Start Date</Text>
            <Text style={styles.summaryValue}>
              {startDate.toLocaleDateString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 0.5, borderTopColor: '#2A2A30', paddingTop: 12, marginTop: 12 }]}>
            <Text style={styles.summaryLabel}>📍 End Date</Text>
            <Text style={styles.summaryValue}>
              {endDate.toLocaleDateString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 0.5, borderTopColor: '#2A2A30', paddingTop: 12, marginTop: 12 }]}>
            <Text style={styles.summaryLabel}>⏱️ Total Days</Text>
            <Text style={[styles.summaryValue, { color: '#C9A84C' }]}>
              {totalDays} Days & {totalDays - 1} Nights
            </Text>
          </View>
        </View>
      )}

      <View style={styles.noteContainer}>
        <Text style={styles.noteEmoji}>💡</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.noteHeading}>Tip:</Text>
          <Text style={styles.noteText}>
            Tap the same date twice for a single-day trip.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={setTripDetails}
        disabled={!startDate || !endDate}
        style={[
          styles.button,
          (!startDate || !endDate) && { opacity: 0.5 }
        ]}
      >
        <Text style={styles.buttonText}>
          Continue →
        </Text>
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
    marginBottom: 16,
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
  calendarContainer: {
    backgroundColor: '#1E1E23',
    borderRadius: 16,
    padding: 12,
    marginVertical: 16,
    borderWidth: 0.5,
    borderColor: '#2A2A30',
  },
  summaryCard: {
    backgroundColor: '#1C1A10',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#C9A84C',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#A8A6A0',
    fontSize: 13,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#F0EEE8',
    fontSize: 14,
    fontWeight: '700',
  },
  noteContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    backgroundColor: '#1E1E23',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#2A2A30',
    marginBottom: 16,
  },
  noteEmoji: {
    fontSize: 18,
  },
  noteHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C9A84C',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    color: '#6A6865',
    lineHeight: 16,
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